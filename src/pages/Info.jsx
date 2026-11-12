import { Link } from "react-router-dom";
import { store } from "../data/store";
import { money } from "../lib/money";
import { usePageTitle } from "../lib/title";

const copy = {
  sobre: {
    title: "Sobre a Sereia",
    eyebrow: "A boutique",
    body: [
      "A Sereia Boutique veste o treino, o trabalho, a praia e a festa. A mesma mão que escolhe a poliamida do conjunto escolhe o linho do vestido e o jeans da semana.",
      "O caimento importa tanto quanto a cor. Por isso o plus size sai da mesma coleção, do G ao XGG, e o atendimento no WhatsApp ajuda a acertar o tamanho antes do pedido sair.",
    ],
  },
  trocas: {
    title: "Troca fácil",
    eyebrow: "Depois da compra",
    body: [store.exchangePolicy, "Escreva no WhatsApp com o número do pedido e o tamanho que você precisa. A primeira troca viaja por nossa conta."],
  },
  envio: {
    title: "Envio e pagamento",
    eyebrow: "Para todo o Brasil",
    body: [
      store.shippingTime,
      `Frete de ${money(store.shippingFlat)} nas compras abaixo de ${money(store.freeShippingFrom)}. A partir desse valor, o frete é grátis.`,
      `Pix com ${Math.round(store.pixDiscount * 100)}% off sobre os produtos. No cartão, parcele em até ${store.installments}x.`,
      "O pedido é confirmado com a loja pelo WhatsApp. O pagamento — Pix ou cartão — é combinado nesse atendimento, com uma pessoa de verdade.",
    ],
  },
};

export default function Info({ id }) {
  const page = copy[id];
  usePageTitle(`${page.title} · Sereia Boutique`);

  return (
    <section className="wrap page narrow">
      <p className="eyebrow">{page.eyebrow}</p>
      <h1>{page.title}</h1>
      {page.body.map((paragraph) => (
        <p key={paragraph} className="lede">
          {paragraph}
        </p>
      ))}
      <p className="lede">
        WhatsApp {store.whatsappDisplay}, {store.hours}. Ou escreva para {store.email}.
      </p>
      <Link to="/loja" className="btn btn-dark">
        Voltar para a loja
      </Link>
    </section>
  );
}
