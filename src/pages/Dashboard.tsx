"use client";

import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import BalanceCard from "@/components/BalanceCard";
import IncomeExpenseCards from "@/components/IncomeExpenseCards";
import TransactionList from "@/components/TransactionList";
import CategoryManager from "@/components/CategoryManager";
import BillTracker from "@/components/BillTracker";
import ExpenseChart from "@/components/ExpenseChart";
import IncomeExpenseChart from "@/components/IncomeExpenseChart";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <BalanceCard />
            <IncomeExpenseCards />
            <TransactionList />
          </div>
          
          <div className="space-y-6">
            <ExpenseChart />
            <IncomeExpenseChart />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CategoryManager />
          <BillTracker />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;