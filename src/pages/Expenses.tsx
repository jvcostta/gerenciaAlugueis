import React, { useState } from 'react';
import { PieChart, Plus, Search, Receipt, Building2, Calendar } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import ExpenseForm from '../components/forms/ExpenseForm';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Expense } from '../types';

const Expenses: React.FC = () => {
  const { expenses, properties } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  
  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const property = properties.find(p => p.id === expense.propertyId);
    const propertyName = property ? property.name : 'Propriedade desconhecida';
    
    const searchMatch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter;
    const propertyMatch = propertyFilter === 'all' || expense.propertyId === propertyFilter;
    
    return searchMatch && categoryMatch && propertyMatch;
  });
  
  // Sort expenses: newest first
  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAddEdit = (expense?: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      maintenance: 'Manutenção',
      utilities: 'Utilidades',
      taxes: 'Impostos',
      insurance: 'Seguro',
      other: 'Outros'
    };
    return categories[category] || category;
  };

  const getCategoryBadge = (category: string) => {
    let variant: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    
    switch (category) {
      case 'maintenance':
        variant = 'warning';
        break;
      case 'utilities':
        variant = 'info';
        break;
      case 'taxes':
        variant = 'danger';
        break;
      case 'insurance':
        variant = 'success';
        break;
      default:
        variant = 'primary';
    }
    
    return <Badge variant={variant}>{getCategoryLabel(category)}</Badge>;
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Propriedade desconhecida';
  };

  const totalExpenses = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Despesas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie despesas das propriedades
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 sm:mt-0"
          icon={<Plus className="h-5 w-5" />}
          onClick={() => handleAddEdit()}
        >
          Adicionar Despesa
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Despesas</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalExpenses.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{sortedExpenses.length} despesa{sortedExpenses.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar despesas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas as Categorias</option>
                <option value="maintenance">Manutenção</option>
                <option value="utilities">Utilidades</option>
                <option value="taxes">Impostos</option>
                <option value="insurance">Seguro</option>
                <option value="other">Outros</option>
              </select>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
              >
                <option value="all">Todas as Propriedades</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
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
                Descrição
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propriedade
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comprovante
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                  {expense.recurring && (
                    <div className="text-xs text-blue-600">Recorrente</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Building2 className="h-4 w-4 text-gray-400  mr-1" />
                    {getPropertyName(expense.propertyId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCategoryBadge(expense.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    R$ {expense.amount.toLocaleString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    {format(new Date(expense.date), 'PP', { locale: ptBR })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {expense.receipt ? (
                    <Button variant="ghost" size="sm">
                      <Receipt className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  ) : (
                    <span className="text-sm text-gray-500">Sem comprovante</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleAddEdit(expense)}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedExpenses.length === 0 && (
          <div className="text-center py-12">
            <PieChart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma despesa encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros de busca ou adicione uma nova despesa.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                icon={<Plus className="h-5 w-5" />}
                onClick={() => handleAddEdit()}
              >
                Adicionar Despesa
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(undefined);
        }}
        title={selectedExpense ? 'Editar Despesa' : 'Adicionar Despesa'}
      >
        <ExpenseForm
          expense={selectedExpense}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExpense(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default Expenses;