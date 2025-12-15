"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { Wallet } from "lucide-react";

const BalanceCard = () => {
  const { getTotalBalance, baseCurrency } = useFinance();
  const balance = getTotalBalance();

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        <Wallet className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {baseCurrency} {balance.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">
          {balance >= 0 ? "Positive balance" : "Negative balance"}
        </p>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;