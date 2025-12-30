"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Menu, 
  Home, 
  BarChart3, 
  CreditCard, 
  User, 
  Settings, 
  Download,
  Scale,
  Banknote, 
  DollarSign,
  PlusCircle,
  BookText, // For Ledger Management
  ReceiptText, // For Voucher Entry
  Package, // For Inventory
  Landmark, // For Banking
  FileStack // For GST Compliance
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import BalanceCard from "@/components/BalanceCard"; // Will be refactored
import IncomeExpenseCards from "@/components/IncomeExpenseCards"; // Will be refactored
import TransactionList from "@/components/TransactionList"; // Will be refactored
import CategoryManager from "@/components/CategoryManager"; // Will be refactored
import BillTracker from "@/components/BillTracker"; // Will be refactored
import ExpenseChart from "@/components/ExpenseChart"; // Will be refactored
import IncomeExpenseChart from "@/components/IncomeExpenseChart"; // Will be refactored
import { CardManager } from "@/components/CardManager"; // Will be refactored
import { ExportManager } from "@/components/ExportManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileSelector } from "@/components/ProfileSelector";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { useAccounting } from "@/context/AccountingContext"; // Changed from useFinance
import { Card } from "@/components/ui/card";
import FinancialStatements from "@/components/FinancialStatements"; // Will be refactored
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AccountManager } from "@/components/AccountManager"; // Will be refactored
import CurrencyConverter from "@/pages/CurrencyConverter"; 
import AddTransaction from "@/pages/AddTransaction"; // Will be refactored
import { LedgerManagement } from "@/components/LedgerManagement"; // Import LedgerManagement

// Placeholder components for new modules
const VoucherEntry = () => <div className="p-6 text-center text-gray-500 dark:text-gray-400">Voucher Entry Module (Coming Soon)</div>;
const InventoryManagement = () => <div className="p-6 text-center text-gray-500 dark:text-gray-400">Inventory Management Module (Coming Soon)</div>;
const Invoicing = () => <div className="p-6 text-center text-gray-500 dark:text-gray-400">Invoicing & Automation Module (Coming Soon)</div>;
const BankingReconciliation = () => <div className="p-6 text-center text-gray-500 dark:text-gray-400">Banking & Reconciliation Module (Coming Soon)</div>;
const GSTCompliance = () => <div className="p-6 text-center text-gray-500 dark:text-gray-400">GST & Statutory Compliance Module (Coming Soon)</div>;
const AdminControls = () => <div className="p-6 text-center text-gray-500 dark:text-gray-400">Administrative Controls Module (Coming Soon)</div>;


const Dashboard = () => {
  const { theme, setTheme, fontFamily, setFontFamily } = useTheme(); 
  const { profiles, currentProfileId } = useProfile();
  const { baseCurrency, setBaseCurrency, exchangeRates } = useAccounting(); // Changed from useFinance
  const [activeSection, setActiveSection] = useState("dashboard");
  
  const currentProfile = profiles.find(p => p.id === currentProfileId);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "ledger-management", label: "Ledger Management", icon: BookText },
    { id: "voucher-entry", label: "Voucher Entry", icon: ReceiptText },
    { id: "inventory-management", label: "Inventory Management", icon: Package },
    { id: "invoicing", label: "Invoicing", icon: ReceiptText }, // Changed from FileInvoice
    { id: "banking-reconciliation", label: "Banking & Reconciliation", icon: Landmark },
    { id: "gst-compliance", label: "GST & Compliance", icon: FileStack },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "financial-statements", label: "Financial Statements", icon: Scale },
    { id: "currency-converter", label: "Currency Converter", icon: DollarSign }, 
    { id: "profile", label: "Profile", icon: User },
    { id: "admin-controls", label: "Admin Controls", icon: Settings },
    { id: "export", label: "Export", icon: Download },
  ];

  const currencyOptions = Object.keys(exchangeRates).map(currencyCode => ({
    value: currencyCode,
    label: currencyCode,
  }));

  const fontOptions = [
    { value: "System Default", label: "System Default" },
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Lato", label: "Lato" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Times New Roman", label: "Times New Roman" }, 
  ];

  const themeOptions = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "cream", label: "Cream" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 space-y-6">
                <BalanceCard /> {/* Will be refactored */}
                <IncomeExpenseCards /> {/* Will be refactored */}
                <TransactionList /> {/* Will be refactored */}
              </div>
              
              <div className="space-y-6">
                <ExpenseChart /> {/* Will be refactored */}
                <IncomeExpenseChart /> {/* Will be refactored */}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CategoryManager /> {/* Will be refactored */}
              <BillTracker /> {/* Will be refactored */}
            </div>
          </>
        );
      case "ledger-management":
        return <LedgerManagement />;
      case "voucher-entry":
        return <VoucherEntry />;
      case "inventory-management":
        return <InventoryManagement />;
      case "invoicing":
        return <Invoicing />;
      case "banking-reconciliation":
        return <BankingReconciliation />;
      case "gst-compliance":
        return <GSTCompliance />;
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseChart /> {/* Will be refactored */}
              <IncomeExpenseChart /> {/* Will be refactored */}
            </div>
            <CategoryManager /> {/* Will be refactored */}
          </div>
        );
      case "financial-statements":
        return <FinancialStatements />; // Will be refactored
      case "currency-converter": 
        return <CurrencyConverter />;
      case "cards":
        return <CardManager />; // Will be refactored
      case "accounts":
        return <AccountManager />; // Will be refactored
      case "profile":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-effect">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{currentProfile?.name || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{currentProfile?.email || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile ID</label>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{currentProfileId}</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="glass-effect">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customize appearance</p>
                    </div>
                    <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Base Currency</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Set your primary currency</p>
                    </div>
                    <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                      <SelectTrigger className="w-[120px]">
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">App Font</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Change the application font</p>
                    </div>
                    <Select value={fontFamily} onValueChange={(value) => setFontFamily(value as any)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Data Sync</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sync across devices</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      case "admin-controls":
        return <AdminControls />;
      case "export":
        return <ExportManager />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">
              <BalanceCard />
              <IncomeExpenseCards />
              <TransactionList />
            </div>
            
            <div className="space-y-6">
              <ExpenseChart />
              <IncomeExpenseChart />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-0 md:p-4">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    FinFlow
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveSection(item.id)}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">FinFlow</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme selection for mobile */}
            <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
              <SelectTrigger className="w-[100px] h-9">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProfileSelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 rounded-l-2xl p-4 h-[calc(100vh-2rem)] sticky top-4">
          <div className="flex items-center mb-8">
            <h1 className="text-xl font-bold ml-3">FinFlow</h1>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
          
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
              {/* Theme selection for desktop sidebar */}
              <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-0 md:pr-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back, {currentProfile?.name || "User"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ProfileSelector />
              </div>
            </div>
            
            <div className="p-4 md:p-6 overflow-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        Made by Md. Masud Hussain
      </div>
    </div>
  );
};

export default Dashboard;