import React, { useState } from 'react';
import { Building2, Plus, Search } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import PropertyForm from '../components/forms/PropertyForm';
import { useAppContext } from '../context/AppContext';
import { Property } from '../types';

const Properties: React.FC = () => {
  const { properties, tenants } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();
  
  // Filter properties by search term
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get tenant for a property
  const getPropertyTenant = (propertyId: string) => {
    return tenants.find(tenant => tenant.propertyId === propertyId);
  };
  
  const handleAddEdit = (property?: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };
  
  // Render badge for property status
  const renderStatusBadge = (status: string) => {
    let variant: 'success' | 'warning' | 'danger';
    let label: string;
    
    switch (status) {
      case 'occupied':
        variant = 'success';
        label = 'Ocupada';
        break;
      case 'vacant':
        variant = 'warning';
        label = 'Vaga';
        break;
      case 'maintenance':
        variant = 'danger';
        label = 'Manutenção';
        break;
      default:
        variant = 'warning';
        label = 'Vaga';
    }
    
    return (
      <Badge variant={variant}>
        {label}
      </Badge>
    );
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: 'Apartamento',
      house: 'Casa',
      commercial: 'Comercial',
      building: 'Prédio',
      lot: 'Lote'
    };
    return types[type] || type;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propriedades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seu portfólio imobiliário
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 sm:mt-0"
          icon={<Plus className="h-5 w-5" />}
          onClick={() => handleAddEdit()}
        >
          Adicionar Propriedade
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
              placeholder="Buscar propriedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const tenant = getPropertyTenant(property.id);
          
          return (
            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="h-48 bg-gray-200 relative">
                {property.imageUrl ? (
                  <img 
                    src={property.imageUrl} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {renderStatusBadge(property.status)}
                </div>
              </div>
              
              <CardContent>
                <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{property.address}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Tipo:</span>{' '}
                    <span className="font-medium text-gray-900">{getPropertyTypeLabel(property.type)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Área:</span>{' '}
                    <span className="font-medium text-gray-900">{property.area} m²</span>
                  </div>
                  {property.bedrooms !== undefined && (
                    <div>
                      <span className="text-gray-500">Quartos:</span>{' '}
                      <span className="font-medium text-gray-900">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div>
                      <span className="text-gray-500">Banheiros:</span>{' '}
                      <span className="font-medium text-gray-900">{property.bathrooms}</span>
                    </div>
                  )}
                </div>

                {property.units && property.units.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {property.units.length} unidade{property.units.length > 1 ? 's' : ''}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {property.units.slice(0, 3).map((unit, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {unit.unitNumber}
                        </span>
                      ))}
                      {property.units.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{property.units.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {tenant ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                        <p className="text-xs text-gray-500">{tenant.phone}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddEdit(property)}
                      >
                        Editar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Sem inquilino</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddEdit(property)}
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma propriedade encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar sua busca ou adicione uma nova propriedade para começar.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              icon={<Plus className="h-5 w-5" />}
              onClick={() => handleAddEdit()}
            >
              Adicionar Propriedade
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(undefined);
        }}
        title={selectedProperty ? 'Editar Propriedade' : 'Adicionar Propriedade'}
      >
        <PropertyForm
          property={selectedProperty}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProperty(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default Properties;