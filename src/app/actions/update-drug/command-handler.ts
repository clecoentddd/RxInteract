// src/app/actions/update-drug/command-handler.ts
"use server";
import type { AppState, AppEvent } from '@/lib/types';
import type { UpdateDrugCommand } from './command';
import { createDrugUpdatedEvent } from './event';
import { createInitialState, applyEvent } from '@/app/data/events';
import fs from 'fs';
import path from 'path';

function getCurrentState(): AppState {
    const filePath = path.join(process.cwd(), 'DB', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const initialEventData = JSON.parse(fileContent);
    return (initialEventData as AppEvent[]).reduce(applyEvent, createInitialState());
}

export async function handleUpdateDrugCommand(command: UpdateDrugCommand) {
  const state = getCurrentState();
  // Business Rule: Drug must exist.
  if (!state.drugs.has(command.id)) {
    throw new Error('Drug not found.');
  }

  // Business Rule: New name must not conflict with another existing drug.
  const existingDrugWithNewName = Array.from(state.drugs.values()).find(
    (d) => d.name.toLowerCase() === command.name.toLowerCase() && d.id !== command.id
  );

  if (existingDrugWithNewName) {
    throw new Error('Another drug with this name already exists.');
  }

  // Append Event
  const event = createDrugUpdatedEvent(command);
  return event;
}
