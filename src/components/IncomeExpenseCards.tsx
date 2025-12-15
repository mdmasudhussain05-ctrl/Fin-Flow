"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp, TrendingDown } from "lucide-react";

const IncomeExpenseCards = () => {
  const { getMonthlyIncome, getMonthlyExpenses, baseCurrency } = useFinance();
  const income = getMonthlyIncome();
  const expenses = getMonthlyExpenses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="glass-effect border-green-200 bg-green-50/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <TrendingUp className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {baseCurrency} {income.toFixed(2)}
          </div>
          <p className="text-xs text-green-600">This month</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-red-200 bg-red-50/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          <TrendingDown className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {baseCurrency} {expenses.toFixed(2)}
          </div>
          <p className="text-xs text-red-600">This month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeExpenseCards;