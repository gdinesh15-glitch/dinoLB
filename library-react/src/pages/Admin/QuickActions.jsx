import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, BookPlus, ClipboardList, ShieldAlert, 
  Settings, Database, Handshake, Mail, Globe, 
  Terminal, ShieldCheck, Zap
} from 'lucide-react';
import { Card } from '../../components/SharedUI';

const QuickActionCard = ({ icon: Icon, title, desc, onClick, color }) => (
  <Card 
    className="group cursor-pointer hover:border-[var(--accent-base)] transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
    onClick={onClick}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} style={{ backgroundColor: color }}></div>
    <div className="flex items-start space-x-5 relative z-10">
      <div className={`p-4 rounded-2xl transition-all group-hover:scale-110`} style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-base)] transition-colors">{title}</h3>
        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  </Card>
);

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      title: 'Initialize Librarian', 
      desc: 'Provision a new administrative account with limited clearance', 
      icon: ShieldCheck, 
      color: '#6366f1', 
      to: '/admin/add-librarian' 
    },
    { 
      title: 'Catalog New Asset', 
      desc: 'Register a new physical or digital book into the institutional registry', 
      icon: BookPlus, 
      color: '#ec4899', 
      to: '/admin/books' 
    },
    { 
      title: 'Identity Audit', 
      desc: 'Review all authorized personnel and manage access states', 
      icon: UserPlus, 
      color: '#10b981', 
      to: '/admin/users' 
    },
    { 
      title: 'System Protocols', 
      desc: 'Modify global library constants and access rules', 
      icon: Terminal, 
      color: '#f59e0b', 
      to: '/admin/config' 
    },
    { 
      title: 'Philanthropic Ledger', 
      desc: 'Manage external book contributions and community donations', 
      icon: Handshake, 
      color: '#8b5cf6', 
      to: '/admin/donations' 
    },
    { 
      title: 'Data Integrity', 
      desc: 'View comprehensive system audit logs and event history', 
      icon: ClipboardList, 
      color: '#06b6d4', 
      to: '/admin/audit' 
    },
    { 
      title: 'Security Sentinel', 
      desc: 'Configure advanced multi-factor and firewall protocols', 
      icon: ShieldAlert, 
      color: '#ef4444', 
      to: '/admin/settings' 
    },
    { 
      title: 'Global Outreach', 
      desc: 'Manage inter-institutional sharing and external APIs', 
      icon: Globe, 
      color: '#3b82f6', 
      to: '/admin/settings' 
    }
  ];

  return (
    <div className="space-y-10 animate-in opacity-0">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-[var(--accent-base)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-base)]">
          <Zap className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Command Center</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Accelerated administrative protocols and quick-access utilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {actions.map((action, idx) => (
          <QuickActionCard 
            key={idx} 
            {...action} 
            onClick={() => navigate(action.to)} 
          />
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)]/30 border border-[var(--border-color)] rounded-[2.5rem] p-12 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="relative z-10">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Institutional Intelligence</h4>
            <p className="text-xs font-medium text-slate-500 max-w-xl mx-auto">All actions performed in the Command Center are logged in the immutable Security Audit Trail for institutional compliance and transparency.</p>
         </div>
      </div>
    </div>
  );
};

export default QuickActions;
