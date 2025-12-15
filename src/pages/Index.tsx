import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, PieChart, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to FinFlow
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Your personal finance navigator for smarter money management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <TrendingUp className="h-10 w-10 text-teal-600 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Track Expenses</h3>
              <p className="text-gray-600">
                Easily log and categorize all your income and expenses
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <PieChart className="h-10 w-10 text-teal-600 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Visual Analytics</h3>
              <p className="text-gray-600">
                Beautiful charts to understand your spending patterns
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <Calendar className="h-10 w-10 text-teal-600 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Bill Reminders</h3>
              <p className="text-gray-600">
                Never miss a payment with recurring bill tracking
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <Wallet className="h-10 w-10 text-teal-600 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Multi-Currency</h3>
              <p className="text-gray-600">
                Manage finances in multiple currencies with automatic conversion
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-lg">
              <Link to="/dashboard">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;