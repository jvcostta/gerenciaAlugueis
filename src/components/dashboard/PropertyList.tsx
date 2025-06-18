import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, User, ArrowRight } from 'lucide-react';
import Card, { CardContent, CardHeader, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';

const PropertyStatusBadge: React.FC<{ status: string }> = ({ status }) => {
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

const PropertyList: React.FC = () => {
  const { properties, tenants } = useAppContext();
  
  // Get tenant name for a property
  const getTenantName = (propertyId: string) => {
    const tenant = tenants.find(t => t.propertyId === propertyId);
    return tenant ? tenant.name : 'Sem inquilino';
  };

  return (
    <Card>
      <CardHeader 
        title="Propriedades" 
        subtitle="Visão geral das suas propriedades" 
        action={
          <Button 
            variant="outline" 
            size="sm"
            icon={<Building2 className="h-4 w-4" />}
          >
            Adicionar Propriedade
          </Button>
        }
      />
      <CardContent className="px-0 py-0">
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {properties.map((property) => (
              <li key={property.id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="px-6 py-4 flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                    {property.imageUrl ? (
                      <img src={property.imageUrl} alt={property.name} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{property.name}</p>
                      <PropertyStatusBadge status={property.status} />
                    </div>
                    <div className="mt-1 flex items-center">
                      <p className="text-sm text-gray-500 truncate">{property.address}</p>
                    </div>
                    <div className="mt-1 flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-500">{getTenantName(property.id)}</p>
                    </div>
                  </div>
                  <div className="ml-2">
                    <Link to={`/properties/${property.id}`} className="text-gray-400 hover:text-gray-500">
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/properties" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas as propriedades
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyList;