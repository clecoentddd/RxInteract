// src/app/actions/update-interaction/command-handler.ts
"use server";
import type { AppState, AppEvent } from '@/lib/types';
import type { UpdateInteractionCommand } from './command';
import { createInteractionUpdatedEvent } from './event';
import { createInitialState, applyEvent } from '@/app/data/events';
import fs from 'fs';
import path from 'path';

function getCurrentState(): AppState {
    const filePath = path.join(process.cwd(), 'DB', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const initialEventData = JSON.parse(fileContent);
    return (initialEventData as AppEvent[]).reduce(applyEvent, createInitialState());
}

export async function handleUpdateInteractionCommand(command: UpdateInteractionCommand) {
  const state = getCurrentState();
  const existingInteraction = state.interactions.get(command.id);

  if (!existingInteraction) {
    throw new Error('Interaction not found.');
  }

  // Business Rule: Ensure we only update specific fields
  const updatePayload = {
    id: command.id,
    description: command.description,
    reco: command.reco,
    reco_details: command.reco_details,
  };

  // Append Event
  const event = createInteractionUpdatedEvent(updatePayload);
  return event;
}
