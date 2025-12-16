"use client";

import React from "react";
import CardItem from "@/components/CardItem";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CardsPage = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold ml-2">My Cards</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardItem
            type="Standard"
            bankName="FinFlow Bank"
            cardNumber="4567890123456789"
            cardHolder="Md. Masud Hussain"
            expiryDate="12/28"
          />
          <CardItem
            type="Reward"
            bankName="Global Rewards Inc."
            cardNumber="1234567890123456"
            cardHolder="Md. Masud Hussain"
            expiryDate="08/26"
          />
          <CardItem
            type="Travel"
            bankName="Voyage Credit"
            cardNumber="9876543210987654"
            cardHolder="Md. Masud Hussain"
            expiryDate="05/27"
          />
          <CardItem
            type="Standard"
            cardNumber="1122334455667788"
            cardHolder="Md. Masud Hussain"
            expiryDate="01/25"
          />
        </div>
      </div>
    </div>
  );
};

export default CardsPage;