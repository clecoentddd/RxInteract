"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initialDrugs, initialInteractions } from '@/lib/data';
import type { Drug, Interaction, InteractionSeverity } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  drugs: Drug[];
  interactions: Interaction[];
  addDrug: (name: string) => void;
  deleteDrug: (id: string) => void;
  addInteraction: (data: Omit<Interaction, 'id'>) => void;
  updateInteraction: (id: string, data: Partial<Omit<Interaction, 'id'>>) => void;
  deleteInteraction: (id: string) => void;
  getDrugById: (id: string) => Drug | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drugs, setDrugs] = useState<Drug[]>(initialDrugs);
  const [interactions, setInteractions] = useState<Interaction[]>(initialInteractions);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const getDrugById = (id: string) => drugs.find(d => d.id === id);

  const addDrug = (name: string) => {
    if (drugs.some(d => d.name.toLowerCase() === name.toLowerCase())) {
        toast({
            variant: "destructive",
            title: "Error adding drug",
            description: "A drug with this name already exists.",
        });
        return;
    }
    const newDrug: Drug = {
      id: `drug_${Date.now()}`,
      name,
    };
    setDrugs(prev => [...prev, newDrug]);
  };

  const deleteDrug = (id: string) => {
    setDrugs(prev => prev.filter(d => d.id !== id));
    // Also remove any interactions involving this drug
    setInteractions(prev => prev.filter(i => i.drug1Id !== id && i.drug2Id !== id));
  };

  const addInteraction = (data: Omit<Interaction, 'id'>) => {
    const newInteraction: Interaction = {
      id: `int_${Date.now()}`,
      ...data,
    };
    setInteractions(prev => [...prev, newInteraction]);
  };

  const updateInteraction = (id: string, data: Partial<Omit<Interaction, 'id'>>) => {
    setInteractions(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  };
  
  const deleteInteraction = (id: string) => {
    setInteractions(prev => prev.filter(i => i.id !== id));
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    drugs,
    interactions,
    addDrug,
    deleteDrug,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    getDrugById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
