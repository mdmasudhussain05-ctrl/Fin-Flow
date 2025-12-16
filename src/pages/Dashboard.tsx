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
  Sun,
  Moon,
  Wallet,
  PieChart,
  Calendar,
  FileBarChart
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import BalanceCard from "@/components/BalanceCard";
import IncomeExpenseCards from "@/components/IncomeExpenseCards";
import TransactionList from "@/components/TransactionList";
import CategoryManager from "@/components/CategoryManager";
import BillTracker from "@/components/BillTracker";
import ExpenseChart from "@/components/ExpenseChart";
import IncomeExpenseChart from "@/components/IncomeExpenseChart";
import { CardManager } from "@/components/CardManager";
import { ExportManager } from "@/components/ExportManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileSelector } from "@/components/ProfileSelector";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const { theme } = useTheme();
  const { profiles, currentProfileId } = useProfile();
  const [activeSection, setActiveSection] = useState("dashboard");
  
  const currentProfile = profiles.find(p => p.id === currentProfileId);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "cards", label: "Cards", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
    { id: "export", label: "Export", icon: Download },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CategoryManager />
              <BillTracker />
            </div>
          </>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseChart />
              <IncomeExpenseChart />
            </div>
            <CategoryManager />
          </div>
        );
      case "cards":
        return <CardManager />;
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
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current theme mode</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-900 dark:text-white">
                      {theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}
                    </span>
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
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-8 h-8 rounded-lg flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
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
            <ThemeToggle />
            <ProfileSelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 rounded-l-2xl p-4 h-[calc(100vh-2rem)] sticky top-4">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
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
              <ThemeToggle />
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