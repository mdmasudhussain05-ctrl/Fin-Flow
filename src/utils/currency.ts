import { ExchangeRate } from "@/types/accounting";

export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: ExchangeRate
): number => {
  if (fromCurrency === toCurrency) return amount;
  const amountInUSD = amount / (exchangeRates[fromCurrency] || 1);
  return amountInUSD * (exchangeRates[toCurrency] || 1);
};