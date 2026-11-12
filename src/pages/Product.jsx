import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import GarmentArt from "../components/GarmentArt";
import ProductCard from "../components/ProductCard";
import { getCategory, getProduct, relatedProducts } from "../data/products";
import { departments, store } from "../data/store";
import { useStore } from "../context/StoreContext";
import { money, pixPrice } from "../lib/money";
import { usePageTitle } from "../lib/title";

export default function ProductPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const product = getProduct(id);
  usePageTitle(product ? `${product.name} · Sereia Boutique` : "Peça não encontrada · Sereia Boutique");

  if (!product) {
    return (
      <section className="wrap empty">
        <h1>Essa peça saiu de linha</h1>
        <Link to="/loja" className="btn btn-dark">
          Ver a loja
        </Link>
      </section>
    );
  }

  return <ProductView key={`${product.id}-${params.get("cor") || ""}`} product={product} initialColor={params.get("cor")} />;
}

function ProductView({ product, initialColor }) {
  const { addToCart, favorites, toggleFavorite } = useStore();
  const start = product.colors.find((color) => color.name === initialColor) || product.colors[0];
  const [color, setColor] = useState(start.name);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [notice, setNotice] = useState("");
  const related = useMemo(() => relatedProducts(product), [product]);
  const loved = favorites.includes(product.id);
  const category = getCategory(product.categories[0]);

  function add() {
    if (!size) {
      setNotice("Escolha o tamanho para colocar na sacola.");
      return;
    }
    const result = addToCart(product.id, color, size, qty);
    setNotice(result.ok ? "Peça adicionada à sacola." : result.message);
  }

  return (
    <article className="wrap page">
      <p className="crumbs">
        <Link to="/loja">Loja</Link>
        <span>/</span>
        {category && <Link to={`/c/${category.slug}`}>{category.name}</Link>}
      </p>
      <div className="product">
        <div className="product-stage" style={{ background: product.panel }}>
          {product.badge && <span className="badge">{product.badge}</span>}
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <GarmentArt kind={product.kind} />
          )}
        </div>
        <div className="product-info">
          <p className="eyebrow">{departments[product.department]}</p>
          <h1>{product.name}</h1>
          {product.compareAt && <s className="compare">{money(product.compareAt)}</s>}
          <p className="price big">{money(product.price)}</p>
          <p className="installments">
            ou {store.installments}x de {money(product.price / store.installments)} no cartão
          </p>
          <p className="pix-line">
            No Pix, {money(pixPrice(product.price))} · {Math.round(store.pixDiscount * 100)}% off
          </p>
          <p className="fabric">{product.fabric}</p>

          <fieldset className="choice">
            <legend>Cor · {color}</legend>
            <div className="dots">
              {product.colors.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`dot ${item.name === color ? "on" : ""}`}
                  style={{ background: item.hex }}
                  aria-label={item.name}
                  aria-pressed={item.name === color}
                  onClick={() => setColor(item.name)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="choice">
            <legend>Tamanho</legend>
            <div className="sizes">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={item === size ? "on" : ""}
                  aria-pressed={item === size}
                  onClick={() => {
                    setSize(item);
                    setNotice("");
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="buy-row">
            <div className="qty">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Diminuir">
                −
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((value) => Math.min(product.stock, value + 1))}
                aria-label="Aumentar"
              >
                +
              </button>
            </div>
            <button type="button" className="btn btn-dark" onClick={add}>
              Adicionar à sacola
            </button>
            <button
              type="button"
              className={`heart static ${loved ? "on" : ""}`}
              aria-pressed={loved}
              aria-label={loved ? "Remover dos favoritos" : "Salvar nos favoritos"}
              onClick={() => toggleFavorite(product.id)}
            >
              ♡
            </button>
          </div>
          {notice && <p className="form-msg">{notice}</p>}
          {product.stock <= 4 && <p className="stock">Últimas peças · restam {product.stock}</p>}

          <p className="description">{product.description}</p>
          <ul className="details">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <details className="guide">
            <summary>Guia de medidas</summary>
            <p>
              PP veste 34–36, P 38, M 40–42, G 44, GG 46 e XGG 48–50. Entre dois tamanhos, fique com o maior. No
              WhatsApp a gente confirma a medida com você.
            </p>
          </details>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Combina com</h2>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </article>
  );
}
