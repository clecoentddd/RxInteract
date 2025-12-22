"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { Drug, Interaction, InteractionSeverity, AppEvent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import initialEventData from '../../DB/events.json';

// --- Helper functions for Event Sourcing ---

function applyEvents(events: AppEvent[]): { drugs: Drug[], interactions: Interaction[] } {
    const drugsMap = new Map<string, Drug>();
    const interactionsMap = new Map<string, Interaction>();
    const deletedDrugIds = new Set<string>();
    const deletedInteractionIds = new Set<string>();

    // Sort events by timestamp to ensure correct order
    const sortedEvents = [...events].sort((a, b) => a.metadata.timestamp - b.metadata.timestamp);

    for (const event of sortedEvents) {
        switch (event.metadata.event_type) {
            case 'DrugAdded': {
                const payload = event.payload as { drug: string, uuid?: string };
                const drug: Drug = { id: event.metadata.uuid, name: payload.drug };
                drugsMap.set(drug.id, drug);
                break;
            }
            case 'DrugDeleted': {
                 const payload = event.payload as { drugId: string };
                 deletedDrugIds.add(payload.drugId);
                 break;
            }
            case 'InteractionAdded': {
                const payload = event.payload as any;
                
                // Legacy support for when drug IDs were not directly in the payload
                let drug1Id = payload.drug1Id;
                let drug2Id = payload.drug2Id;

                if (!drug1Id || !drug2Id) {
                    const drugs = Array.from(drugsMap.values());
                    const drug1 = drugs.find(d => d.name === payload.drug_name1);
                    const drug2 = drugs.find(d => d.name === payload.drug_name2);
                    if (drug1) drug1Id = drug1.id;
                    if (drug2) drug2Id = drug2.id;
                }

                if (drug1Id && drug2Id) {
                    let severity: InteractionSeverity = payload.severity || '';
                    if (!severity) {
                         // Derive severity for older events
                        if (payload.reco?.includes('CONTRE-INDICATION')) severity = 'Severe';
                        else if (payload.reco?.includes('DECONSEILLEE')) severity = 'Moderate';
                        else if (payload.reco?.includes('Précaution')) severity = 'Mild';
                    }

                    const interaction: Interaction = {
                        id: event.metadata.uuid,
                        drug1Id: drug1Id,
                        drug2Id: drug2Id,
                        severity: severity,
                        description: Array.isArray(payload.description) ? payload.description.join(' ') : payload.description,
                        reco: payload.reco,
                        reco_details: payload.reco_details || [],
                    };
                    interactionsMap.set(interaction.id, interaction);
                }
                break;
            }
            case 'InteractionUpdated': {
                const payload = event.payload as Interaction;
                 if (interactionsMap.has(payload.id)) {
                    interactionsMap.set(payload.id, { ...interactionsMap.get(payload.id)!, ...payload });
                }
                break;
            }
            case 'InteractionDeleted': {
                const payload = event.payload as { interactionId: string };
                deletedInteractionIds.add(payload.interactionId);
                break;
            }
        }
    }
    
    deletedDrugIds.forEach(drugId => {
        drugsMap.delete(drugId);
        // Also remove interactions involving the deleted drug
        for (const [intId, interaction] of interactionsMap.entries()) {
            if (interaction.drug1Id === drugId || interaction.drug2Id === drugId) {
                interactionsMap.delete(intId);
            }
        }
    });

    deletedInteractionIds.forEach(interactionId => {
        interactionsMap.delete(interactionId);
    });

    return { 
        drugs: Array.from(drugsMap.values()), 
        interactions: Array.from(interactionsMap.values()) 
    };
}


// --- React Context ---

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
  const [events, setEvents] = useState<AppEvent[]>(initialEventData as AppEvent[]);

  const { drugs, interactions } = useMemo(() => applyEvents(events), [events]);

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

  const addInteraction = (data: Omit<Interaction, 'id'>) => {
    const newEvent: AppEvent = {
      metadata: {
        event_type: 'InteractionAdded',
        timestamp: Date.now() / 1000,
        uuid: `int_${Date.now()}`,
      },
      payload: {
          ...data
      }
    };
    appendEvent(newEvent);
  };

  const updateInteraction = (id: string, data: Partial<Omit<Interaction, 'id'>>) => {
    const existingInteraction = interactions.find(i => i.id === id);
    if (!existingInteraction) return;
    
    const updatedInteraction: Interaction = { ...existingInteraction, ...data };
    
    const newEvent: AppEvent = {
        metadata: {
            event_type: 'InteractionUpdated',
            timestamp: Date.now() / 1000,
            uuid: `evt_${Date.now()}`
        },
        payload: updatedInteraction
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
