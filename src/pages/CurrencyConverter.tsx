"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { DollarSign, ArrowRight, RefreshCw } from "lucide-react";

const CurrencyConverter = () => {
  const { exchangeRates, baseCurrency, convertAmount, setBaseCurrency } = useFinance();
  const [amountToConvert, setAmountToConvert] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>(baseCurrency);
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  const currencyOptions = Object.keys(exchangeRates).map(currencyCode => ({
    value: currencyCode,
    label: currencyCode,
  }));

  useEffect(() => {
    if (fromCurrency && toCurrency && amountToConvert) {
      const result = convertAmount(amountToConvert, fromCurrency, toCurrency);
      setConvertedAmount(result);
    }
  }, [amountToConvert, fromCurrency, toCurrency, exchangeRates, convertAmount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmountToConvert(isNaN(value) ? 0 : value);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-teal-600" />
            Current Exchange Rates (vs. {baseCurrency})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(exchangeRates)
              .filter(([currency]) => currency !== baseCurrency)
              .map(([currencyCode, rate]) => (
                <div key={currencyCode} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">{currencyCode}</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {(1 / convertAmount(1, currencyCode, baseCurrency)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </span>
                </div>
              ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Rates are approximate and for informational purposes only.
          </p>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-cyan-600" />
            Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="amountToConvert">Amount</Label>
              <Input
                id="amountToConvert"
                type="number"
                step="0.01"
                value={amountToConvert}
                onChange={handleAmountChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fromCurrency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="mt-1">
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
            <div className="flex items-center justify-center md:justify-start h-full pt-2 md:pt-0">
              <Button variant="ghost" size="icon" onClick={handleSwapCurrencies} aria-label="Swap currencies">
                <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mt-4">
            <div>
              <Label htmlFor="toCurrency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="mt-1">
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
            <div>
              <Label>Converted Amount</Label>
              <Input
                value={`${toCurrency} ${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                readOnly
                className="mt-1 font-bold text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;