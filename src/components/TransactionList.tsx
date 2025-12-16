"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/context/FinanceContext";
import { Plus, Edit, Trash2, Receipt, ImageIcon } from "lucide-react"; // Import ImageIcon
import * as LucideIcons from "lucide-react"; // Import all Lucide icons
import TransactionForm from "@/components/TransactionForm";
import { format } from "date-fns";

const TransactionList = () => {
  const { transactions, categories, accounts, deleteTransaction, baseCurrency, convertAmount } = useFinance();
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

  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className={className} /> : <ImageIcon className={className} />;
  };

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
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Receipt className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No transactions yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTransactions.slice(0, 5).map((transaction) => {
              const category = categories.find(c => c.id === transaction.category);
              const account = accounts.find(a => a.id === transaction.accountId);
              const convertedAmount = convertAmount(
                transaction.amount,
                transaction.currency,
                baseCurrency
              );
              
              return (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {category ? (
                      <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}>
                        {renderIcon(category.icon, "h-5 w-5 text-white")}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')} • {category?.name || 'Uncategorized'} • {account?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <p>
                        {transaction.type === 'income' ? '+' : '-'} 
                        {baseCurrency} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      {transaction.currency !== baseCurrency && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.currency} {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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