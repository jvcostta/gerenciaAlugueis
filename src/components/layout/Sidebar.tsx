import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  CreditCard, 
  PieChart, 
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`
    }
  >
    <span className="mr-3 h-5 w-5">{icon}</span>
    {label}
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Sidebar header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Imobly</span>
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 px-2 py-4 space-y-1">
        <NavItem to="/" icon={<Home />} label="Dashboard" />
        <NavItem to="/properties" icon={<Building2 />} label="Propriedades" />
        <NavItem to="/tenants" icon={<Users />} label="Inquilinos" />
        <NavItem to="/contracts" icon={<FileText />} label="Contratos" />
        <NavItem to="/payments" icon={<CreditCard />} label="Pagamentos" />
        <NavItem to="/expenses" icon={<PieChart />} label="Despesas" />
      </div>
      
      {/* Profile/Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;