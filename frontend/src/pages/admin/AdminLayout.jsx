import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  LayoutGrid,
  Users,
  IdCard,
  Package,
  LogOut,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  ChartColumn,
  Ellipsis,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../../components/BrandLogo';
import Modal from '../../components/Modal';
import './AdminLayout.css';

const SECTIONS = [
  { to: '/admin/historico', label: 'Histórico', icon: LayoutGrid },
  { to: '/admin/relatorios', label: 'Relatórios', icon: ChartColumn },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/funcionarios', label: 'Funcionários', icon: IdCard },
  { to: '/admin/itens', label: 'Itens', icon: Package },
  { to: '/admin/administradores', label: 'Administradores', icon: ShieldCheck },
];

// No celular as 4 mais usadas ficam na barra de abas; o resto vai para "Mais"
const TABS = ['/admin/historico', '/admin/relatorios', '/admin/itens', '/admin/clientes'];
const MAIS = [
  ...SECTIONS.filter((s) => !TABS.includes(s.to)),
  { to: '/admin/alterar-senha', label: 'Alterar senha', icon: KeyRound },
];

export default function AdminLayout() {
  const { nomeAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [maisAberto, setMaisAberto] = useState(false);

  useEffect(() => {
    setMaisAberto(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const sair = () => {
    logout();
    navigate('/');
  };

  const naAbaMais = MAIS.some((s) => pathname.startsWith(s.to));
  const iniciais = nomeAdmin?.slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="rail">
        <button className="rail-icon" onClick={toggleTheme} title="Alternar tema">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <div className="rail-nav">
          {SECTIONS.map((s) => (
            <NavLink key={s.to} to={s.to} className={({ isActive }) => `rail-icon ${isActive ? 'active' : ''}`} title={s.label}>
              <s.icon size={18} />
            </NavLink>
          ))}
        </div>
        <button className="rail-icon" onClick={sair} title="Sair">
          <LogOut size={18} />
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar admin-topbar">
          <div className="topbar-brand">
            <BrandLogo height={30} />
            <span className="brand-divider" />
            <span className="brand-word">Checklist</span>
          </div>

          <nav className="pill-nav">
            {SECTIONS.map((s) => (
              <NavLink key={s.to} to={s.to} className={({ isActive }) => `pill-nav-item ${isActive ? 'active' : ''}`}>
                {s.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar-actions">
            <button className="topbar-icon-btn" onClick={toggleTheme} aria-label="Alternar tema">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <NavLink to="/admin/alterar-senha" className="topbar-account" title="Alterar senha">
              <span className="avatar-badge">{iniciais}</span>
              <div className="account-text">
                <span className="account-name">{nomeAdmin}</span>
                <span className="account-role">Administrador</span>
              </div>
              <ChevronDown size={16} color="var(--text-tertiary)" className="account-chevron" />
            </NavLink>
          </div>
        </header>

        <main className="container admin-main">
          <Outlet />
        </main>
      </div>

      <nav className="tabbar" aria-label="Navegação">
        {TABS.map((to) => {
          const s = SECTIONS.find((x) => x.to === to);
          return (
            <NavLink key={to} to={to} className={({ isActive }) => `tabbar-item ${isActive ? 'active' : ''}`}>
              <s.icon size={22} />
              <span>{s.label}</span>
            </NavLink>
          );
        })}
        <button type="button" className={`tabbar-item ${naAbaMais ? 'active' : ''}`} onClick={() => setMaisAberto(true)}>
          <Ellipsis size={22} />
          <span>Mais</span>
        </button>
      </nav>

      {maisAberto && (
        <Modal title="Mais opções" onClose={() => setMaisAberto(false)}>
          <div className="sheet-account">
            <span className="avatar-badge">{iniciais}</span>
            <div className="account-text" style={{ display: 'flex' }}>
              <span className="account-name">{nomeAdmin}</span>
              <span className="account-role">Administrador</span>
            </div>
          </div>
          <div className="sheet-list">
            {MAIS.map((s) => (
              <NavLink key={s.to} to={s.to} className={({ isActive }) => `sheet-item ${isActive ? 'active' : ''}`}>
                <span className="sheet-item-icon">
                  <s.icon size={18} />
                </span>
                {s.label}
                <ChevronRight size={18} className="sheet-item-chevron" />
              </NavLink>
            ))}
            <button type="button" className="sheet-item" onClick={toggleTheme}>
              <span className="sheet-item-icon">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</span>
              {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
            </button>
            <button type="button" className="sheet-item sheet-item-danger" onClick={sair}>
              <span className="sheet-item-icon">
                <LogOut size={18} />
              </span>
              Sair
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
