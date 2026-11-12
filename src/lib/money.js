import { store } from "../data/store";

export function cents(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function money(value) {
  return cents(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function pixPrice(price) {
  return cents(price * (1 - store.pixDiscount));
}

export function quote(lines, { couponApplied = false } = {}) {
  const subtotal = cents(lines.reduce((sum, line) => sum + line.price * line.qty, 0));
  const pieces = lines.reduce((sum, line) => sum + line.qty, 0);
  const bundle = pieces >= store.bundleMin ? cents(subtotal * store.bundleDiscount) : 0;
  const coupon = couponApplied ? cents(subtotal * store.firstPurchaseDiscount) : 0;

  let discount = 0;
  let discountLabel = "";
  if (bundle > 0 && bundle >= coupon) {
    discount = bundle;
    discountLabel = `Leve ${store.bundleMin} · ${Math.round(store.bundleDiscount * 100)}% off`;
  } else if (coupon > 0) {
    discount = coupon;
    discountLabel = `Cupom ${store.couponCode}`;
  }

  const goods = cents(Math.max(0, subtotal - discount));
  const shipping = subtotal === 0 || subtotal >= store.freeShippingFrom ? 0 : store.shippingFlat;
  const total = cents(goods + shipping);
  const pixTotal = cents(goods * (1 - store.pixDiscount) + shipping);
  const untilFree = Math.max(0, cents(store.freeShippingFrom - subtotal));

  return { subtotal, pieces, discount, discountLabel, goods, shipping, total, pixTotal, untilFree };
}

export function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function searchProducts(list, query) {
  const term = normalize(query.trim());
  if (!term) return [];
  return list.filter((product) => {
    const haystack = normalize(
      [product.name, product.fabric, product.department, ...product.categories, ...product.colors.map((color) => color.name)].join(" "),
    );
    return term.split(/\s+/).every((word) => haystack.includes(word));
  });
}

export async function sendNetlifyForm(formName, fields) {
  const body = new URLSearchParams({ "form-name": formName, ...fields });
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!response.ok) throw new Error("Não foi possível registrar o formulário.");
}

export function maskCep(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function maskPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length < 3) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function orderMessage(order) {
  const lines = order.items.map(
    (item) => `• ${item.qty}x ${item.name} (${item.color}, tam. ${item.size}) — ${money(item.price * item.qty)}`,
  );
  const payingPix = order.payment === "pix";
  return [
    `Olá, Sereia Boutique! Quero confirmar o pedido ${order.id}.`,
    "",
    ...lines,
    "",
    `Subtotal: ${money(order.subtotal)}`,
    order.discount ? `${order.discountLabel}: − ${money(order.discount)}` : "",
    `Frete: ${order.shipping === 0 ? "Grátis" : money(order.shipping)}`,
    `Pagamento: ${payingPix ? "Pix" : "Cartão"}`,
    `Total: ${money(payingPix ? order.pixTotal : order.total)}`,
    "",
    order.name,
    order.phone,
    order.email,
    `${order.street}, ${order.number}${order.complement ? ` — ${order.complement}` : ""}`,
    `${order.district} · ${order.city}/${order.state}`,
    `CEP ${order.cep}`,
    order.note ? `Obs.: ${order.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
