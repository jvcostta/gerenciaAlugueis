import React from 'react';
import PropertyStats from '../components/dashboard/PropertyStats';
import RevenueChart from '../components/dashboard/RevenueChart';
import PropertyList from '../components/dashboard/PropertyList';
import PaymentReminders from '../components/dashboard/PaymentReminders';

const Dashboard: React.FC = () => {
  return (
    <div>
      <PropertyStats />
      
      <RevenueChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PropertyList />
        <PaymentReminders />
      </div>
    </div>
  );
};

export default Dashboard;