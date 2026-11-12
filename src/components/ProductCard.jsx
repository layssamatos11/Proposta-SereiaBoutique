import { useState } from "react";
import { Link } from "react-router-dom";
import { store } from "../data/store";
import { money } from "../lib/money";
import { useStore } from "../context/StoreContext";
import GarmentArt from "./GarmentArt";
import { IconHeart } from "./Icons";

export default function ProductCard({ product }) {
  const { favorites, toggleFavorite, addToCart } = useStore();
  const [color, setColor] = useState(product.colors[0].name);
  const loved = favorites.includes(product.id);
  const size = product.sizes.includes("M") ? "M" : product.sizes[0];

  return (
    <article className="pcard">
      <div className="pcard-media" style={{ background: product.panel }}>
        <Link
          to={`/produto/${product.id}?cor=${encodeURIComponent(color)}`}
          className="pcard-cover"
          aria-label={product.name}
        >
          {product.image ? <img src={product.image} alt="" /> : <GarmentArt kind={product.kind} />}
        </Link>
        {product.badge && <span className="badge">{product.badge}</span>}
        <button
          type="button"
          className={`heart ${loved ? "on" : ""}`}
          aria-pressed={loved}
          aria-label={loved ? "Remover dos favoritos" : "Salvar nos favoritos"}
          onClick={() => toggleFavorite(product.id)}
        >
          <IconHeart filled={loved} />
        </button>
      </div>
      <div className="pcard-body">
        <h3>
          <Link to={`/produto/${product.id}?cor=${encodeURIComponent(color)}`}>{product.name}</Link>
        </h3>
        <div className="dots" role="listbox" aria-label="Cores">
          {product.colors.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`dot ${item.name === color ? "on" : ""}`}
              style={{ background: item.hex }}
              aria-label={item.name}
              aria-selected={item.name === color}
              onClick={() => setColor(item.name)}
            />
          ))}
        </div>
        {product.compareAt && <s className="compare">{money(product.compareAt)}</s>}
        <p className="price">{money(product.price)}</p>
        <p className="installments">
          ou {store.installments}x de {money(product.price / store.installments)}
        </p>
        <button type="button" className="btn btn-line" onClick={() => addToCart(product.id, color, size, 1)}>
          Adicionar à sacola
        </button>
      </div>
    </article>
  );
}
