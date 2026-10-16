import { products, imageUrl } from "../catalog";
import Icon from "./Icon";

const heroImage = products.find((product) => product.id === "grua-cr20")?.mainImage;

export default function Hero() {
  return (
    <section className="hero-section" id="inicio" aria-labelledby="hero-title">
      <div className="hero-grid page-shell grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span /> Catálogo industrial Crusanti México</p>
          <h1 id="hero-title">Equipo listo para el <em>siguiente movimiento.</em></h1>
          <p className="hero-description">
            Maquinaria, elevación y herramientas para las necesidades de tu operación.
            Consulta cada ficha y revisa su disponibilidad.
          </p>
          <div className="hero-actions">
            <a className="button button-accent" href="#catalogo">Ver catálogo <Icon name="arrow" /></a>
            <a className="hero-text-link" href="#empresa">Conoce Crusanti <span aria-hidden="true">↘</span></a>
          </div>
          <div className="hero-note"><Icon name="check" size={16} /> Inventario y precios consultables por producto</div>
        </div>

        <div className="hero-visual" aria-label="Grúa hidráulica industrial CR-20">
          <div className="hero-image-wrap">
            {heroImage ? <img src={imageUrl(heroImage)} alt="Grúa hidráulica industrial CR-20" loading="eager" /> : null}
            <div className="hero-image-shade" />
            <div className="hero-image-caption"><span>Destacado del catálogo</span><strong>CR-20 · Grúa hidráulica</strong></div>
          </div>
          <div className="hero-stamp" aria-hidden="true"><span>CR</span><strong>MX</strong></div>
          <div className="hero-coordinate" aria-hidden="true">EQUIPOS PARA OPERACIÓN INDUSTRIAL</div>
        </div>
      </div>
      <div className="hero-ruler" aria-hidden="true"><span>01</span><i /><span>CATÁLOGO</span></div>
    </section>
  );
}
