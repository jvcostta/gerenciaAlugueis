import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const today = format(new Date(), 'PPP', { locale: ptBR });
  
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/properties':
        return 'Propriedades';
      case '/tenants':
        return 'Inquilinos';
      case '/contracts':
        return 'Contratos';
      case '/payments':
        return 'Pagamentos';
      case '/expenses':
        return 'Despesas';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Abrir menu</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-2 md:ml-0">
              <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-500">{today}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Ver notificações</span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  A
                </div>
                <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;