import React, { useState } from 'react';
import { FileText, Plus, Search, Building2, User, Calendar, DollarSign } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import ContractForm from '../components/forms/ContractForm';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Contract } from '../types';

const Contracts: React.FC = () => {
  const { contracts, properties, tenants } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | undefined>();
  
  // Group contracts by property
  const contractsByProperty = contracts.reduce((acc, contract) => {
    const property = properties.find(p => p.id === contract.propertyId);
    const propertyName = property ? property.name : 'Propriedade desconhecida';
    
    if (!acc[propertyName]) {
      acc[propertyName] = [];
    }
    acc[propertyName].push(contract);
    return acc;
  }, {} as Record<string, Contract[]>);
  
  // Filter contracts by search term
  const filteredContractsByProperty = Object.entries(contractsByProperty).reduce((acc, [propertyName, propertyContracts]) => {
    const filteredContracts = propertyContracts.filter(contract => {
      const tenant = tenants.find(t => t.id === contract.tenantId);
      const tenantName = tenant ? tenant.name : '';
      
      return propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    if (filteredContracts.length > 0) {
      acc[propertyName] = filteredContracts;
    }
    return acc;
  }, {} as Record<string, Contract[]>);

  const handleAddEdit = (contract?: Contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    let variant: 'success' | 'warning' | 'danger';
    let label: string;
    
    switch (status) {
      case 'active':
        variant = 'success';
        label = 'Ativo';
        break;
      case 'expired':
        variant = 'warning';
        label = 'Expirado';
        break;
      case 'terminated':
        variant = 'danger';
        label = 'Rescindido';
        break;
      default:
        variant = 'warning';
        label = 'Desconhecido';
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Inquilino desconhecido';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie contratos de locação por propriedade
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 sm:mt-0"
          icon={<Plus className="h-5 w-5" />}
          onClick={() => handleAddEdit()}
        >
          Novo Contrato
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {Object.entries(filteredContractsByProperty).map(([propertyName, propertyContracts]) => (
          <Card key={propertyName}>
            <CardHeader
              title={propertyName}
              subtitle={`${propertyContracts.length} contrato${propertyContracts.length > 1 ? 's' : ''}`}
              action={
                <div className="flex items-center text-gray-500">
                  <Building2 className="h-5 w-5" />
                </div>
              }
            />
            <CardContent className="px-0 py-0">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inquilino
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Período
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aluguel
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contrato
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {propertyContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {getTenantName(contract.tenantId)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Vencimento dia {contract.paymentDueDay}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <div>
                              <div>{format(new Date(contract.startDate), 'PP', { locale: ptBR })}</div>
                              <div className="text-gray-500">até {format(new Date(contract.endDate), 'PP', { locale: ptBR })}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                            <div>
                              <div className="font-medium text-gray-900">
                                R$ {contract.monthlyRent.toLocaleString('pt-BR')}
                              </div>
                              {contract.depositAmount > 0 && (
                                <div className="text-gray-500">
                                  Caução: R$ {contract.depositAmount.toLocaleString('pt-BR')}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(contract.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contract.contractFile ? (
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Ver Arquivo
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-500">Sem arquivo</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddEdit(contract)}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {Object.keys(filteredContractsByProperty).length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum contrato encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar sua busca ou crie um novo contrato para começar.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              icon={<Plus className="h-5 w-5" />}
              onClick={() => handleAddEdit()}
            >
              Novo Contrato
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedContract(undefined);
        }}
        title={selectedContract ? 'Editar Contrato' : 'Novo Contrato'}
      >
        <ContractForm
          contract={selectedContract}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedContract(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default Contracts;