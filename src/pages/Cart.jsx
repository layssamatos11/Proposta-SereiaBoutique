import { Link } from "react-router-dom";
import GarmentArt from "../components/GarmentArt";
import Summary from "../components/Summary";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/money";
import { usePageTitle } from "../lib/title";

export default function CartPage() {
  usePageTitle("Sacola · Sereia Boutique");
  const { lines, updateQty, updateOption, removeLine } = useStore();

  return (
    <section className="wrap page">
      <p className="eyebrow">Sua sacola</p>
      <h1>Peças escolhidas</h1>
      {lines.length === 0 ? (
        <div className="empty">
          <p>A sacola ainda está vazia. Os conjuntos, vestidos e jeans esperam por você.</p>
          <Link to="/loja" className="btn btn-dark">
            Ver a loja
          </Link>
        </div>
      ) : (
        <div className="split">
          <ul className="cart-lines">
            {lines.map((line) => (
              <li key={`${line.id}-${line.color}-${line.size}`}>
                <Link to={`/produto/${line.id}`} className="mini large" style={{ background: line.product.panel }}>
                  <GarmentArt kind={line.product.kind} />
                </Link>
                <div className="cart-main">
                  <h2>
                    <Link to={`/produto/${line.id}`}>{line.name}</Link>
                  </h2>
                  <label>
                    Cor
                    <select
                      value={line.color}
                      onChange={(event) =>
                        updateOption(line.id, line.color, line.size, { color: event.target.value })
                      }
                    >
                      {line.product.colors.map((color) => (
                        <option key={color.name}>{color.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Tamanho
                    <select
                      value={line.size}
                      onChange={(event) =>
                        updateOption(line.id, line.color, line.size, { size: event.target.value })
                      }
                    >
                      {line.product.sizes.map((size) => (
                        <option key={size}>{size}</option>
                      ))}
                    </select>
                  </label>
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
                <strong className="line-price">{money(line.price * line.qty)}</strong>
              </li>
            ))}
          </ul>
          <div className="summary-col">
            <Summary />
            <Link to="/checkout" className="btn btn-dark full">
              Fechar pedido
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
