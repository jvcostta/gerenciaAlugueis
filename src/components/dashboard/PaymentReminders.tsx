import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Card, { CardContent, CardHeader, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const PaymentStatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'paid':
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-amber-500" />;
    case 'overdue':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const PaymentStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let variant: 'success' | 'warning' | 'danger';
  let label: string;
  
  switch (status) {
    case 'paid':
      variant = 'success';
      label = 'Pago';
      break;
    case 'pending':
      variant = 'warning';
      label = 'Pendente';
      break;
    case 'overdue':
      variant = 'danger';
      label = 'Em Atraso';
      break;
    default:
      variant = 'warning';
      label = 'Pendente';
  }
  
  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
};

const PaymentReminders: React.FC = () => {
  const { payments, contracts, properties, tenants } = useAppContext();
  
  // Sort payments: overdue first, then pending, then paid (most recent first)
  const sortedPayments = [...payments].sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
    if (a.status === 'pending' && b.status === 'paid') return -1;
    if (a.status === 'paid' && b.status === 'pending') return 1;
    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
  }).slice(0, 5); // Get only the 5 most important
  
  // Get property and tenant info for a payment
  const getPaymentDetails = (payment: typeof payments[0]) => {
    const contract = contracts.find(c => c.id === payment.contractId);
    if (!contract) return { propertyName: 'Propriedade desconhecida', tenantName: 'Inquilino desconhecido' };
    
    const property = properties.find(p => p.id === contract.propertyId);
    const tenant = tenants.find(t => t.id === contract.tenantId);
    
    return {
      propertyName: property ? property.name : 'Propriedade desconhecida',
      tenantName: tenant ? tenant.name : 'Inquilino desconhecido'
    };
  };

  return (
    <Card>
      <CardHeader 
        title="Lembretes de Pagamento" 
        subtitle="Pagamentos recentes e próximos"
      />
      <CardContent className="px-0 py-0">
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {sortedPayments.map((payment) => {
              const { propertyName, tenantName } = getPaymentDetails(payment);
              return (
                <li key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <PaymentStatusIcon status={payment.status} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{propertyName}</p>
                        <PaymentStatusBadge status={payment.status} />
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">{tenantName}</p>
                      </div>
                      <div className="mt-1 flex justify-between">
                        <p className="text-sm text-gray-500">
                          Vencimento: {format(new Date(payment.dueDate), 'PP', { locale: ptBR })}
                        </p>
                        <p className="text-sm font-medium">
                          R$ {payment.amount.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/payments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todos os pagamentos
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PaymentReminders;