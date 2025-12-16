"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plane, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardItemProps {
  type: "Reward" | "Travel" | "Standard";
  bankName?: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  className?: string;
}

const CardItem: React.FC<CardItemProps> = ({
  type,
  bankName,
  cardNumber,
  cardHolder,
  expiryDate,
  className,
}) => {
  const getCardIcon = () => {
    switch (type) {
      case "Reward":
        return <Gift className="h-6 w-6 text-yellow-500" />;
      case "Travel":
        return <Plane className="h-6 w-6 text-blue-500" />;
      case "Standard":
      default:
        return <CreditCard className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCardGradient = () => {
    switch (type) {
      case "Reward":
        return "bg-gradient-to-br from-yellow-400 to-orange-500";
      case "Travel":
        return "bg-gradient-to-br from-blue-500 to-purple-600";
      case "Standard":
      default:
        return "bg-gradient-to-br from-gray-700 to-gray-900";
    }
  };

  return (
    <Card className={cn("w-full max-w-sm shadow-lg rounded-xl overflow-hidden", getCardGradient(), className)}>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-white text-xl font-bold">{type} Card</CardTitle>
        {getCardIcon()}
      </CardHeader>
      <CardContent className="p-4 text-white space-y-4">
        {bankName && <p className="text-sm opacity-80">{bankName}</p>}
        <p className="font-mono text-2xl tracking-wider">{cardNumber.replace(/(.{4})/g, '$1 ').trim()}</p>
        <div className="flex justify-between text-sm">
          <div>
            <p className="opacity-70">Card Holder</p>
            <p className="uppercase font-medium">{cardHolder}</p>
          </div>
          <div>
            <p className="opacity-70">Expires</p>
            <p className="font-medium">{expiryDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;