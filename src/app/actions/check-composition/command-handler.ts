
// src/app/actions/check-composition/command-handler.ts
"use server";
import type { AppState } from '@/lib/types';
import type { CheckCompositionCommand } from './command';
import { createCompositionCheckedEvent } from './event';

type CompositionApiResponse = {
    count: number;
    error?: string;
}

async function fetchDrugCompositionFromApiRoute(drugName: string): Promise<CompositionApiResponse> {
    // This function now calls our internal API route
    try {
        const response = await fetch('/api/check-composition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ drugName }),
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.error || `API route failed with status: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("Failed to fetch from API route:", error);
        return { count: 0, error: error.message || 'An unknown error occurred' };
    }
}


export async function handleCheckCompositionCommand(state: AppState, command: CheckCompositionCommand) {
  // Call the internal API route
  const compositionResult = await fetchDrugCompositionFromApiRoute(command.drugName);

  // Append Event with the result
  const event = createCompositionCheckedEvent({
    drugId: command.drugId,
    count: compositionResult.count,
    error: compositionResult.error,
  });

  return event;
}
