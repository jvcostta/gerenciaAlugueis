import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { Tenant } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface TenantFormProps {
  tenant?: Tenant;
  onClose: () => void;
}

const TenantForm: React.FC<TenantFormProps> = ({ tenant, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: tenant || {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      occupants: 1,
      propertyId: '',
      unitId: '',
      contractId: ''
    }
  });
  
  const { addTenant, updateTenant, properties } = useAppContext();
  
  const onSubmit = (data: any) => {
    const tenantData = {
      ...data,
      occupants: Number(data.occupants)
    };
    
    if (tenant) {
      updateTenant({ ...tenant, ...tenantData });
    } else {
      addTenant(tenantData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
        <input
          type="text"
          {...register('name', { required: 'Nome é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Nome completo do inquilino"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">CPF</label>
        <input
          type="text"
          {...register('cpf', { required: 'CPF é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="000.000.000-00"
        />
        {errors.cpf && (
          <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register('email', { 
            required: 'Email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="email@exemplo.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Telefone</label>
        <input
          type="tel"
          {...register('phone', { required: 'Telefone é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="(11) 99999-9999"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Número de Ocupantes</label>
        <input
          type="number"
          {...register('occupants', { min: 1 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Propriedade</label>
        <select
          {...register('propertyId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Selecione uma propriedade</option>
          {properties.map(property => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {tenant ? 'Atualizar' : 'Adicionar'} Inquilino
        </Button>
      </div>
    </form>
  );
};

export default TenantForm;