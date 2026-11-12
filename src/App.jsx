import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import CartPage from "./pages/Cart";
import Catalog, { SearchPage } from "./pages/Catalog";
import Checkout, { OrderDone } from "./pages/Checkout";
import Club from "./pages/Club";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Info from "./pages/Info";
import ProductPage from "./pages/Product";
import { usePageTitle } from "./lib/title";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  usePageTitle("Página não encontrada · Sereia Boutique");
  return (
    <section className="wrap empty">
      <h1>Essa página saiu de linha</h1>
      <p>O endereço não faz parte da loja.</p>
      <Link to="/loja" className="btn btn-dark">
        Ver a loja
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="loja" element={<Catalog />} />
          <Route path="c/:slug" element={<Catalog />} />
          <Route path="produto/:id" element={<ProductPage />} />
          <Route path="sacola" element={<CartPage />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="busca" element={<SearchPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="pedido/:id" element={<OrderDone />} />
          <Route path="clube" element={<Club />} />
          <Route path="sobre" element={<Info id="sobre" />} />
          <Route path="trocas" element={<Info id="trocas" />} />
          <Route path="envio" element={<Info id="envio" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
