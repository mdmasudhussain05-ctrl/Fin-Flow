"use client";

import React from "react";
import TransactionForm from "@/components/TransactionForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AddTransactionPage = () => {
  const navigate = useNavigate();

  const handleFormClose = () => {
    navigate("/dashboard"); // Navigate back to dashboard after closing
  };

  const handleFormSubmit = () => {
    navigate("/dashboard"); // Navigate back to dashboard after submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={handleFormClose} className="p-2">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
          </Button>
        </div>
        <TransactionForm 
          onClose={handleFormClose} 
          onSubmit={handleFormSubmit} 
        />
      </div>
    </div>
  );
};

export default AddTransactionPage;