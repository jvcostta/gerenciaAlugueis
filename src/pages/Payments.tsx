import React, { useState } from 'react';
import { CreditCard, DollarSign, Plus, Search, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import PaymentForm from '../components/forms/PaymentForm';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Payment } from '../types';

const Payments: React.FC = () => {
  const { payments, contracts, properties, tenants } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>();
  
  // Get property and tenant for a payment
  const getPaymentDetails = (payment: typeof payments[0]) => {
    const contract = contracts.find(c => c.id === payment.contractId);
    if (!contract) return { propertyName: 'Desconhecido', tenantName: 'Desconhecido' };
    
    const property = properties.find(p => p.id === contract.propertyId);
    const tenant = tenants.find(t => t.id === contract.tenantId);
    
    return {
      propertyName: property ? property.name : 'Propriedade desconhecida',
      tenantName: tenant ? tenant.name : 'Inquilino desconhecido'
    };
  };
  
  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const { propertyName, tenantName } = getPaymentDetails(payment);
    const searchMatch = 
      propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    
    return searchMatch && statusMatch;
  });
  
  // Sort payments: newest first
  const sortedPayments = [...filteredPayments].sort((a, b) => 
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  );

  const handleAddEdit = (payment?: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'Pago',
      pending: 'Pendente',
      overdue: 'Em Atraso'
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method?: string) => {
    const methods: Record<string, string> = {
      'bank transfer': 'Transferência Bancária',
      'credit card': 'Cartão de Crédito',
      'cash': 'Dinheiro',
      'pix': 'PIX',
      'boleto': 'Boleto'
    };
    return method ? methods[method] || method : '-';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie pagamentos de aluguel e histórico
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 sm:mt-0"
          icon={<Plus className="h-5 w-5" />}
          onClick={() => handleAddEdit()}
        >
          Registrar Pagamento
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar pagamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="paid">Pagos</option>
                <option value="pending">Pendentes</option>
                <option value="overdue">Em Atraso</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propriedade & Inquilino
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data do Pagamento
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPayments.map((payment) => {
              const { propertyName, tenantName } = getPaymentDetails(payment);
              
              return (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {payment.status === 'paid' && (
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                      )}
                      {payment.status === 'pending' && (
                        <Clock className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      {payment.status === 'overdue' && (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      {payment.status === 'paid' && (
                        <Badge variant="success">Pago</Badge>
                      )}
                      {payment.status === 'pending' && (
                        <Badge variant="warning">Pendente</Badge>
                      )}
                      {payment.status === 'overdue' && (
                        <Badge variant="danger">Em Atraso</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{propertyName}</div>
                    <div className="text-sm text-gray-500">{tenantName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(payment.dueDate), 'PP', { locale: ptBR })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {payment.amount.toLocaleString('pt-BR')}
                    </div>
                    {payment.lateFee > 0 && (
                      <div className="text-xs text-red-600">
                        + R$ {payment.lateFee.toLocaleString('pt-BR')} (multa)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === 'paid' ? (
                      <div>
                        <div className="text-sm text-gray-900">
                          {format(new Date(payment.date), 'PP', { locale: ptBR })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getPaymentMethodLabel(payment.paymentMethod)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAddEdit(payment)}
                    >
                      {payment.status === 'paid' ? 'Ver' : 'Editar'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {sortedPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum pagamento encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros de busca ou registre um novo pagamento.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                icon={<Plus className="h-5 w-5" />}
                onClick={() => handleAddEdit()}
              >
                Registrar Pagamento
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(undefined);
        }}
        title={selectedPayment ? 'Editar Pagamento' : 'Registrar Pagamento'}
      >
        <PaymentForm
          payment={selectedPayment}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPayment(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default Payments;