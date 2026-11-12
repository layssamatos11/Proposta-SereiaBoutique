import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/money";
import { store } from "../data/store";
import GarmentArt from "./GarmentArt";
import { IconClose } from "./Icons";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, summary, updateQty, updateOption, removeLine } = useStore();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!cartOpen) return undefined;
    closeRef.current?.focus();
    function onKey(event) {
      if (event.key === "Escape") setCartOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="drawer-root">
      <button type="button" className="drawer-backdrop" aria-label="Fechar sacola" onClick={() => setCartOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="sacola-titulo">
        <header className="drawer-head">
          <h2 id="sacola-titulo">Sacola</h2>
          <button type="button" ref={closeRef} className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Fechar">
            <IconClose />
          </button>
        </header>
        {lines.length === 0 ? (
          <div className="drawer-empty">
            <p>Sua sacola está vazia.</p>
            <Link to="/loja" className="btn btn-dark" onClick={() => setCartOpen(false)}>
              Ver a loja
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer-lines">
              {lines.map((line) => (
                <li key={`${line.id}-${line.color}-${line.size}`}>
                  <Link
                    to={`/produto/${line.id}`}
                    className="mini"
                    style={{ background: line.product.panel }}
                    onClick={() => setCartOpen(false)}
                  >
                    <GarmentArt kind={line.product.kind} />
                  </Link>
                  <div>
                    <strong>{line.name}</strong>
                    <div className="line-options">
                      <select
                        aria-label="Cor"
                        value={line.color}
                        onChange={(event) => updateOption(line.id, line.color, line.size, { color: event.target.value })}
                      >
                        {line.product.colors.map((color) => (
                          <option key={color.name}>{color.name}</option>
                        ))}
                      </select>
                      <select
                        aria-label="Tamanho"
                        value={line.size}
                        onChange={(event) => updateOption(line.id, line.color, line.size, { size: event.target.value })}
                      >
                        {line.product.sizes.map((size) => (
                          <option key={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                    <div className="qty">
                      <button type="button" onClick={() => updateQty(line.id, line.color, line.size, line.qty - 1)} aria-label="Diminuir">
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button type="button" onClick={() => updateQty(line.id, line.color, line.size, line.qty + 1)} aria-label="Aumentar">
                        +
                      </button>
                    </div>
                    <button type="button" className="text-btn" onClick={() => removeLine(line.id, line.color, line.size)}>
                      Remover
                    </button>
                  </div>
                  <b>{money(line.price * line.qty)}</b>
                </li>
              ))}
            </ul>
            <footer className="drawer-foot">
              <p className="ship-note">
                {summary.untilFree > 0
                  ? `Faltam ${money(summary.untilFree)} para frete grátis.`
                  : "Frete grátis nesta sacola."}
              </p>
              {summary.discount > 0 && (
                <p className="ship-note">
                  {summary.discountLabel} aplicado · − {money(summary.discount)}
                </p>
              )}
              <div className="sum-row total">
                <span>Total</span>
                <strong>{money(summary.total)}</strong>
              </div>
              <p className="ship-note">No Pix, {money(summary.pixTotal)} · {Math.round(store.pixDiscount * 100)}% off.</p>
              <Link to="/checkout" className="btn btn-dark" onClick={() => setCartOpen(false)}>
                Fechar pedido
              </Link>
              <Link to="/sacola" className="btn btn-line" onClick={() => setCartOpen(false)}>
                Ver sacola
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
