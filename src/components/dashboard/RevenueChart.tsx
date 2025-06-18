import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { useAppContext } from '../../context/AppContext';
import { format, startOfMonth, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart: React.FC = () => {
  const { monthlyFinancials, properties } = useAppContext();
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6months');

  const getFilteredData = () => {
    let data = monthlyFinancials;
    
    // Filter by period
    if (selectedPeriod === '3months') {
      data = data.slice(-3);
    } else if (selectedPeriod === '12months') {
      // Generate 12 months of data
      const last12Months = [];
      const today = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const monthDate = startOfMonth(addMonths(today, -i));
        const monthStr = format(monthDate, 'MMM yyyy', { locale: ptBR });
        
        const existingData = monthlyFinancials.find(m => m.month === monthStr);
        if (existingData) {
          last12Months.push(existingData);
        } else {
          last12Months.push({
            month: monthStr,
            income: 0,
            expenses: 0,
            netIncome: 0
          });
        }
      }
      data = last12Months;
    }
    
    return data;
  };

  const filteredData = getFilteredData();

  const chartData = {
    labels: filteredData.map(item => item.month),
    datasets: [
      {
        label: 'Receita',
        data: filteredData.map(item => item.income),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Despesas',
        data: filteredData.map(item => item.expenses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Receita Líquida',
        data: filteredData.map(item => item.netIncome),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader 
        title="Visão Financeira" 
        subtitle="Receitas vs. Despesas"
        action={
          <div className="flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="3months">Últimos 3 meses</option>
              <option value="6months">Últimos 6 meses</option>
              <option value="12months">Últimos 12 meses</option>
            </select>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="all">Todas as propriedades</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>
        }
      />
      <CardContent>
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;