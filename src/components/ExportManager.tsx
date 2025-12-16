"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, FileBarChart } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useProfile } from "@/context/ProfileContext";
import { format } from "date-fns";

export function ExportManager() {
  const { transactions, bills, categories, baseCurrency } = useFinance();
  const { profiles, currentProfileId } = useProfile();
  const [isExporting, setIsExporting] = useState(false);

  const currentProfile = profiles.find(p => p.id === currentProfileId);

  const exportToExcel = () => {
    setIsExporting(true);
    
    const data = transactions.map(t => ({
      Date: t.date,
      Description: t.description,
      Category: categories.find(c => c.id === t.category)?.name || "Uncategorized",
      Type: t.type,
      Amount: `${t.currency} ${t.amount.toFixed(2)}`,
      ConvertedAmount: `${baseCurrency} ${(
        t.amount * (t.currency === baseCurrency ? 1 : 1) // Simplified conversion
      ).toFixed(2)}`
    }));
    
    // Create CSV content
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `finflow-transactions-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    // Create a simple text report
    const report = `
FinFlow Financial Report
Generated on: ${format(new Date(), "PPP")}
Profile: ${currentProfile?.name || "Unknown"}
Base Currency: ${baseCurrency}

--- Transactions ---
${transactions.length > 0 ? transactions.map(t => {
  const categoryName = categories.find(c => c.id === t.category)?.name || "Uncategorized";
  return `${format(new Date(t.date), 'yyyy-MM-dd')} | ${t.description.padEnd(30).substring(0, 30)} | ${t.type.padEnd(7)} | ${categoryName.padEnd(15)} | ${t.currency} ${t.amount.toFixed(2)}`;
}).join("\n") : "No transactions recorded."}

--- Recurring Bills ---
${bills.length > 0 ? bills.map(b => 
  `${format(new Date(b.dueDate), 'yyyy-MM-dd')} | ${b.name.padEnd(30).substring(0, 30)} | ${b.currency} ${b.amount.toFixed(2)} | ${b.isPaid ? "Paid" : "Unpaid"}`
).join("\n") : "No recurring bills recorded."}
    `.trim();
    
    // Create download link
    const blob = new Blob([report], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `finflow-report-${format(new Date(), "yyyy-MM-dd")}.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={exportToExcel} 
            disabled={isExporting}
            className="flex-1"
          >
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Export to Excel (CSV)
          </Button>
          <Button 
            onClick={exportToPDF} 
            disabled={isExporting}
            variant="secondary"
            className="flex-1"
          >
            <FileText className="h-5 w-5 mr-2" />
            Export to PDF (Text)
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Export Options</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li className="flex items-center">
              <FileBarChart className="h-4 w-4 mr-2 text-teal-500" />
              Exports transactions and bills data.
            </li>
            <li className="flex items-center">
              <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-500" />
              CSV format is compatible with Excel and other spreadsheet software.
            </li>
            <li className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-red-500" />
              PDF export provides a simple text-based summary.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}