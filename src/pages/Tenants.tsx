import React, { useState } from 'react';
import { Users, User, Plus, Search, Mail, Phone } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TenantForm from '../components/forms/TenantForm';
import { useAppContext } from '../context/AppContext';
import { Tenant } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Tenants: React.FC = () => {
  const { tenants, properties } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | undefined>();
  
  // Filter tenants by search term
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.cpf.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get property for a tenant
  const getTenantProperty = (propertyId: string) => {
    return properties.find(property => property.id === propertyId);
  };

  const handleAddEdit = (tenant?: Tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquilinos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seus inquilinos e suas informações
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 sm:mt-0"
          icon={<Plus className="h-5 w-5" />}
          onClick={() => handleAddEdit()}
        >
          Adicionar Inquilino
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
              placeholder="Buscar inquilinos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inquilino
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propriedade
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ocupantes
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTenants.map((tenant) => {
              const property = getTenantProperty(tenant.propertyId);
              
              return (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">
                          Desde {format(new Date(tenant.createdAt), 'PP', { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        {tenant.phone}
                      </div>
                      {tenant.cpf && (
                        <div className="text-sm text-gray-500 mt-1">
                          CPF: {tenant.cpf}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property ? property.name : 'Sem propriedade'}</div>
                    <div className="text-sm text-gray-500">{property ? property.address : 'Não atribuído'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.occupants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAddEdit(tenant)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredTenants.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum inquilino encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar sua busca ou adicione um novo inquilino para começar.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                icon={<Plus className="h-5 w-5" />}
                onClick={() => handleAddEdit()}
              >
                Adicionar Inquilino
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTenant(undefined);
        }}
        title={selectedTenant ? 'Editar Inquilino' : 'Adicionar Inquilino'}
      >
        <TenantForm
          tenant={selectedTenant}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTenant(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default Tenants;