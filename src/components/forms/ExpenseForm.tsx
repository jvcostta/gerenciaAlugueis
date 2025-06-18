import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { Expense } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { Upload } from 'lucide-react';

interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: expense || {
      propertyId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'other',
      description: '',
      recurring: false
    }
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addExpense, updateExpense, properties } = useAppContext();
  
  const onSubmit = (data: any) => {
    const expenseData = {
      ...data,
      date: new Date(data.date),
      amount: Number(data.amount),
      recurring: Boolean(data.recurring)
    };
    
    if (expense) {
      updateExpense({ ...expense, ...expenseData });
    } else {
      addExpense(expenseData);
    }
    onClose();
  };

  const categoryOptions = [
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'utilities', label: 'Utilidades' },
    { value: 'taxes', label: 'Impostos' },
    { value: 'insurance', label: 'Seguro' },
    { value: 'other', label: 'Outros' }
  ];

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
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <input
          type="text"
          {...register('description', { required: 'Descrição é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Descrição da despesa"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Categoria</label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { required: 'Valor é obrigatório', min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="0,00"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Data</label>
        <input
          type="date"
          {...register('date', { required: 'Data é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comprovante</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="receipt-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Enviar arquivo</span>
                <input
                  id="receipt-upload"
                  name="receipt-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.jpg,.jpeg,.png"
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1">ou arraste e solte</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, PNG, JPG até 10MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="recurring"
          type="checkbox"
          {...register('recurring')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
          Despesa recorrente
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {expense ? 'Atualizar' : 'Adicionar'} Despesa
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;