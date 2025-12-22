// src/app/actions/delete-drug/command-handler.ts
import type { AppState } from '@/lib/types';
import type { DeleteDrugCommand } from './command';
import { createDrugDeletedEvent } from './event';

export function handleDeleteDrugCommand(state: AppState, command: DeleteDrugCommand) {
  // Business rules (e.g., check if drug exists) could be added here.
  const event = createDrugDeletedEvent(command.drugId);
  return event;
}
