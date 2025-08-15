import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Settings, Users } from 'lucide-react';
import FeeCategories from './FeeManagement/FeeCategories';
import FeeStructures from './FeeManagement/FeeStructure';
import DiscountManagement from './FeeManagement/DiscountManagement';

const FeeStructure = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Fee Structure Management</h1>
            <p className="text-gray-600">Manage fee categories, structures, and discounts</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'categories', label: 'Fee Categories', icon: DollarSign },
              { id: 'structures', label: 'Fee Structures', icon: Settings },
              { id: 'discounts', label: 'Discounts & Concessions', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="inline mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'categories' && <FeeCategories />}
        {activeTab === 'structures' && <FeeStructures />}
        {activeTab === 'discounts' && <DiscountManagement />}
      </div>
    </div>
  );
};

export default FeeStructure;