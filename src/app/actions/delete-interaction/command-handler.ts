// src/app/actions/delete-interaction/command-handler.ts
"use server";
import type { AppState, AppEvent } from '@/lib/types';
import type { DeleteInteractionCommand } from './command';
import { createInteractionDeletedEvent } from './event';
import { createInitialState, applyEvent } from '@/app/data/events';
import fs from 'fs';
import path from 'path';

function getCurrentState(): AppState {
    const filePath = path.join(process.cwd(), 'DB', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const initialEventData = JSON.parse(fileContent);
    return (initialEventData as AppEvent[]).reduce(applyEvent, createInitialState());
}

export async function handleDeleteInteractionCommand(command: DeleteInteractionCommand) {
  const state = getCurrentState();
  // Business rules could be added here.
  const event = createInteractionDeletedEvent(command.interactionId);
  return event;
}
