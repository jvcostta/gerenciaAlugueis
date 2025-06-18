import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { Payment } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface PaymentFormProps {
  payment?: Payment;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: payment || {
      contractId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      lateFee: 0,
      paymentMethod: '',
      notes: ''
    }
  });
  
  const { addPayment, updatePayment, contracts } = useAppContext();
  
  const onSubmit = (data: any) => {
    const paymentData = {
      ...data,
      date: new Date(data.date),
      dueDate: new Date(data.dueDate),
      amount: Number(data.amount),
      lateFee: Number(data.lateFee)
    };
    
    if (payment) {
      updatePayment({ ...payment, ...paymentData });
    } else {
      addPayment(paymentData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Contrato</label>
        <select
          {...register('contractId', { required: 'Contrato é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Selecione um contrato</option>
          {contracts.map(contract => (
            <option key={contract.id} value={contract.id}>
              Contrato #{contract.id}
            </option>
          ))}
        </select>
        {errors.contractId && (
          <p className="mt-1 text-sm text-red-600">{errors.contractId.message}</p>
        )}
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
        <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
        <input
          type="date"
          {...register('dueDate', { required: 'Data de vencimento é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Data do Pagamento</label>
        <input
          type="date"
          {...register('date')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
          <option value="overdue">Em Atraso</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Multa (R$)</label>
        <input
          type="number"
          step="0.01"
          {...register('lateFee', { min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="0,00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
        <select
          {...register('paymentMethod')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Selecione a forma de pagamento</option>
          <option value="bank transfer">Transferência Bancária</option>
          <option value="credit card">Cartão de Crédito</option>
          <option value="cash">Dinheiro</option>
          <option value="pix">PIX</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Observações adicionais..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {payment ? 'Atualizar' : 'Registrar'} Pagamento
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;