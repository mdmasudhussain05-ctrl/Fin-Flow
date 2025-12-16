"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinance } from "@/context/FinanceContext";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isAfter, subMonths, subYears, isSameMonth, isSameYear } from "date-fns";
import { CalendarIcon, FileText, Scale, Book, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const FinancialStatements = () => {
  const { 
    getJournalEntries, 
    getLedgerAccounts, 
    getProfitLossAccount, 
    getBalanceSheet,
    baseCurrency,
    convertAmount,
    categories
  } = useFinance();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(subMonths(today, 1)); // Default to last month
  const [reportType, setReportType] = useState<"monthly" | "yearly">("monthly");

  const getPeriodDates = (date: Date, type: "monthly" | "yearly") => {
    if (type === "monthly") {
      return {
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
        periodLabel: format(date, "MMMM yyyy")
      };
    } else {
      return {
        startDate: startOfYear(date),
        endDate: endOfYear(date),
        periodLabel: format(date, "yyyy")
      };
    }
  };

  const { startDate, endDate, periodLabel } = getPeriodDates(selectedDate, reportType);

  // Logic for "after a month and every year"
  const isPeriodAvailable = (periodEndDate: Date, type: "monthly" | "yearly") => {
    const now = new Date();
    if (type === "monthly") {
      // Monthly statements are available if the period end date is before the start of the current month
      return isAfter(startOfMonth(now), periodEndDate);
    } else { // yearly
      // Yearly statements are available if the period end date is before the start of the current year
      return isAfter(startOfYear(now), periodEndDate);
    }
  };

  const available = isPeriodAvailable(endDate, reportType);

  const journalEntries = available ? getJournalEntries(startDate, endDate) : [];
  const ledgerAccounts = available ? getLedgerAccounts(startDate, endDate) : {};
  const profitLossAccount = available ? getProfitLossAccount(startDate, endDate) : null;
  const balanceSheet = available ? getBalanceSheet(endDate) : null;

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || "Uncategorized";
  };

  const renderNotAvailableMessage = () => (
    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
      <h3 className="text-xl font-semibold mb-2">Statements Not Yet Available</h3>
      <p>Financial statements for {periodLabel} will be available after the period has fully closed.</p>
      <p>Please select a past complete {reportType === "monthly" ? "month" : "year"}.</p>
    </div>
  );

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Financial Statements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button 
              variant={reportType === "monthly" ? "default" : "outline"}
              onClick={() => setReportType("monthly")}
            >
              Monthly Report
            </Button>
            <Button 
              variant={reportType === "yearly" ? "default" : "outline"}
              onClick={() => setReportType("yearly")}
            >
              Yearly Report
            </Button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, reportType === "monthly" ? "MMM yyyy" : "yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={2000}
                toYear={today.getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {!available ? (
          renderNotAvailableMessage()
        ) : (
          <Tabs defaultValue="profit-loss" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profit-loss">P&L Account</TabsTrigger>
              <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
              <TabsTrigger value="journal-entries">Journal Entries</TabsTrigger>
              <TabsTrigger value="ledger-accounts">Ledger Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="profit-loss" className="mt-4">
              <h3 className="text-xl font-bold mb-4">Profit & Loss Account ({profitLossAccount?.period})</h3>
              {profitLossAccount ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Income</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-green-600">{baseCurrency} {profitLossAccount.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <ul className="mt-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {profitLossAccount.incomeBreakdown.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.category}</span>
                              <span>{baseCurrency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Expenses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-red-600">{baseCurrency} {profitLossAccount.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <ul className="mt-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {profitLossAccount.expenseBreakdown.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.category}</span>
                              <span>{baseCurrency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Net Profit/Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-3xl font-bold ${profitLossAccount.netProfitLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {baseCurrency} {profitLossAccount.netProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No data available for this period.</p>
              )}
            </TabsContent>

            <TabsContent value="balance-sheet" className="mt-4">
              <h3 className="text-xl font-bold mb-4">Balance Sheet as of {balanceSheet?.date}</h3>
              {balanceSheet ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">{baseCurrency} {balanceSheet.totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <ul className="mt-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {balanceSheet.assets.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>{baseCurrency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Liabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">{baseCurrency} {balanceSheet.totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <ul className="mt-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {balanceSheet.liabilities.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>{baseCurrency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Equity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-purple-600">
                        {baseCurrency} {balanceSheet.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No data available for this period.</p>
              )}
            </TabsContent>

            <TabsContent value="journal-entries" className="mt-4">
              <h3 className="text-xl font-bold mb-4">Journal Entries ({periodLabel})</h3>
              {journalEntries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Account (Debit)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Account (Credit)</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount ({baseCurrency})</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {journalEntries.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{format(new Date(entry.date), 'MMM dd, yyyy')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{entry.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{entry.debitAccount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{entry.creditAccount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-200">{entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No journal entries for this period.</p>
              )}
            </TabsContent>

            <TabsContent value="ledger-accounts" className="mt-4">
              <h3 className="text-xl font-bold mb-4">Ledger Accounts ({periodLabel})</h3>
              {Object.keys(ledgerAccounts).length > 0 ? (
                <div className="space-y-6">
                  {Object.values(ledgerAccounts).map((account) => (
                    <Card key={account.name}>
                      <CardHeader>
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount ({baseCurrency})</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Balance ({baseCurrency})</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {account.entries.map((entry, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{format(new Date(entry.date), 'MMM dd, yyyy')}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{entry.description}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 capitalize">{entry.type}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-200">{entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-200">{entry.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={4} className="px-6 py-3 text-right text-sm font-bold text-gray-900 dark:text-gray-200">Final Balance:</td>
                                <td className="px-6 py-3 text-right text-sm font-bold text-gray-900 dark:text-gray-200">{baseCurrency} {account.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No ledger accounts for this period.</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialStatements;