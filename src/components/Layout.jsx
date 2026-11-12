import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { store } from "../data/store";
import { useStore } from "../context/StoreContext";
import { IconBag, IconHeart, IconSearch } from "./Icons";
import CartDrawer from "./CartDrawer";

export default function Layout() {
  const { count, setCartOpen } = useStore();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    setCartOpen(false);
  }, [pathname, setCartOpen]);
  const pix = Math.round(store.pixDiscount * 100);

  function onSearch(event) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    navigate(`/busca?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      <div className="promo">
        {store.promoLabel}: frete grátis acima de R$ {store.freeShippingFrom} · Pix com {pix}% off
      </div>
      <header className="header">
        <div className="wrap header-row">
          <Link to="/" className="brand" aria-label="Sereia Boutique">
            <span className="brand-script">Sereia</span>
            <span className="brand-small">Boutique</span>
          </Link>
          <form className="search" onSubmit={onSearch} role="search">
            <IconSearch />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar conjuntos, tops, macacões…"
              aria-label="Buscar produtos"
            />
          </form>
          <div className="header-actions">
            <Link to="/favoritos" className="action">
              <IconHeart />
              <span className="action-label">Favoritos</span>
            </Link>
            <button type="button" className="action" onClick={() => setCartOpen(true)}>
              <IconBag />
              <span className="action-label">Sacola ({count})</span>
              {count > 0 && (
                <span className="action-count" aria-hidden="true">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap footer-row">
          <Link to="/" className="brand footer-brand" aria-label="Sereia Boutique">
            <span className="brand-script">Sereia</span>
            <span className="brand-small">Boutique</span>
          </Link>
          <p className="footer-contact">
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer">
              {store.whatsappDisplay}
            </a>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${store.email}`}>{store.email}</a>
            <span aria-hidden="true"> · </span>
            <a href={`https://instagram.com/${store.instagram}`} target="_blank" rel="noreferrer">
              @{store.instagram}
            </a>
          </p>
          <p className="footer-legal">
            CNPJ {store.cnpj} · Todos os direitos reservados
          </p>
        </div>
        <div className="wrap footer-links">
          <Link to="/sobre">Sobre</Link>
          <Link to="/trocas">Trocas</Link>
          <Link to="/envio">Envio e pagamento</Link>
          <Link to="/clube">Clube Sereia</Link>
          <Link to="/loja">Toda a loja</Link>
        </div>
      </footer>
      <CartDrawer />
    </>
  );
}
