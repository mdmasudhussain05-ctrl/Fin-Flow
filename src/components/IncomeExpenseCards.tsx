"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounting } from "@/context/AccountingContext"; // Updated import
import { TrendingUp, TrendingDown } from "lucide-react";

const IncomeExpenseCards = () => {
  const { getMonthlyIncome, getMonthlyExpenses, baseCurrency } = useAccounting(); // Updated hook
  const income = getMonthlyIncome();
  const expenses = getMonthlyExpenses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {baseCurrency} {income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">This month</p>
          <div className="mt-3 flex items-center text-xs text-green-600 dark:text-green-400">
            <span className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              12.5% from last month
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">
            {baseCurrency} {expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">This month</p>
          <div className="mt-3 flex items-center text-xs text-red-600 dark:text-red-400">
            <span className="flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              3.2% from last month
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeExpenseCards;