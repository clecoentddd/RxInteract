// src/app/actions/check-composition/command-handler.ts
"use server";
import type { AppState } from '@/lib/types';
import type { CheckCompositionCommand } from './command';
import { fetchDrugComposition } from '@/app/services/drug-api-service';
import { createCompositionCheckedEvent } from './event';

export async function handleCheckCompositionCommand(state: AppState, command: CheckCompositionCommand) {
  // Call the external service
  const compositionResult = await fetchDrugComposition(command.drugName);

  // Append Event with the result
  const event = createCompositionCheckedEvent({
    drugId: command.drugId,
    count: compositionResult.count,
    error: compositionResult.error,
  });

  return event;
}
