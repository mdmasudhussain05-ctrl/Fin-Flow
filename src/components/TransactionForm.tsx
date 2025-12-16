"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { useFinance } from "@/context/FinanceContext";
import { Transaction, TransactionType } from "@/context/FinanceContext";
import { X, Wallet, Calendar, FileText, Tag, DollarSign } from "lucide-react";

interface TransactionFormProps {
  transaction?: Transaction;
  onClose: () => void;
  onSubmit: () => void;
}

const TransactionForm = ({ transaction, onClose, onSubmit }: TransactionFormProps) => {
  const { categories, addTransaction, updateTransaction } = useFinance();
  const [amount, setAmount] = useState(transaction?.amount?.toString() || "");
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(transaction?.description || "");
  const [type, setType] = useState<TransactionType>(transaction?.type || "expense");
  const [category, setCategory] = useState(transaction?.category || "");
  const [currency, setCurrency] = useState(transaction?.currency || "USD");

  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !date || !description || !category || !currency) {
      alert("Please fill all fields");
      return;
    }

    const transactionData = {
      amount: parseFloat(amount),
      date,
      description,
      type,
      category,
      currency,
    };

    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onSubmit();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        <div className="mb-6">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {transaction ? "Update your transaction details" : "Add a new financial transaction"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="grid grid-cols-2 gap-4">
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
                      <span className={`w-3 h-3 rounded-full ${cat.color} mr-2`}></span>
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {transaction ? "Update" : "Add"} Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;