// src/app/actions/check-composition/command-handler.ts
"use server";
import type { AppState, AppEvent } from '@/lib/types';
import type { CheckCompositionCommand } from './command';
import { createCompositionCheckedEvent } from './event';
import { createInitialState, applyEvent } from '@/app/data/events';
import fs from 'fs';
import path from 'path';

function getCurrentState(): AppState {
    const filePath = path.join(process.cwd(), 'DB', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const initialEventData = JSON.parse(fileContent);
    return (initialEventData as AppEvent[]).reduce(applyEvent, createInitialState());
}


export async function handleCheckCompositionCommand(command: CheckCompositionCommand): Promise<any> {
    const state = getCurrentState();
    const drug = state.drugs.get(command.drugId);
    if (!drug) {
      return createCompositionCheckedEvent({
          drugId: command.drugId,
          count: 0,
          error: "Drug not found in local database."
      });
    }
    
    const filePath = path.join(process.cwd(), 'DB', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const initialEventData = JSON.parse(fileContent);

    const compositionEvents = (initialEventData as AppEvent[]).filter(e => 
        e.metadata.event_type === 'DrugAdded' && 
        (e.payload as any).drug === drug.name
    );

    const count = compositionEvents.reduce((acc, curr) => {
        const details = (curr.payload as any).drug_details;
        return acc + (Array.isArray(details) ? details.length : 0);
    }, 0);


    const event = createCompositionCheckedEvent({
      drugId: command.drugId,
      count: count,
    });
    return event;
}
