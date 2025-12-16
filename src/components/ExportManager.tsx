"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
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
    
    // In a real app, this would generate an actual Excel file
    // For now, we'll simulate the process
    setTimeout(() => {
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
      link.setAttribute("download", `finflow-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1000);
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    // In a real app, this would generate an actual PDF
    // For now, we'll simulate the process
    setTimeout(() => {
      // Create a simple text report
      const report = `
FinFlow Financial Report
Generated on: ${format(new Date(), "PPP")}
Profile: ${currentProfile?.name || "Unknown"}

Transactions:
${transactions.map(t => 
  `${t.date} - ${t.description} - ${t.type}: ${t.currency} ${t.amount.toFixed(2)}`
).join("\n")}

Bills:
${bills.map(b => 
  `${b.name} - Due: ${b.dueDate} - Amount: ${b.currency} ${b.amount.toFixed(2)} - ${b.isPaid ? "Paid" : "Unpaid"}`
).join("\n")}
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
    }, 1000);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={exportToExcel} 
          disabled={isExporting}
          className="flex-1"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
        <Button 
          onClick={exportToPDF} 
          disabled={isExporting}
          variant="secondary"
          className="flex-1"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export to PDF
        </Button>
      </CardContent>
    </Card>
  );
}