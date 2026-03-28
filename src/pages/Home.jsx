import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/mockDocuments';
import { Users, FileText, Activity, ClipboardList, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

const iconMap = {
  'users': Users,
  'file-text': FileText,
  'activity': Activity,
  'clipboard-list': ClipboardList,
  'scale': Scale
};

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <ShieldCheck size={48} color="var(--accent-blue)" style={{ marginBottom: '1rem' }} />
        <h1 className="hero-title">Town of Barrington Public Records</h1>
        <p className="hero-subtitle">
          Comprehensive physical and digital archive of municipal planning materials,
          specifically regarding the Belton Court permit application process.
        </p>
      </div>

      <h2 className="section-header">Record Categories</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {categories.map(cat => {
          const IconComponent = iconMap[cat.iconType] || FileText;
          return (
            <Link to={`/category/${cat.id}`} key={cat.id} style={{ display: 'block' }}>
              <div 
                className="document-item" 
                style={{ 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  height: '100%',
                  gap: '0.75rem',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                  <div style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: '8px' }}>
                    <IconComponent className="doc-icon" size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{cat.title}</h3>
                  <ArrowRight size={16} color="#94a3b8" />
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {cat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
