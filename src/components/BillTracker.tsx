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
import { useAccounting } from "@/context/AccountingContext"; // Updated import
import { Bill } from "@/context/AccountingContext"; // Updated import
import { Plus, Edit, Trash2, Save, X, Calendar, Bell } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const BillTracker = () => {
  const { bills, addBill, updateBill, deleteBill, baseCurrency } = useAccounting(); // Updated hook
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBill, setNewBill] = useState({
    name: "",
    amount: 0,
    dueDate: "",
    isPaid: false,
    currency: "USD"
  });
  const [editBill, setEditBill] = useState({
    name: "",
    amount: 0,
    dueDate: "",
    isPaid: false,
    currency: "USD"
  });

  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
  ];

  const handleAddBill = () => {
    if (newBill.name && newBill.amount > 0 && newBill.dueDate) {
      addBill(newBill);
      setNewBill({
        name: "",
        amount: 0,
        dueDate: "",
        isPaid: false,
        currency: "USD"
      });
      setIsAdding(false);
    }
  };

  const handleUpdateBill = (id: string) => {
    updateBill(id, editBill);
    setEditingId(null);
  };

  const startEditing = (bill: Bill) => {
    setEditingId(bill.id);
    setEditBill({
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      isPaid: bill.isPaid,
      currency: bill.currency
    });
  };

  const togglePaidStatus = (id: string, isPaid: boolean) => {
    updateBill(id, { isPaid });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return differenceInDays(due, today);
  };

  const getStatusColor = (days: number, isPaid: boolean) => {
    if (isPaid) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (days < 0) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (days <= 3) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  };

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recurring Bills</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 p-4 border border-dashed rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billName">Bill Name</Label>
                <Input
                  id="billName"
                  value={newBill.name}
                  onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                  placeholder="e.g., Rent, Netflix"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="billAmount">Amount</Label>
                <Input
                  id="billAmount"
                  type="number"
                  value={newBill.amount || ""}
                  onChange={(e) => setNewBill({...newBill, amount: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="billDate">Due Date</Label>
                <Input
                  id="billDate"
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="billCurrency">Currency</Label>
                <Select value={newBill.currency} onValueChange={(value) => setNewBill({...newBill, currency: value})}>
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
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={handleAddBill}>
                <Save className="h-4 w-4 mr-1" />
                Save Bill
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {bills.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No bills added yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Add your recurring bills to track them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => {
              const daysUntilDue = getDaysUntilDue(bill.dueDate);
              const statusColor = getStatusColor(daysUntilDue, bill.isPaid);
              
              return (
                <div 
                  key={bill.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {editingId === bill.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
                      <Input
                        value={editBill.name}
                        onChange={(e) => setEditBill({...editBill, name: e.target.value})}
                        placeholder="Bill name"
                      />
                      <Input
                        type="number"
                        value={editBill.amount || ""}
                        onChange={(e) => setEditBill({...editBill, amount: parseFloat(e.target.value) || 0})}
                        placeholder="Amount"
                      />
                      <Input
                        type="date"
                        value={editBill.dueDate}
                        onChange={(e) => setEditBill({...editBill, dueDate: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateBill(bill.id)}
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
                          <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{bill.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Due: {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {bill.currency} {bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                            {bill.isPaid 
                              ? "Paid" 
                              : daysUntilDue < 0 
                                ? `${Math.abs(daysUntilDue)} days overdue` 
                                : `${daysUntilDue} days left`}
                          </span>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant={bill.isPaid ? "default" : "outline"}
                            onClick={() => togglePaidStatus(bill.id, !bill.isPaid)}
                          >
                            {bill.isPaid ? "Paid" : "Mark Paid"}
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => startEditing(bill)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => deleteBill(bill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillTracker;