import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Repeat, BookOpen, AlertTriangle, List, TrendingUp, CheckCircle2 
} from 'lucide-react';

// Sub-pages
import LibrarianOverview from './LibrarianOverview';
import CatalogManager from '../Librarian/CatalogManager';
import CirculationDesk from '../Librarian/CirculationDesk';
import FinesManager from '../Librarian/FinesManager';
import HoldQueueManager from '../Librarian/HoldQueueManager';
import InventoryAudit from '../Librarian/InventoryAudit';
import SettingsPage from './Settings';

const LibrarianDashboard = () => {
  const librarianSidebar = [
    {
      title: 'Operations',
      links: [
        { to: '/librarian', icon: TrendingUp, label: 'Overview' },
        { to: '/librarian/circulation', icon: Repeat, label: 'Issue / Return' },
        { to: '/librarian/catalog', icon: BookOpen, label: 'Catalog Manager' },
      ]
    },
    {
      title: 'Management',
      links: [
        { to: '/librarian/fines', icon: AlertTriangle, label: 'Fines & Penalties' },
        { to: '/librarian/holds', icon: List, label: 'Hold Queue' },
        { to: '/librarian/inventory', icon: CheckCircle2, label: 'Inventory Audit' },
      ]
    }
  ];

  return (
    <DashboardLayout 
      sidebarGroups={librarianSidebar} 
      title="Librarian Work-Center" 
      subtitle="Knowledge Asset Management System"
    >
      <Routes>
        <Route index element={<LibrarianOverview />} />
        <Route path="circulation" element={<CirculationDesk />} />
        <Route path="catalog" element={<CatalogManager />} />
        <Route path="fines" element={<FinesManager />} />
        <Route path="holds" element={<HoldQueueManager />} />
        <Route path="inventory" element={<InventoryAudit />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default LibrarianDashboard;
