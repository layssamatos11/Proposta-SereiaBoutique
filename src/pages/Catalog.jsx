import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getCategory, products, productsIn } from "../data/products";
import { categories } from "../data/store";
import { searchProducts } from "../lib/money";
import { usePageTitle } from "../lib/title";

function sortProducts(list, order) {
  const next = [...list];
  if (order === "menor") next.sort((a, b) => a.price - b.price);
  else if (order === "maior") next.sort((a, b) => b.price - a.price);
  else if (order === "novos") next.sort((a, b) => Number(b.badge === "Novo") - Number(a.badge === "Novo"));
  else next.sort((a, b) => Number(b.highlights) - Number(a.highlights));
  return next;
}

export default function Catalog() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const category = slug ? getCategory(slug) : null;
  const order = params.get("ordem") || "destaques";
  const title = category ? category.name : "Toda a loja";
  usePageTitle(`${title} · Sereia Boutique`);

  if (slug && !category) {
    return (
      <section className="wrap empty">
        <h1>Categoria não encontrada</h1>
        <Link to="/loja" className="btn btn-dark">
          Ver a loja
        </Link>
      </section>
    );
  }

  const list = sortProducts(slug ? productsIn(slug) : products, order);

  function setOrder(value) {
    const next = new URLSearchParams(params);
    next.set("ordem", value);
    setParams(next);
  }

  return (
    <section className="wrap page">
      <p className="eyebrow">{category ? "Categoria" : "Sereia Boutique"}</p>
      <div className="section-head">
        <div>
          <h1>{title}</h1>
          <p className="section-intro">{category ? category.blurb : "Fitness, dia a dia, praia, festa e plus size."}</p>
        </div>
        <label className="sort">
          Ordenar
          <select value={order} onChange={(event) => setOrder(event.target.value)}>
            <option value="destaques">Destaques</option>
            <option value="novos">Novidades</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
          </select>
        </label>
      </div>
      <div className="chips left">
        <Link to="/loja" className={`chip ${slug ? "" : "on"}`}>
          Tudo
        </Link>
        {categories.map((item) => (
          <Link key={item.slug} to={`/c/${item.slug}`} className={`chip ${item.slug === slug ? "on" : ""}`}>
            {item.name}
          </Link>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="empty">
          <p>Nenhuma peça nesta seleção agora.</p>
        </div>
      ) : (
        <div className="product-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  usePageTitle(query ? `Busca por “${query}” · Sereia Boutique` : "Busca · Sereia Boutique");
  const list = searchProducts(products, query);

  return (
    <section className="wrap page">
      <p className="eyebrow">Busca</p>
      <h1>{query ? `Resultados para “${query}”` : "Buscar na loja"}</h1>
      <p className="section-intro">
        {query
          ? `${list.length} ${list.length === 1 ? "peça encontrada" : "peças encontradas"}.`
          : "Use a busca do topo para achar conjuntos, vestidos, jeans e o resto da loja."}
      </p>
      {list.length === 0 ? (
        <div className="empty">
          <p>Nada com esse nome por aqui.</p>
          <Link to="/loja" className="btn btn-dark">
            Ver toda a loja
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
