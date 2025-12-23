// src/app/actions/add-drug/command-handler.ts
"use server"
import type { AppState, AppEvent } from '@/lib/types';
import type { AddDrugCommand } from './command';
import { createDrugAddedEvent } from './event';
import { createInitialState, applyEvent } from '@/app/data/events';
import fs from 'fs';
import path from 'path';

function getCurrentState(): AppState {
    const filePath = path.join(process.cwd(), 'DB', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const initialEventData = JSON.parse(fileContent);
    return (initialEventData as AppEvent[]).reduce(applyEvent, createInitialState());
}


export async function handleAddDrugCommand(command: AddDrugCommand) {
  const state = getCurrentState();

  // Apply business rules
  const existingDrug = Array.from(state.drugs.values()).find(
    (d) => d.name.toLowerCase() === command.name.toLowerCase()
  );

  if (existingDrug) {
    throw new Error('A drug with this name already exists.');
  }

  // Append Event
  const event = createDrugAddedEvent(command);
  // NOTE: In a real application, we would append this event to the events.json file.
  // For this prototype, we are only holding the events in the client-side state.
  return event;
}
