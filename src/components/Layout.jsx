import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { categories } from '../data/mockDocuments';
import { Home, Users, FileText, Activity, ClipboardList, Scale, Archive } from 'lucide-react';

const iconMap = {
  'users': Users,
  'file-text': FileText,
  'activity': Activity,
  'clipboard-list': ClipboardList,
  'scale': Scale
};

export default function Layout() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Archive className="nav-icon" style={{color: 'var(--accent-blue)'}} />
            Barrington Archive
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
            end
          >
            <Home className="nav-icon" />
            Home
          </NavLink>
          <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
            Categories
          </div>
          {categories.map(cat => {
            const IconComponent = iconMap[cat.iconType] || FileText;
            return (
              <NavLink 
                key={cat.id}
                to={`/category/${cat.id}`}
                className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
              >
                <IconComponent className="nav-icon" />
                {cat.title}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
