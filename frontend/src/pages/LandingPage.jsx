import { Link } from 'react-router-dom';
import { Users, ShieldCheck, ArrowRight } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing shell">
      <div className="landing-frame rise">
        {/* Painel escuro com a marca */}
        <aside className="landing-aside">
          <div className="landing-aside-content">
            <span className="landing-icon-tile">
              <img src="/brand/simbolo-ib-claro.png" alt="Grupo iBlanco" />
            </span>
            <h1>Checklist</h1>
            <p>Registre, acompanhe e finalize a retirada de equipamentos levados para os clientes.</p>
          </div>
        </aside>

        {/* Painel branco de acesso */}
        <section className="landing-main">
          <div className="landing-access">
            <div className="landing-access-head">
              <h2>Bem-vindo ao Checklist</h2>
              <p>Escolha como deseja acessar o sistema</p>
            </div>

            <div className="landing-tiles">
              <Link to="/campo" className="landing-tile">
                <span className="landing-tile-icon">
                  <Users size={20} />
                </span>
                <span className="landing-tile-body">
                  <span className="eyebrow">Equipe</span>
                  <strong>Sou da equipe</strong>
                  <span>Selecione seu nome e monte a comanda em campo.</span>
                </span>
                <ArrowRight size={18} className="landing-tile-arrow" />
              </Link>

              <Link to="/entrar" className="landing-tile">
                <span className="landing-tile-icon">
                  <ShieldCheck size={20} />
                </span>
                <span className="landing-tile-body">
                  <span className="eyebrow">Gestão</span>
                  <strong>Administrador</strong>
                  <span>Login para gerenciar cadastros e ver o histórico.</span>
                </span>
                <ArrowRight size={18} className="landing-tile-arrow" />
              </Link>
            </div>
          </div>

          <footer className="landing-main-footer">
            <span>© {new Date().getFullYear()} Grupo iBlanco</span>
            <span>Controle de Equipamentos · Social Media</span>
          </footer>
        </section>
      </div>
    </div>
  );
}
