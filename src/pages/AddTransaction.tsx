"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAccounting } from "@/context/AccountingContext"; // Updated import
import { TransactionType } from "@/types/accounting"; // Updated import
import { Plus, Wallet, Calendar, FileText, Tag, DollarSign, Banknote, ImageIcon } from "lucide-react";
import *as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AddTransaction = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { categories, ledgers: accounts, addTransaction, baseCurrency, exchangeRates } = useAccounting(); // Updated hook and aliased ledgers to accounts
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState(baseCurrency);
  const [accountId, setAccountId] = useState(accounts.length > 0 ? accounts[0].id : "");

  const currencyOptions = Object.keys(exchangeRates).map(currencyCode => ({
    value: currencyCode,
    label: currencyCode,
  }));

  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className={className} /> : <ImageIcon className={className} />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !date || !description || !category || !currency || !accountId) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const transactionData = {
      amount: parseFloat(amount),
      date,
      description,
      type,
      category,
      currency,
      accountId,
    };

    addTransaction(transactionData);
    
    toast({
      title: "Success",
      description: "Transaction added successfully!",
    });
    
    // Reset form
    setAmount("");
    setDate(new Date().toISOString().split('T')[0]);
    setDescription("");
    setType("expense");
    setCategory("");
    setCurrency(baseCurrency);
    setAccountId(accounts.length > 0 ? accounts[0].id : "");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Transaction</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a new financial transaction
          </p>
        </div>
        <Button onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>
      </div>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-teal-500" />
            New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="amount" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-teal-500" />
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="date" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-teal-500" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-teal-500" />
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="type" className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-teal-500" />
                  Type
                </Label>
                <Select value={type} onValueChange={(value: TransactionType) => setType(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="currency" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-teal-500" />
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label.split(" - ")[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="account" className="flex items-center">
                  <Banknote className="h-4 w-4 mr-2 text-teal-500" />
                  Account
                </Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="category" className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-teal-500" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center">
                        {renderIcon(cat.icon, `w-3 h-3 rounded-full ${cat.color} mr-2 text-white`)}
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="px-8">
                Add Transaction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTransaction;