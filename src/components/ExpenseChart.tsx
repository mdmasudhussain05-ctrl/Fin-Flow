"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp } from "lucide-react";

const ExpenseChart = () => {
  const { getExpensesByCategory } = useFinance();
  const expenseData = getExpensesByCategory();

  const COLORS = [
    "#ef4444", // red-500
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#f97316", // orange-500
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{`${payload[0].name}`}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{`$${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expenses by Category</CardTitle>
        <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
      </CardHeader>
      <CardContent className="h-80">
        {expenseData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No expense data</h3>
            <p className="text-gray-500 dark:text-gray-400">Add expenses to see the breakdown</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                content={(props) => {
                  const { payload } = props;
                  return (
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                      {payload?.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;