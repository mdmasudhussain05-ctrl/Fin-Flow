"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounting } from "@/context/AccountingContext"; // Updated import
import { Wallet } from "lucide-react";

const BalanceCard = () => {
  const { getTotalBalance, baseCurrency } = useAccounting(); // Updated hook
  const balance = getTotalBalance();

  return (
    <Card className="glass-effect overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
          <Wallet className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {baseCurrency} {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className={`text-sm mt-1 ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {balance >= 0 ? "Positive balance" : "Negative balance"}
        </p>
        <div className="mt-4">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full"
              style={{ width: `${Math.min(100, Math.abs(balance) / 1000 * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>$0</span>
            <span>Goal: $1000</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;