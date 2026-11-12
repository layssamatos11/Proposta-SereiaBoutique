import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProduct } from "../data/products";
import { useStore } from "../context/StoreContext";
import { usePageTitle } from "../lib/title";

export default function Favorites() {
  usePageTitle("Favoritos · Sereia Boutique");
  const { favorites } = useStore();
  const items = favorites.map((id) => getProduct(id)).filter(Boolean);

  return (
    <section className="wrap page">
      <p className="eyebrow">Guardados</p>
      <h1>Favoritos</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>Você ainda não guardou nenhuma peça. O coração em cada look salva para depois.</p>
          <Link to="/loja" className="btn btn-dark">
            Ver a loja
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
