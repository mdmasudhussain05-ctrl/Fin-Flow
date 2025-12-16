"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { Account } from "@/context/FinanceContext";
import { Plus, Edit, Trash2, Save, X, Banknote, Wallet, CreditCard, Landmark, PiggyBank } from "lucide-react";

const accountTypeOptions = [
  { value: "cash", label: "Cash", icon: Wallet },
  { value: "bank", label: "Bank Account", icon: Landmark },
  { value: "credit_card", label: "Credit Card", icon: CreditCard },
  { value: "investment", label: "Investment", icon: PiggyBank },
  { value: "other", label: "Other", icon: Banknote },
];

export function AccountManager() {
  const { accounts, addAccount, updateAccount, deleteAccount, baseCurrency, exchangeRates } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Explicitly type newAccount to match Omit<Account, "id" | "profileId">
  const [newAccount, setNewAccount] = useState<Omit<Account, "id" | "profileId">>({
    name: "",
    type: "cash",
    initialBalance: 0,
    currency: baseCurrency,
  });

  // Explicitly type editAccount to match Omit<Account, "id" | "profileId">
  const [editAccount, setEditAccount] = useState<Omit<Account, "id" | "profileId">>({
    name: "",
    type: "cash", // Initial value, will be overwritten by startEditing
    initialBalance: 0,
    currency: baseCurrency,
  });

  const currencyOptions = Object.keys(exchangeRates).map(currencyCode => ({
    value: currencyCode,
    label: currencyCode,
  }));

  const handleAddAccount = () => {
    if (newAccount.name.trim()) {
      addAccount(newAccount);
      setNewAccount({
        name: "",
        type: "cash",
        initialBalance: 0,
        currency: baseCurrency,
      });
      setIsAdding(false);
    }
  };

  const handleUpdateAccount = (id: string) => {
    if (editAccount.name.trim()) {
      updateAccount(id, editAccount);
      setEditingId(null);
    }
  };

  const startEditing = (account: Account) => {
    setEditingId(account.id);
    setEditAccount({
      name: account.name,
      type: account.type,
      initialBalance: account.initialBalance,
      currency: account.currency,
    });
  };

  const getAccountIcon = (type: string) => {
    const option = accountTypeOptions.find(opt => opt.value === type);
    return option ? <option.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" /> : <Banknote className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
  };

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Accounts</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Account
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 p-4 border border-dashed rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  placeholder="e.g., Main Bank, Cash Wallet"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select 
                  value={newAccount.type} 
                  onValueChange={(value: "cash" | "bank" | "credit_card" | "investment" | "other") => setNewAccount({...newAccount, type: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <option.icon className="h-4 w-4 mr-2" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="initialBalance">Initial Balance</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  value={newAccount.initialBalance || ""}
                  onChange={(e) => setNewAccount({...newAccount, initialBalance: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="accountCurrency">Currency</Label>
                <Select value={newAccount.currency} onValueChange={(value) => setNewAccount({...newAccount, currency: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={handleAddAccount}>
                <Save className="h-4 w-4 mr-1" />
                Save Account
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Banknote className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No accounts added yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Add your financial accounts to track your money</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div 
                key={account.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {editingId === account.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
                    <Input
                      value={editAccount.name}
                      onChange={(e) => setEditAccount({...editAccount, name: e.target.value})}
                      placeholder="Account name"
                    />
                    <Select 
                      value={editAccount.type} 
                      onValueChange={(value: "cash" | "bank" | "credit_card" | "investment" | "other") => setEditAccount({...editAccount, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accountTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <option.icon className="h-4 w-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={editAccount.initialBalance || ""}
                      onChange={(e) => setEditAccount({...editAccount, initialBalance: parseFloat(e.target.value) || 0})}
                      placeholder="Balance"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateAccount(account.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{account.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{account.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {account.currency} {account.initialBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Initial Balance</span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => startEditing(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => deleteAccount(account.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}