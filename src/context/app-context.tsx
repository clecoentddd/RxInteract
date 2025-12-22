// src/context/app-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { Drug, Interaction, AppEvent, AppState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { applyEvent, createInitialState } from '@/lib/events';
import initialEventData from '../../DB/events.json';

// Slices
import type { AddDrugCommand } from '@/app/actions/add-drug/command';
import { handleAddDrugCommand } from '@/app/actions/add-drug/command-handler';

import type { DeleteDrugCommand } from '@/app/actions/delete-drug/command';
import { handleDeleteDrugCommand } from '@/app/actions/delete-drug/command-handler';

import type { AddInteractionCommand } from '@/app/actions/add-interaction/command';
import { handleAddInteractionCommand } from '@/app/actions/add-interaction/command-handler';

import type { UpdateInteractionCommand } from '@/app/actions/update-interaction/command';
import { handleUpdateInteractionCommand } from '@/app/actions/update-interaction/command-handler';

import type { DeleteInteractionCommand } from '@/app/actions/delete-interaction/command';
import { handleDeleteInteractionCommand } from '@/app/actions/delete-interaction/command-handler';

// Projections
import { useListeDesMedicaments } from '@/app/projections/liste-des-medicaments/projection';
import { useListeDesInteractions } from '@/app/projections/liste-des-interactions/projection';


// --- React Context ---

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  drugs: Drug[];
  interactions: Interaction[];
  addDrug: (command: AddDrugCommand) => void;
  deleteDrug: (command: DeleteDrugCommand) => void;
  addInteraction: (command: AddInteractionCommand) => void;
  updateInteraction: (command: UpdateInteractionCommand) => void;
  deleteInteraction: (command: DeleteInteractionCommand) => void;
  getDrugById: (id: string) => Drug | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<AppEvent[]>(initialEventData as AppEvent[]);

  // State Projection (Read Model)
  const appState: AppState = useMemo(() => {
    const initialState = createInitialState();
    return events.reduce(applyEvent, initialState);
  }, [events]);

  // Use projection slices to get the read models
  const drugs = useListeDesMedicaments(appState);
  const interactions = useListeDesInteractions(appState);


  // --- Authentication Slice ---
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const getDrugById = useCallback((id: string) => appState.drugs.get(id), [appState.drugs]);

  // --- Command Dispatcher ---
  const dispatchCommand = (handler: Function, command: any, successMessage: string) => {
    try {
      const newEvent = handler(appState, command);
      setEvents(prev => [...prev, newEvent]);
      toast({ title: "Success", description: successMessage });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // --- Public API for Components ---
  const addDrug = (command: AddDrugCommand) => {
    dispatchCommand(handleAddDrugCommand, command, `Drug "${command.name}" added.`);
  };

  const deleteDrug = (command: DeleteDrugCommand) => {
    dispatchCommand(handleDeleteDrugCommand, command, `Drug "${command.drugName}" and its interactions have been deleted.`);
  };

  const addInteraction = (command: AddInteractionCommand) => {
    dispatchCommand(handleAddInteractionCommand, command, 'Interaction added.');
  };

  const updateInteraction = (command: UpdateInteractionCommand) => {
    dispatchCommand(handleUpdateInteractionCommand, command, 'Interaction updated.');
  };

  const deleteInteraction = (command: DeleteInteractionCommand) => {
    dispatchCommand(handleDeleteInteractionCommand, command, 'Interaction deleted.');
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
