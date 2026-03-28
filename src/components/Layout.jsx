import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { categories } from '../data/mockDocuments';
import { Home, Users, FileText, Activity, ClipboardList, Scale, Menu, X, Info } from 'lucide-react';

const iconMap = {
  'users': Users,
  'file-text': FileText,
  'activity': Activity,
  'clipboard-list': ClipboardList,
  'scale': Scale
};

const MOBILE_BREAKPOINT = 768;

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onPopState = () => setMenuOpen(false);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-container">
      {menuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}
      <aside
        id="app-sidebar"
        className={`sidebar${menuOpen ? ' sidebar-open' : ''}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Scale className="nav-icon sidebar-brand-icon" />
            <span className="sidebar-brand-text">Legal Research</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <X className="nav-icon" aria-hidden />
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            end
            onClick={closeMenu}
          >
            <Home className="nav-icon" />
            Home
          </NavLink>
          <div className="sidebar-section-label">Categories</div>
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.iconType] || FileText;
            return (
              <NavLink
                key={cat.id}
                to={`/category/${cat.id}`}
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                onClick={closeMenu}
              >
                <IconComponent className="nav-icon" />
                {cat.title}
              </NavLink>
            );
          })}
          <div className="sidebar-section-label">About</div>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMenu}
          >
            <Info className="nav-icon" />
            Capabilities
          </NavLink>
        </nav>
      </aside>
      <div className="main-column">
        <header className="mobile-top-bar">
          <button
            type="button"
            className="mobile-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="nav-icon" aria-hidden />
          </button>
          <span className="mobile-top-bar-title">Legal Research</span>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
