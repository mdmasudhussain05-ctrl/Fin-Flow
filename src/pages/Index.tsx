import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-5xl font-bold mb-2">FinFlow</h1>
      <p className="text-lg mb-8">Made by Md. Masud Hussain</p>
      <Button asChild>
        <Link to="/cards">View My Cards</Link>
      </Button>
    </div>
  );
};

export default Index;