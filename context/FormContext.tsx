import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchMetalRate, type Currency, type RateStatus } from '../lib/goldRate';
import type { WeightUnit, IrrigationType, Methodology } from '../lib/calculate';

export interface FormState {
  cash: string;
  gold: string;
  silver: string;
  stocks: string;
  receivables: string;
  debt: string;
  nisabType: 'gold' | 'silver';
  methodology: Methodology;
  // Ghamidi-specific
  agriculturalProduce: string;
  irrigationType: IrrigationType;
  rentalIncome: string;
  // Contemporary-specific
  professionalIncome: string;
  businessInventory: string;
  // Shafi'i ruling toggle
  deductDebts: boolean;
  goldPricePerUnit: string;
  silverPricePerUnit: string;
  weightUnit: WeightUnit;
  currency: Currency;
  goldRateStatus: RateStatus;
  goldRateSource?: string;
  goldRateUpdatedAt?: string;
  silverRateStatus: RateStatus;
  silverRateSource?: string;
  silverRateUpdatedAt?: string;
}

interface FormContextType {
  form: FormState;
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [form, setForm] = useState<FormState>({
    cash: '',
    gold: '',
    silver: '',
    stocks: '',
    receivables: '',
    debt: '',
    nisabType: 'gold',
    methodology: 'standard',
    agriculturalProduce: '',
    irrigationType: 'irrigated',
    rentalIncome: '',
    professionalIncome: '',
    businessInventory: '',
    deductDebts: true,
    goldPricePerUnit: '',
    silverPricePerUnit: '',
    weightUnit: 'gram',
    currency: 'AED',
    goldRateStatus: 'idle',
    goldRateSource: undefined,
    goldRateUpdatedAt: undefined,
    silverRateStatus: 'idle',
    silverRateSource: undefined,
    silverRateUpdatedAt: undefined,
  });

  // Fetch gold & silver rates in parallel on mount and when currency changes
  useEffect(() => {
    let isCancelled = false;

    const loadRates = async () => {
      setForm((prev) => ({
        ...prev,
        goldRateStatus: 'loading',
        goldPricePerUnit: '',
        silverRateStatus: 'loading',
        silverPricePerUnit: '',
      }));

      const [goldResult, silverResult] = await Promise.allSettled([
        fetchMetalRate('XAU', { currency: form.currency, forceRefresh: true }),
        fetchMetalRate('XAG', { currency: form.currency, forceRefresh: true }),
      ]);

      if (isCancelled) return;

      setForm((prev) => ({
        ...prev,
        ...(goldResult.status === 'fulfilled'
          ? {
              goldPricePerUnit: prev.goldPricePerUnit || String(goldResult.value.pricePerGram24k),
              goldRateStatus: 'ready' as const,
              goldRateSource: goldResult.value.sourceLabel,
              goldRateUpdatedAt: goldResult.value.asOf,
            }
          : { goldRateStatus: 'error' as const, goldRateSource: undefined, goldRateUpdatedAt: undefined }),
        ...(silverResult.status === 'fulfilled'
          ? {
              silverPricePerUnit: prev.silverPricePerUnit || String(silverResult.value.pricePerGram24k),
              silverRateStatus: 'ready' as const,
              silverRateSource: silverResult.value.sourceLabel,
              silverRateUpdatedAt: silverResult.value.asOf,
            }
          : { silverRateStatus: 'error' as const, silverRateSource: undefined, silverRateUpdatedAt: undefined }),
      }));
    };

    loadRates();

    return () => {
      isCancelled = true;
    };
  }, [form.currency]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return <FormContext.Provider value={{ form, updateField }}>{children}</FormContext.Provider>;
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
};
