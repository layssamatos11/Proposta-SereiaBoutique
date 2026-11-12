import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Summary from "../components/Summary";
import { store } from "../data/store";
import { useStore } from "../context/StoreContext";
import { maskCep, maskPhone, money, orderMessage, sendNetlifyForm } from "../lib/money";
import { usePageTitle } from "../lib/title";

const UFS = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
const ORDER_KEY = "sereia-order";

const empty = {
  nome: "",
  whatsapp: "",
  email: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "DF",
  pagamento: "pix",
  obs: "",
};

export default function Checkout() {
  usePageTitle("Fechar pedido · Sereia Boutique");
  const { lines, summary, clearCart, coupon } = useStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  if (lines.length === 0) return <Navigate to="/sacola" replace />;

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onCep(value) {
    const cep = maskCep(value);
    setField("cep", cep);
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await response.json();
      if (data.erro) return;
      setForm((current) => ({
        ...current,
        cep,
        rua: data.logradouro || current.rua,
        bairro: data.bairro || current.bairro,
        cidade: data.localidade || current.cidade,
        estado: data.uf || current.estado,
      }));
    } catch {
      /* O endereço segue editável se a consulta do CEP não responder. */
    }
  }

  function validate() {
    const next = {};
    if (form.nome.trim().length < 3) next.nome = "Diga o nome de quem vai receber.";
    if (form.whatsapp.replace(/\D/g, "").length < 10) next.whatsapp = "WhatsApp com DDD.";
    if (!form.email.includes("@")) next.email = "E-mail para a confirmação.";
    if (form.cep.replace(/\D/g, "").length !== 8) next.cep = "CEP com 8 números.";
    if (form.rua.trim().length < 3) next.rua = "Rua do endereço.";
    if (!form.numero.trim()) next.numero = "Número.";
    if (form.bairro.trim().length < 2) next.bairro = "Bairro.";
    if (form.cidade.trim().length < 2) next.cidade = "Cidade.";
    return next;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    const order = {
      id: `SB-${Date.now().toString().slice(-6)}`,
      name: form.nome.trim(),
      phone: form.whatsapp,
      email: form.email.trim(),
      cep: form.cep,
      street: form.rua.trim(),
      number: form.numero.trim(),
      complement: form.complemento.trim(),
      district: form.bairro.trim(),
      city: form.cidade.trim(),
      state: form.estado,
      payment: form.pagamento,
      note: form.obs.trim(),
      items: lines.map((line) => ({
        name: line.name,
        color: line.color,
        size: line.size,
        qty: line.qty,
        price: line.price,
      })),
      subtotal: summary.subtotal,
      discount: summary.discount,
      discountLabel: summary.discountLabel,
      shipping: summary.shipping,
      total: summary.total,
      pixTotal: summary.pixTotal,
      coupon,
    };
    try {
      await sendNetlifyForm("pedidos", {
        pedido: order.id,
        nome: order.name,
        whatsapp: order.phone,
        email: order.email,
        endereco: `${order.street}, ${order.number} — ${order.district}, ${order.city}/${order.state}, ${order.cep}`,
        pagamento: order.payment,
        total: money(order.payment === "pix" ? order.pixTotal : order.total),
        itens: order.items.map((item) => `${item.qty}x ${item.name} (${item.color}, ${item.size})`).join(" | "),
      });
    } catch {
      /* A confirmação segue pelo WhatsApp. */
    }
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    clearCart();
    window.location.assign(`/pedido/${order.id}`);
  }

  return (
    <section className="wrap page">
      <p className="eyebrow">Checkout</p>
      <h1>Fechar pedido</h1>
      <p className="section-intro">
        A loja confirma o pagamento no WhatsApp — Pix com desconto ou cartão em até {store.installments}x.
      </p>
      <form className="split checkout" onSubmit={onSubmit}>
        <div className="stack-form">
          <label>
            Nome completo
            <input value={form.nome} onChange={(event) => setField("nome", event.target.value)} autoComplete="name" />
            {errors.nome && <small>{errors.nome}</small>}
          </label>
          <div className="two">
            <label>
              WhatsApp
              <input
                value={form.whatsapp}
                onChange={(event) => setField("whatsapp", maskPhone(event.target.value))}
                autoComplete="tel"
                inputMode="tel"
              />
              {errors.whatsapp && <small>{errors.whatsapp}</small>}
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                autoComplete="email"
              />
              {errors.email && <small>{errors.email}</small>}
            </label>
          </div>
          <div className="two cep">
            <label>
              CEP
              <input value={form.cep} onChange={(event) => onCep(event.target.value)} inputMode="numeric" autoComplete="postal-code" />
              {errors.cep && <small>{errors.cep}</small>}
            </label>
            <label>
              Estado
              <select value={form.estado} onChange={(event) => setField("estado", event.target.value)}>
                {UFS.map((uf) => (
                  <option key={uf}>{uf}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Rua
            <input value={form.rua} onChange={(event) => setField("rua", event.target.value)} autoComplete="address-line1" />
            {errors.rua && <small>{errors.rua}</small>}
          </label>
          <div className="two">
            <label>
              Número
              <input value={form.numero} onChange={(event) => setField("numero", event.target.value)} />
              {errors.numero && <small>{errors.numero}</small>}
            </label>
            <label>
              Complemento
              <input value={form.complemento} onChange={(event) => setField("complemento", event.target.value)} />
            </label>
          </div>
          <div className="two">
            <label>
              Bairro
              <input value={form.bairro} onChange={(event) => setField("bairro", event.target.value)} />
              {errors.bairro && <small>{errors.bairro}</small>}
            </label>
            <label>
              Cidade
              <input value={form.cidade} onChange={(event) => setField("cidade", event.target.value)} />
              {errors.cidade && <small>{errors.cidade}</small>}
            </label>
          </div>
          <fieldset className="choice">
            <legend>Pagamento</legend>
            <label className={`pay ${form.pagamento === "pix" ? "on" : ""}`}>
              <input
                type="radio"
                name="pagamento"
                checked={form.pagamento === "pix"}
                onChange={() => setField("pagamento", "pix")}
              />
              Pix · {Math.round(store.pixDiscount * 100)}% off
            </label>
            <label className={`pay ${form.pagamento === "cartao" ? "on" : ""}`}>
              <input
                type="radio"
                name="pagamento"
                checked={form.pagamento === "cartao"}
                onChange={() => setField("pagamento", "cartao")}
              />
              Cartão · até {store.installments}x
            </label>
          </fieldset>
          <label>
            Observação
            <textarea value={form.obs} onChange={(event) => setField("obs", event.target.value)} rows={3} />
          </label>
        </div>
        <div className="summary-col">
          <Summary payment={form.pagamento} />
          <button type="submit" className="btn btn-dark full" disabled={sending}>
            {sending ? "Preparando pedido…" : "Confirmar pedido"}
          </button>
          <p className="ship-note">Em seguida você envia o resumo no WhatsApp para a loja confirmar.</p>
        </div>
      </form>
    </section>
  );
}

export function OrderDone() {
  const { id } = useParams();
  usePageTitle("Pedido recebido · Sereia Boutique");
  let order = null;
  try {
    order = JSON.parse(sessionStorage.getItem(ORDER_KEY) || "null");
  } catch {
    order = null;
  }
  if (!order || order.id !== id) {
    return (
      <section className="wrap empty">
        <h1>Pedido não encontrado</h1>
        <Link to="/loja" className="btn btn-dark">
          Voltar à loja
        </Link>
      </section>
    );
  }
  const href = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(orderMessage(order))}`;
  const total = order.payment === "pix" ? order.pixTotal : order.total;

  return (
    <section className="wrap page narrow">
      <p className="eyebrow">Pedido {order.id}</p>
      <h1>Quase lá, {order.name.split(" ")[0]}</h1>
      <p className="lede">
        O resumo está pronto. Envie no WhatsApp para a Sereia confirmar o {order.payment === "pix" ? "Pix" : "cartão"} e
        a postagem. Total de {money(total)}.
      </p>
      <a className="btn btn-dark" href={href} target="_blank" rel="noreferrer">
        Enviar pedido no WhatsApp
      </a>
      <ul className="details">
        {order.items.map((item) => (
          <li key={`${item.name}-${item.size}-${item.color}`}>
            {item.qty}x {item.name} · {item.color} · tam. {item.size}
          </li>
        ))}
      </ul>
      <p className="lede">
        Entrega em {order.street}, {order.number}
        {order.complement ? `, ${order.complement}` : ""} — {order.district}, {order.city}/{order.state}.
      </p>
      <Link to="/loja">Continuar na loja</Link>
    </section>
  );
}
