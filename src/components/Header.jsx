import { useEffect, useState } from "react";
import Icon from "./Icon";
import { whatsappHref } from "../whatsapp";

export default function Header({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Crusanti México, inicio">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span className="brand-wordmark">CRUSANTI<span>MÉXICO</span></span>
        </a>

        <button
          className="icon-button nav-toggle"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>

        <nav id="main-navigation" className={`main-navigation${menuOpen ? " is-open" : ""}`} aria-label="Navegación principal">
          <a href="#catalogo" onClick={closeMenu}>Catálogo</a>
          <a href="#empresa" onClick={closeMenu}>La empresa</a>
          <a className="whatsapp-contact-link" href="#contacto" onClick={closeMenu}>
            Contáctanos por WhatsApp
          </a>
          <a href="#resenas" onClick={closeMenu}>Reseñas</a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
            title={theme === "dark" ? "Tema claro" : "Tema oscuro"}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
          <a className="button button-small button-dark" href="#catalogo" onClick={closeMenu}>
            Explorar equipos <Icon name="arrow" size={15} />
          </a>
        </div>
      </div>
    </header>
  );
}
