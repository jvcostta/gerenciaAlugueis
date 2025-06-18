import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { Contract } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { Upload } from 'lucide-react';

interface ContractFormProps {
  contract?: Contract;
  onClose: () => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ contract, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: contract || {
      propertyId: '',
      tenantId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyRent: 0,
      depositAmount: 0,
      paymentDueDay: 5,
      lateFeeDays: 5,
      lateFeePercentage: 10,
      status: 'active'
    }
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addContract, updateContract, properties, tenants } = useAppContext();
  
  const onSubmit = (data: any) => {
    const contractData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      monthlyRent: Number(data.monthlyRent),
      depositAmount: Number(data.depositAmount),
      paymentDueDay: Number(data.paymentDueDay),
      lateFeeDays: Number(data.lateFeeDays),
      lateFeePercentage: Number(data.lateFeePercentage)
    };
    
    if (contract) {
      updateContract({ ...contract, ...contractData });
    } else {
      addContract(contractData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Propriedade</label>
        <select
          {...register('propertyId', { required: 'Propriedade é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Selecione uma propriedade</option>
          {properties.map(property => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>
        {errors.propertyId && (
          <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Inquilino</label>
        <select
          {...register('tenantId', { required: 'Inquilino é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Selecione um inquilino</option>
          {tenants.map(tenant => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>
        {errors.tenantId && (
          <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Início</label>
          <input
            type="date"
            {...register('startDate', { required: 'Data de início é obrigatória' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Término</label>
          <input
            type="date"
            {...register('endDate', { required: 'Data de término é obrigatória' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Aluguel Mensal (R$)</label>
          <input
            type="number"
            step="0.01"
            {...register('monthlyRent', { required: 'Aluguel mensal é obrigatório', min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0,00"
          />
          {errors.monthlyRent && (
            <p className="mt-1 text-sm text-red-600">{errors.monthlyRent.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Caução (R$)</label>
          <input
            type="number"
            step="0.01"
            {...register('depositAmount', { min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Dia do Vencimento</label>
          <input
            type="number"
            min="1"
            max="31"
            {...register('paymentDueDay', { required: 'Dia do vencimento é obrigatório', min: 1, max: 31 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dias para Multa</label>
          <input
            type="number"
            min="0"
            {...register('lateFeeDays', { min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Multa (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register('lateFeePercentage', { min: 0, max: 100 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="active">Ativo</option>
          <option value="expired">Expirado</option>
          <option value="terminated">Rescindido</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contrato (PDF/Word)</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="contract-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Enviar contrato</span>
                <input
                  id="contract-upload"
                  name="contract-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1">ou arraste e solte</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX até 10MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {contract ? 'Atualizar' : 'Criar'} Contrato
        </Button>
      </div>
    </form>
  );
};

export default ContractForm;