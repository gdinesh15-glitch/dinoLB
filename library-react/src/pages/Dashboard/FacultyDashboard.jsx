import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  GraduationCap, BookMarked, FilePlus, Globe
} from 'lucide-react';

// Sub-pages
import FacultyOverview from './FacultyOverview';
import CourseReserves from '../Faculty/CourseReserves';
import PurchaseRequests from '../Faculty/PurchaseRequests';
import ILLRequests from '../Faculty/ILLRequests';
import SettingsPage from './Settings';

const FacultyDashboard = () => {
  const facultySidebar = [
    {
      title: 'Academic Desk',
      links: [
        { to: '/faculty', icon: GraduationCap, label: 'Overview' },
        { to: '/faculty/reserves', icon: BookMarked, label: 'Course Reserves' },
        { to: '/faculty/requests', icon: FilePlus, label: 'Purchase Reqs' },
      ]
    },
    {
      title: 'Global Research',
      links: [
        { to: '/faculty/ill', icon: Globe, label: 'Inter-Library Loan' },
      ]
    }
  ];

  return (
    <DashboardLayout 
      sidebarGroups={facultySidebar} 
      title="Academic Portal" 
      subtitle="Faculty Research & Resources"
    >
      <Routes>
        <Route index element={<FacultyOverview />} />
        <Route path="reserves" element={<CourseReserves />} />
        <Route path="requests" element={<PurchaseRequests />} />
        <Route path="ill" element={<ILLRequests />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
