import { useState } from "react";
import { Link } from "react-router-dom";
import { store } from "../data/store";
import { useStore } from "../context/StoreContext";
import { sendNetlifyForm } from "../lib/money";
import { usePageTitle } from "../lib/title";

export default function Club() {
  usePageTitle("Clube Sereia · Sereia Boutique");
  const { club, joinClub } = useStore();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(club);
  const off = Math.round(store.firstPurchaseDiscount * 100);

  async function onSubmit(event) {
    event.preventDefault();
    if (nome.trim().length < 2) {
      setError("Como podemos te chamar?");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Confira o e-mail para receber o cupom.");
      return;
    }
    setError("");
    joinClub();
    setDone(true);
    try {
      await sendNetlifyForm("clube", { nome: nome.trim(), email: email.trim() });
    } catch {
      /* O cupom fica salvo neste navegador mesmo sem o formulário da Netlify. */
    }
  }

  return (
    <section className="wrap page narrow">
      <p className="eyebrow">Clube Sereia</p>
      <h1>Ganhe {off}% off na primeira compra</h1>
      <p className="lede">
        Lançamentos, reposição de cor e cupons chegam primeiro para quem faz parte. O desconto entra na sacola com o
        código abaixo — e, se você levar duas peças, o desconto maior das duas ofertas é o que vale.
      </p>
      {done ? (
        <div className="coupon-card">
          <p>Seu cupom</p>
          <strong>{store.couponCode}</strong>
          <p>Use no fechamento do pedido. Ele já está aplicado nesta sacola.</p>
          <Link to="/loja" className="btn btn-dark">
            Escolher as peças
          </Link>
        </div>
      ) : (
        <form className="stack-form" onSubmit={onSubmit}>
          <label>
            Nome
            <input value={nome} onChange={(event) => setNome(event.target.value)} autoComplete="name" />
          </label>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          {error && <p className="form-msg">{error}</p>}
          <button type="submit" className="btn btn-dark">
            Quero meu cupom
          </button>
        </form>
      )}
    </section>
  );
}
