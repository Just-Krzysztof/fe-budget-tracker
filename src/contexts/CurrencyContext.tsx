import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

const currencies = ['PLN', 'EUR', 'USD'] as const;
export type Currency = (typeof currencies)[number];

interface CurrencyContextType {
  currencies: readonly Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => (
  <CurrencyContext.Provider value={{ currencies }}>
    {children}
  </CurrencyContext.Provider>
);

export const useCurrencies = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencies must be used within a CurrencyProvider');
  }
  return context.currencies;
};
