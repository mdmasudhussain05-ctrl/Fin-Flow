"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/context/FinanceContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import { format } from "date-fns";

const TransactionList = () => {
  const { transactions, categories, deleteTransaction, baseCurrency, convertAmount } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setShowForm(true)}
          className="rounded-full"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTransactions.slice(0, 5).map((transaction) => {
              const category = categories.find(c => c.id === transaction.category);
              const convertedAmount = convertAmount(
                transaction.amount,
                transaction.currency,
                baseCurrency
              );
              
              return (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {category && (
                      <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      <p className="font-medium">
                        {transaction.type === 'income' ? '+' : '-'} 
                        {baseCurrency} {convertedAmount.toFixed(2)}
                      </p>
                      {transaction.currency !== baseCurrency && (
                        <p className="text-xs text-gray-500">
                          {transaction.currency} {transaction.amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      {showForm && (
        <TransactionForm 
          transaction={editingTransaction || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          onSubmit={() => {}}
        />
      )}
    </Card>
  );
};

export default TransactionList;