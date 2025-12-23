// src/app/actions/lookup-drug/command-handler.ts
"use server";
import type { LookupDrugCommand } from './command';
import { createDrugFoundEvent } from './event';

export async function handleLookupDrugCommand(command: LookupDrugCommand) {
    const { drugName } = command;
    const response = await fetch(`https://medicaments-api.giygas.dev/medicament/${encodeURIComponent(drugName)}`);

    if (!response.ok) {
        if (response.status === 404) {
             return createDrugFoundEvent({
                drugName: drugName,
                data: { message: `Drug '${drugName}' not found in the external database.` },
                error: true,
            });
        }
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    const event = createDrugFoundEvent({
        drugName: drugName,
        data: data,
        error: false,
    });

    return event;
}
