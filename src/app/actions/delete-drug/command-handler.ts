// src/app/actions/delete-drug/command-handler.ts
"use server"
import type { AppState, AppEvent } from '@/lib/types';
import type { DeleteDrugCommand } from './command';
import { createDrugDeletedEvent } from './event';
import { createInitialState, applyEvent } from '@/app/data/events';
import fs from 'fs';
import path from 'path';

function getCurrentState(): AppState {
    const filePath = path.join(process.cwd(), 'DB', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const initialEventData = JSON.parse(fileContent);
    return (initialEventData as AppEvent[]).reduce(applyEvent, createInitialState());
}

export async function handleDeleteDrugCommand(command: DeleteDrugCommand) {
  const state = getCurrentState();
  // Business rules (e.g., check if drug exists) could be added here.
  const event = createDrugDeletedEvent(command.drugId);
  return event;
}
