import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import GarmentArt from "../components/GarmentArt";
import { IconCheck, IconStar } from "../components/Icons";
import { products } from "../data/products";
import { categories, homeChips, looks, reviews, store, world } from "../data/store";
import { usePageTitle } from "../lib/title";

export default function Home() {
  usePageTitle("Sereia Boutique — roupas para treinar, sair e brilhar");
  const highlights = products.filter((product) => product.highlights);
  const chips = homeChips.map((slug) => categories.find((category) => category.slug === slug));
  const bundle = Math.round(store.bundleDiscount * 100);
  const first = Math.round(store.firstPurchaseDiscount * 100);

  return (
    <>
      <section className="wrap hero">
        <div className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Coleção fitness</p>
            <h1>
              Treine com
              <br />
              <em>delicadeza, brilhe</em>
              <br />
              com estilo
            </h1>
            <p className="lede">
              Poliamida de toque macio, caimento perfeito e cores que combinam com você.
            </p>
            <div className="hero-actions">
              <Link to="/loja" className="btn btn-dark">
                Comprar agora
              </Link>
              <Link to="/c/conjuntos" className="btn btn-light">
                Ver conjuntos
              </Link>
            </div>
            <ul className="trust">
              <li>
                <IconCheck /> Pix e cartão
              </li>
              <li>
                <IconCheck /> Troca fácil
              </li>
              <li>
                <IconCheck /> Envio para todo o Brasil
              </li>
            </ul>
          </div>
          <div className="hero-logo">
            <img src="/logo-sereia.jpg" alt="Sereia Boutique" width="900" height="900" />
          </div>
        </div>
      </section>

      <nav className="wrap chips" aria-label="Categorias">
        {chips.map((category) => (
          <Link key={category.slug} to={`/c/${category.slug}`} className="chip">
            {category.name}
          </Link>
        ))}
      </nav>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Destaques</p>
            <h2>As queridinhas da semana</h2>
          </div>
          <Link to="/loja" className="btn btn-line">
            Ver todas
          </Link>
        </div>
        <div className="product-grid">
          {highlights.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Para todos os momentos</p>
            <h2>A loja inteira</h2>
          </div>
        </div>
        <p className="section-intro">
          Fitness para treinar, vestido para sair, jeans para a semana e plus size na mesma grade de cuidado.
        </p>
        <div className="world-grid">
          {world.map((item) => (
            <Link key={item.slug} to={`/c/${item.slug}`} className="world-card" style={{ background: item.panel }}>
              <span>{item.name}</span>
              <small>{item.text}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="offer">
          <div>
            <p className="eyebrow light">Oferta especial</p>
            <h2>Leve 2 e ganhe {bundle}% off</h2>
            <p>{store.bundleDetail}</p>
          </div>
          <Link to="/loja" className="btn btn-gold">
            Aproveitar agora
          </Link>
        </div>
      </section>

      <section className="wrap section center">
        <p className="eyebrow">Quem comprou, amou</p>
        <h2>Elas falam por nós</h2>
        <div className="review-grid">
          {reviews.map((review) => (
            <blockquote key={review.name}>
              <div className="stars" aria-label="5 estrelas">
                {Array.from({ length: 5 }, (_, index) => (
                  <IconStar key={index} />
                ))}
              </div>
              <p>“{review.text}”</p>
              <footer>{review.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="wrap section center">
        <p className="eyebrow">Instagram</p>
        <h2>
          <a href={`https://instagram.com/${store.instagram}`} target="_blank" rel="noreferrer">
            @{store.instagram}
          </a>
        </h2>
        <div className="look-grid">
          {looks.map((look) => (
            <a
              key={look.label}
              className="look"
              style={{ background: look.panel }}
              href={`https://instagram.com/${store.instagram}`}
              target="_blank"
              rel="noreferrer"
            >
              <GarmentArt kind={look.kind} />
              <span>{look.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="wrap benefits">
        <article>
          <h3>Pix e cartão</h3>
          <p>Parcele em até {store.installments}x</p>
        </article>
        <article>
          <h3>Envio rápido</h3>
          <p>{store.shippingTime}</p>
        </article>
        <article>
          <h3>Troca fácil</h3>
          <p>{store.exchangePolicy}</p>
        </article>
        <article>
          <h3>Atendimento humano</h3>
          <p>
            WhatsApp {store.hours}
          </p>
        </article>
      </section>

      <section className="wrap section">
        <div className="club-banner">
          <h2>Ganhe {first}% off na primeira compra</h2>
          <p>Entre para o Clube Sereia e receba lançamentos e cupons em primeira mão.</p>
          <Link to="/clube" className="btn btn-dark">
            Quero meu cupom
          </Link>
        </div>
      </section>
    </>
  );
}
