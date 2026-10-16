import { useEffect, useMemo, useState } from "react";
import { categoryGroup, currency, productSearchText, products } from "./catalog";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Icon from "./components/Icon";
import ProductCard from "./components/ProductCard";
import ProductDialog from "./components/ProductDialog";
import { getOfferState } from "./catalog";
import { whatsappHref } from "./whatsapp";

const demoReviews = [
  {
    name: "Cliente de ejemplo 1",
    comment: "Ejemplo de atención: una orientación cercana puede ayudar a resolver dudas sobre los equipos.",
  },
  {
    name: "Cliente de ejemplo 2",
    comment: "Ejemplo de información: una ficha clara permite consultar las características disponibles de cada producto.",
  },
  {
    name: "Cliente de ejemplo 3",
    comment: "Ejemplo de comparación: conocer las opciones puede facilitar una decisión informada.",
  },
  {
    name: "Cliente de ejemplo 4",
    comment: "Ejemplo de compra: revisar la información antes de elegir puede hacer más sencilla la experiencia de compra.",
  },
];

function readSavedTheme() {
  try {
    const saved = window.localStorage.getItem("crusanti-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* Storage may be disabled by the browser. */ }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState(readSavedTheme);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas las categorías");
  const [availability, setAvailability] = useState("Todos los productos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try { window.localStorage.setItem("crusanti-theme", theme); } catch { /* Theme still works for this visit. */ }
  }, [theme]);

  const categoryOptions = useMemo(
    () => ["Todas las categorías", ...new Set(products.map((product) => categoryGroup(product.category)))],
    [],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return products.filter((product) => {
      if (normalizedQuery && !productSearchText(product).includes(normalizedQuery)) return false;
      if (category !== "Todas las categorías" && categoryGroup(product.category) !== category) return false;
      const offerState = getOfferState(product, now);
      if (availability === "Disponibles" && !(Number.isSafeInteger(product.stock) && product.stock > 0)) return false;
      if (availability === "Oferta vigente" && offerState !== "active") return false;
      if (availability === "Ofertas próximas" && offerState !== "upcoming") return false;
      if (availability === "Ofertas finalizadas" && offerState !== "finished") return false;
      return true;
    });
  }, [query, category, availability, now]);

  return (
    <>
      <a className="skip-link" href="#catalogo">Saltar al catálogo</a>
      <Header theme={theme} onToggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")} />
      <main className="min-h-screen">
        <Hero />

        <section className="catalog-section page-shell" id="catalogo" aria-labelledby="catalog-title">
          <div className="section-heading catalog-heading">
            <div>
              <p className="eyebrow"><span /> Equipamiento seleccionado</p>
              <h2 id="catalog-title">Catálogo de productos</h2>
              <p className="section-description">Encuentra el equipo adecuado y consulta su ficha, disponibilidad y precio.</p>
            </div>
            <div className="catalog-count"><strong>{filteredProducts.length.toString().padStart(2, "0")}</strong><span>productos<br />en catálogo</span></div>
          </div>

          <div className="catalog-toolbar" role="search" aria-label="Buscar y filtrar productos">
            <label className="search-field">
              <Icon name="search" />
              <span className="visually-hidden">Buscar productos</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca por producto, modelo o característica"
                autoComplete="off"
              />
              {query ? <button className="search-clear" type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><Icon name="close" size={15} /></button> : null}
            </label>
            <label className="filter-field">
              <span className="visually-hidden">Filtrar por categoría</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categoryOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="filter-field filter-availability">
              <span className="visually-hidden">Filtrar por disponibilidad u oferta</span>
              <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                {["Todos los productos", "Disponibles", "Oferta vigente", "Ofertas próximas", "Ofertas finalizadas"].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          <div className="results-line" aria-live="polite">
            <span>{filteredProducts.length === 1 ? "1 producto" : `${filteredProducts.length} productos`}</span>
            {(query || category !== "Todas las categorías" || availability !== "Todos los productos") ? (
              <button className="text-button" type="button" onClick={() => { setQuery(""); setCategory("Todas las categorías"); setAvailability("Todos los productos"); }}>
                Limpiar filtros <Icon name="close" size={14} />
              </button>
            ) : null}
          </div>

          {filteredProducts.length ? (
            <div className="product-grid grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={setSelectedProduct}
                  now={now}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state" role="status">
              <Icon name="search" size={26} />
              <h3>No encontramos productos</h3>
              <p>Prueba otra búsqueda o cambia los filtros seleccionados.</p>
              <button className="button button-dark" type="button" onClick={() => { setQuery(""); setCategory("Todas las categorías"); setAvailability("Todos los productos"); }}>Mostrar todo</button>
            </div>
          )}
        </section>

        <section className="company-section" id="empresa" aria-labelledby="company-title">
          <div className="company-inner page-shell">
            <div className="company-number" aria-hidden="true">CM<span>·</span>01</div>
            <div className="company-copy">
              <p className="eyebrow"><span /> Crusanti México</p>
              <h2 id="company-title">Información clara para elegir mejor.</h2>
              <p>Consulta los datos disponibles de cada producto. Las especificaciones pendientes se indican en su ficha y las existencias no confirmadas no habilitan la compra.</p>
            </div>
            <a className="button button-light" href="#catalogo">Consultar catálogo <Icon name="arrow" size={16} /></a>
          </div>
        </section>

        <section className="reviews-section page-shell" id="resenas" aria-labelledby="reviews-title">
          <div className="reviews-panel">
            <p className="eyebrow"><span /> Opiniones</p>
            <h2 id="reviews-title">Reseñas de clientes</h2>
            <p className="review-disclaimer">Contenido de demostración. Estas reseñas y comentarios son ejemplos, no testimonios de clientes reales.</p>
            <div className="reviews-grid">
              {demoReviews.map((review) => (
                <article className="review-card" key={review.name}>
                  <div className="review-card-heading">
                    <span className="review-demo-label">Reseña de demostración</span>
                    <span className="review-stars" role="img" aria-label="Calificación de demostración: 5 de 5 estrellas">
                      <span aria-hidden="true">★★★★★</span>
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-author">{review.name}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section page-shell" id="contacto" aria-labelledby="contact-title">
          <div className="contact-panel">
            <div><p className="eyebrow"><span /> Estamos para orientarte</p><h2 id="contact-title">¿Buscas un equipo en particular?</h2></div>
            <div className="contact-action"><p>Escríbenos para recibir más información y asesoría sobre nuestros productos.</p><a className="button button-accent" href={whatsappHref} target="_blank" rel="noopener noreferrer">Contáctanos por WhatsApp</a></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main page-shell">
          <a className="brand footer-brand" href="#inicio"><span className="brand-mark" aria-hidden="true">C</span><span className="brand-wordmark">CRUSANTI<span>MÉXICO</span></span></a>
          <p>Maquinaria industrial, accesorios y grúas.</p>
          <a className="footer-top-link" href="#inicio">Volver al inicio ↑</a>
        </div>
          <div className="footer-bottom page-shell"><span>© {new Date().getFullYear()} Crusanti México</span><span>Precios expresados en {currency}</span></div>
      </footer>

      <ProductDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        now={now}
      />
    </>
  );
}
