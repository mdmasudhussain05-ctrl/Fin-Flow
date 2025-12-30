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
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccounting } from "@/context/AccountingContext";
import { Ledger, AccountGroup } from "@/types/accounting";
import { Plus, Edit, Trash2, Save, X, BookText, Banknote, Wallet, Landmark, PiggyBank } from "lucide-react";

const getAccountGroupIcon = (groupType: AccountGroup['type']) => {
  switch (groupType) {
    case "asset": return Wallet;
    case "liability": return Banknote;
    case "equity": return PiggyBank;
    case "income": return Landmark; // Using Landmark for income as a placeholder
    case "expense": return BookText; // Using BookText for expense as a placeholder
    default: return Banknote;
  }
};

export function LedgerManagement() {
  const {
    ledgers,
    accountGroups,
    addLedger,
    updateLedger,
    deleteLedger,
    baseCurrency,
    exchangeRates,
  } = useAccounting();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLedger, setNewLedger] = useState<Omit<Ledger, "id" | "profileId">>({
    name: "",
    accountGroupId: accountGroups.length > 0 ? accountGroups[0].id : "",
    initialBalance: 0,
    currency: baseCurrency,
  });
  const [editLedger, setEditLedger] = useState<Omit<Ledger, "id" | "profileId">>({
    name: "",
    accountGroupId: "",
    initialBalance: 0,
    currency: "",
  });

  const currencyOptions = Object.keys(exchangeRates).map((currencyCode) => ({
    value: currencyCode,
    label: currencyCode,
  }));

  const handleAddLedger = () => {
    if (newLedger.name.trim() && newLedger.accountGroupId) {
      addLedger(newLedger);
      setNewLedger({
        name: "",
        accountGroupId: accountGroups.length > 0 ? accountGroups[0].id : "",
        initialBalance: 0,
        currency: baseCurrency,
      });
      setIsAdding(false);
    }
  };

  const handleUpdateLedger = (id: string) => {
    if (editLedger.name.trim() && editLedger.accountGroupId) {
      updateLedger(id, editLedger);
      setEditingId(null);
    }
  };

  const startEditing = (ledger: Ledger) => {
    setEditingId(ledger.id);
    setEditLedger({
      name: ledger.name,
      accountGroupId: ledger.accountGroupId,
      initialBalance: ledger.initialBalance,
      currency: ledger.currency,
    });
  };

  const getAccountGroupName = (accountGroupId: string) => {
    return accountGroups.find((group) => group.id === accountGroupId)?.name || "N/A";
  };

  const getAccountGroupType = (accountGroupId: string) => {
    return accountGroups.find((group) => group.id === accountGroupId)?.type || "asset";
  };

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ledger Accounts</CardTitle>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              Add Ledger
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Ledger</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ledgerName">Ledger Name</Label>
                <Input
                  id="ledgerName"
                  value={newLedger.name}
                  onChange={(e) => setNewLedger({ ...newLedger, name: e.target.value })}
                  placeholder="e.g., Cash, Sales, Rent Expense"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="accountGroup">Account Group</Label>
                <Select
                  value={newLedger.accountGroupId}
                  onValueChange={(value) => setNewLedger({ ...newLedger, accountGroupId: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select account group" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center">
                          {React.createElement(getAccountGroupIcon(group.type), { className: "h-4 w-4 mr-2" })}
                          {group.name}
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
                  value={newLedger.initialBalance || ""}
                  onChange={(e) =>
                    setNewLedger({ ...newLedger, initialBalance: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newLedger.currency}
                  onValueChange={(value) => setNewLedger({ ...newLedger, currency: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select currency" />
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
              <Button onClick={handleAddLedger}>Add Ledger</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {ledgers.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <BookText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No ledgers added yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Add your financial ledgers to start bookkeeping</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ledgers.map((ledger) => (
              <div
                key={ledger.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {editingId === ledger.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
                    <Input
                      value={editLedger.name}
                      onChange={(e) => setEditLedger({ ...editLedger, name: e.target.value })}
                      placeholder="Ledger name"
                    />
                    <Select
                      value={editLedger.accountGroupId}
                      onValueChange={(value) => setEditLedger({ ...editLedger, accountGroupId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accountGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className="flex items-center">
                              {React.createElement(getAccountGroupIcon(group.type), { className: "h-4 w-4 mr-2" })}
                              {group.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={editLedger.initialBalance || ""}
                      onChange={(e) =>
                        setEditLedger({ ...editLedger, initialBalance: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Balance"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateLedger(ledger.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        {React.createElement(getAccountGroupIcon(getAccountGroupType(ledger.accountGroupId)), { className: "h-5 w-5 text-gray-600 dark:text-gray-400" })}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{ledger.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getAccountGroupName(ledger.accountGroupId)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {ledger.currency} {ledger.initialBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Initial Balance</span>
                      </div>

                      <div className="flex space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => startEditing(ledger)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => deleteLedger(ledger.id)}
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