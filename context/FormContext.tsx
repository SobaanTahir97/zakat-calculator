import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchGoldRate } from '../lib/goldRate';

export interface FormState {
  cash: string;
  gold: string;
  silver: string;
  stocks: string;
  debt: string;
  nisabType: 'gold' | 'silver';
  pricePerGram: string;
  goldRateStatus: 'idle' | 'loading' | 'ready' | 'error';
  goldRateSource?: string;
  goldRateUpdatedAt?: string;
}

interface FormContextType {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [form, setForm] = useState<FormState>({
    cash: '',
    gold: '',
    silver: '',
    stocks: '',
    debt: '',
    nisabType: 'gold',
    pricePerGram: '',
    goldRateStatus: 'idle',
    goldRateSource: undefined,
    goldRateUpdatedAt: undefined,
  });

  useEffect(() => {
    let isCancelled = false;

    const loadGoldRate = async () => {
      setForm((prev) => ({ ...prev, goldRateStatus: 'loading' }));

      try {
        const rate = await fetchGoldRate();
        if (isCancelled) {
          return;
        }

        setForm((prev) => ({
          ...prev,
          pricePerGram: prev.pricePerGram || String(rate.aedPerGram24k),
          goldRateStatus: 'ready',
          goldRateSource: rate.sourceLabel,
          goldRateUpdatedAt: rate.asOf,
        }));
      } catch (_error) {
        if (isCancelled) {
          return;
        }

        setForm((prev) => ({
          ...prev,
          goldRateStatus: 'error',
          goldRateSource: undefined,
          goldRateUpdatedAt: undefined,
        }));
      }
    };

    loadGoldRate();

    return () => {
      isCancelled = true;
    };
  }, []);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return <FormContext.Provider value={{ form, setForm, updateField }}>{children}</FormContext.Provider>;
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
};
