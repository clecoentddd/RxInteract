"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { Drug, Interaction, InteractionFormValues, AppEvent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { applyEvents, createInitialState } from '@/lib/events';
import initialEventData from '../../DB/events.json';


// --- React Context ---

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  drugs: Drug[];
  interactions: Interaction[];
  addDrug: (name: string) => void;
  deleteDrug: (id: string) => void;
  addInteraction: (data: InteractionFormValues) => void;
  updateInteraction: (id: string, data: Partial<InteractionFormValues>) => void;
  deleteInteraction: (id: string) => void;
  getDrugById: (id: string) => Drug | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<AppEvent[]>(initialEventData as AppEvent[]);

  const { drugs, interactions } = useMemo(() => applyEvents(createInitialState(), events), [events]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const getDrugById = (id: string) => drugs.find(d => d.id === id);

  const appendEvent = (event: AppEvent) => {
      console.log("New event:", event);
      setEvents(prev => [...prev, event]);
  }

  const addDrug = (name: string) => {
    if (drugs.some(d => d.name.toLowerCase() === name.toLowerCase())) {
        toast({
            variant: "destructive",
            title: "Error adding drug",
            description: "A drug with this name already exists.",
        });
        return;
    }
    const newEvent: AppEvent = {
        metadata: {
            event_type: 'DrugAdded',
            timestamp: Date.now() / 1000,
            uuid: `drug_${Date.now()}`
        },
        payload: { drug: name.toUpperCase(), drug_details: [] }
    };
    appendEvent(newEvent);
    toast({ title: "Success", description: `Drug "${name}" added.`})
  };

  const deleteDrug = (id: string) => {
    const newEvent: AppEvent = {
        metadata: {
            event_type: 'DrugDeleted',
            timestamp: Date.now() / 1000,
            uuid: `evt_${Date.now()}`
        },
        payload: { drugId: id }
    };
    appendEvent(newEvent);
  };

  const addInteraction = (data: InteractionFormValues) => {
    const newEvent: AppEvent = {
      metadata: {
        event_type: 'InteractionAdded',
        timestamp: Date.now() / 1000,
        uuid: `int_${Date.now()}`,
      },
      payload: {
          ...data,
          description: [data.description] // Ensure description is an array
      }
    };
    appendEvent(newEvent);
  };

  const updateInteraction = (id: string, data: Partial<InteractionFormValues>) => {
    const existingInteraction = interactions.find(i => i.id === id);
    if (!existingInteraction) return;
    
    const payload = { 
        id, 
        drug1Id: existingInteraction.drug1Id,
        drug2Id: existingInteraction.drug2Id,
        ...data 
    };

    if (payload.description) {
        payload.description = [payload.description];
    }
    
    const newEvent: AppEvent = {
        metadata: {
            event_type: 'InteractionUpdated',
            timestamp: Date.now() / 1000,
            uuid: `evt_${Date.now()}`
        },
        payload
    };
    appendEvent(newEvent);
  };
  
  const deleteInteraction = (id: string) => {
    const newEvent: AppEvent = {
        metadata: {
            event_type: 'InteractionDeleted',
            timestamp: Date.now() / 1000,
            uuid: `evt_${Date.now()}`
        },
        payload: { interactionId: id }
    };
    appendEvent(newEvent);
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
