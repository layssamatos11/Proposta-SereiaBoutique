// Dados da loja. Troque WhatsApp, e-mail, Instagram e CNPJ antes de publicar.
export const store = {
  name: "Sereia Boutique",
  promoLabel: "Sereia Week",
  freeShippingFrom: 299,
  pixDiscount: 0.05,
  installments: 6,
  bundleMin: 2,
  bundleDiscount: 0.15,
  bundleDetail:
    "Nas compras com 2 ou mais peças, em toda a loja. Vale para fitness, vestido, jeans e o que mais você levar.",
  firstPurchaseDiscount: 0.1,
  couponCode: "SEREIA10",
  shippingFlat: 24.9,
  shippingTime: "Postagem em até 2 dias úteis, para todo o Brasil.",
  exchangePolicy:
    "Primeira troca grátis em até 7 dias após o recebimento, com a peça sem uso e a etiqueta.",
  whatsapp: "5500000000000",
  whatsappDisplay: "(00) 00000-0000",
  hours: "seg a sáb, das 9h às 18h",
  email: "contato@sereiaboutique.com.br",
  instagram: "sereiaboutique",
  cnpj: "00.000.000/0001-00",
};

export const categories = [
  { slug: "conjuntos", name: "Conjuntos", blurb: "Tops e calças que já nascem combinando." },
  { slug: "tops", name: "Tops", blurb: "Bojo, alça e modelagens para se mover." },
  { slug: "macacoes", name: "Macacões", blurb: "Uma peça e o look está pronto." },
  { slug: "shorts", name: "Shorts", blurb: "Cós alto e tecido que não marca." },
  { slug: "calcas", name: "Calças", blurb: "Do flare do treino à pantalona." },
  { slug: "plus-size", name: "Plus Size", blurb: "Os mesmos tecidos, do G ao XGG." },
  { slug: "promocoes", name: "Promoções", blurb: "Preços especiais desta semana." },
  { slug: "vestidos", name: "Vestidos", blurb: "Do midi de linho ao longo de festa." },
  { slug: "blusas", name: "Blusas", blurb: "Cetim, algodão e regatas para o dia." },
  { slug: "saias", name: "Saias", blurb: "Plissadas e lápis, do trabalho ao jantar." },
  { slug: "jeans", name: "Jeans", blurb: "Retas e macacão com caimento de verdade." },
  { slug: "jaquetas", name: "Jaquetas", blurb: "Sarja, blazer e o que vai por cima." },
  { slug: "praia", name: "Praia", blurb: "Conjuntos e saídas para o sol." },
  { slug: "festa", name: "Festa", blurb: "Brilho na medida e caimento de boutique." },
];

export const homeChips = [
  "conjuntos",
  "tops",
  "macacoes",
  "shorts",
  "calcas",
  "plus-size",
  "promocoes",
];

export const world = [
  { slug: "conjuntos", name: "Fitness", text: "Conjuntos, tops e macacões", panel: "#F6D6DE" },
  { slug: "vestidos", name: "Vestidos", text: "Midi, envelope e longo", panel: "#F3E1D4" },
  { slug: "jeans", name: "Jeans", text: "Reta e macacão", panel: "#D9E4F0" },
  { slug: "praia", name: "Praia", text: "Conjuntos e saídas", panel: "#F8E0D6" },
  { slug: "jaquetas", name: "Jaquetas", text: "Sarja e blazer", panel: "#EFE4DA" },
  { slug: "plus-size", name: "Plus Size", text: "Do G ao XGG", panel: "#E5F0E8" },
  { slug: "saias", name: "Saias", text: "Plissada e lápis", panel: "#E9DDF0" },
  { slug: "festa", name: "Festa", text: "O vestido da noite", panel: "#F7D5E0" },
];

export const reviews = [
  {
    name: "Marina A.",
    text: "O conjunto veste como uma segunda pele e o bojo fica no lugar o treino inteiro. Já quero a outra cor.",
  },
  {
    name: "Camila R.",
    text: "Levei o vestido midi e a calça jeans. O tecido é leve, e a troca — precisei de outro tamanho — foi simples.",
  },
  {
    name: "Juliana P.",
    text: "Me ajudaram no WhatsApp a escolher o plus. Chegou dobrado com carinho e serviu de primeira.",
  },
];

export const looks = [
  { kind: "conjunto-calca", panel: "#F6D6DE", label: "Treino" },
  { kind: "vestido", panel: "#F3E1D4", label: "Dia" },
  { kind: "jeans", panel: "#E4D8EE", label: "Jeans" },
  { kind: "praia", panel: "#D7E6D8", label: "Praia" },
  { kind: "vestido-longo", panel: "#F7D5E0", label: "Festa" },
];

export const departments = {
  fitness: "Fitness",
  dia: "Dia a dia",
  festa: "Festa",
  praia: "Praia",
  plus: "Plus size",
};
