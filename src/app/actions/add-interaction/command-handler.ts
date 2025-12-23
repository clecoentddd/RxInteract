// src/app/actions/add-interaction/command-handler.ts
"use server";
import type { AppState, AppEvent } from '@/lib/types';
import type { AddInteractionCommand } from './command';
import { createInteractionAddedEvent } from './event';
import { createInitialState, applyEvent } from '@/app/data/events';
import fs from 'fs';
import path from 'path';

function getCurrentState(): AppState {
    const filePath = path.join(process.cwd(), 'DB', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const initialEventData = JSON.parse(fileContent);
    return (initialEventData as AppEvent[]).reduce(applyEvent, createInitialState());
}

export async function handleAddInteractionCommand(command: AddInteractionCommand) {
  const state = getCurrentState();
  // Business Rule: The two drugs must be different.
  if (command.drug1Id === command.drug2Id) {
    throw new Error('The two drugs must be different.');
  }

  // Business Rule: Interaction must not already exist.
  const interactionExists = Array.from(state.interactions.values()).some(
    (i) =>
      (i.drug1Id === command.drug1Id && i.drug2Id === command.drug2Id) ||
      (i.drug1Id === command.drug2Id && i.drug2Id === command.drug1Id)
  );

  if (interactionExists) {
    throw new Error('An interaction between these two drugs already exists.');
  }

  // Append Event
  const event = createInteractionAddedEvent(command);
  return event;
}
