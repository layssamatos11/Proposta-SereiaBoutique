import { useState } from "react";
import { store } from "../data/store";
import { money } from "../lib/money";
import { useStore } from "../context/StoreContext";

export default function Summary({ payment = "card" }) {
  const { summary, coupon, applyCoupon, removeCoupon } = useStore();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const pixOff = Math.round(store.pixDiscount * 100);
  const payingPix = payment === "pix";

  function onCoupon(event) {
    event.preventDefault();
    if (applyCoupon(code)) {
      setMessage("Cupom aplicado.");
      setCode("");
    } else {
      setMessage("Esse cupom não entrou. O código chega pelo Clube Sereia.");
    }
  }

  return (
    <aside className="summary">
      <h2>Resumo</h2>
      <div className="sum-row">
        <span>Subtotal</span>
        <span>{money(summary.subtotal)}</span>
      </div>
      {summary.discount > 0 && (
        <div className="sum-row discount">
          <span>{summary.discountLabel}</span>
          <span>− {money(summary.discount)}</span>
        </div>
      )}
      <div className="sum-row">
        <span>Frete</span>
        <span>{summary.subtotal === 0 ? "—" : summary.shipping === 0 ? "Grátis" : money(summary.shipping)}</span>
      </div>
      {summary.subtotal > 0 && (
        <p className="ship-note">
          {summary.untilFree > 0
            ? `Faltam ${money(summary.untilFree)} para frete grátis.`
            : "Frete grátis nesta sacola."}
        </p>
      )}
      <div className="sum-row total">
        <span>{payingPix ? "Total no Pix" : "Total"}</span>
        <strong>{money(payingPix ? summary.pixTotal : summary.total)}</strong>
      </div>
      {!payingPix && summary.subtotal > 0 && (
        <p className="ship-note">
          No Pix, {money(summary.pixTotal)} · {pixOff}% off nos produtos.
        </p>
      )}

      {coupon ? (
        <>
          <p className="coupon-on">
            Cupom {coupon} ativo.
            <button type="button" onClick={removeCoupon}>
              Remover
            </button>
          </p>
          {summary.discountLabel.startsWith("Leve") && (
            <p className="ship-note">O desconto de duas peças é maior, então ele entra no total.</p>
          )}
        </>
      ) : (
        <form className="coupon" onSubmit={onCoupon}>
          <label htmlFor="cupom">Cupom</label>
          <div>
            <input
              id="cupom"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Digite o código"
            />
            <button type="submit" className="btn btn-line">
              Aplicar
            </button>
          </div>
          {message && <p className="form-msg">{message}</p>}
        </form>
      )}
    </aside>
  );
}
