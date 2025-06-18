import React from 'react';
import Card, { CardContent } from '../ui/Card';
import { Building2, DollarSign, AlertCircle, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  color: string;
}> = ({ title, value, icon, description, trend, color }) => (
  <Card className="col-span-1">
    <CardContent className="py-5">
      <div className="flex items-start">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className={`ml-2 text-sm ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

const PropertyStats: React.FC = () => {
  const { stats } = useAppContext();
  
  const occupancyRate = stats.totalProperties > 0 
    ? Math.round((stats.occupiedProperties / stats.totalProperties) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Propriedades"
        value={stats.totalProperties}
        icon={<Building2 className="h-5 w-5 text-white" />}
        description={`${stats.occupiedProperties} ocupadas, ${stats.vacantProperties} vagas`}
        color="bg-blue-600"
      />
      
      <StatCard 
        title="Inquilinos"
        value={stats.totalTenants}
        icon={<Users className="h-5 w-5 text-white" />}
        description={`${occupancyRate}% taxa de ocupação`}
        color="bg-teal-600"
      />
      
      <StatCard 
        title="Pagamentos em Atraso"
        value={stats.overduePayments}
        icon={<AlertCircle className="h-5 w-5 text-white" />}
        description={`${stats.pendingPayments} pagamentos pendentes`}
        color="bg-amber-500"
      />
      
      <StatCard 
        title="Receita Líquida"
        value={`R$ ${stats.netIncome.toLocaleString('pt-BR')}`}
        icon={<DollarSign className="h-5 w-5 text-white" />}
        description={`De R$ ${stats.totalIncome.toLocaleString('pt-BR')} bruto`}
        color="bg-emerald-600"
      />
    </div>
  );
};

export default PropertyStats;