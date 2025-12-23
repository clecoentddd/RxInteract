// src/app/actions/lookup-drug/command.ts
import { z } from 'zod';

export const LookupDrugCommandSchema = z.object({
  drugName: z.string(),
});

export type LookupDrugCommand = z.infer<typeof LookupDrugCommandSchema>;
