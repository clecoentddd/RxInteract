// src/app/actions/delete-drug/command.ts
import { z } from 'zod';

export const DeleteDrugCommandSchema = z.object({
  drugId: z.string(),
  drugName: z.string(),
});

export type DeleteDrugCommand = z.infer<typeof DeleteDrugCommandSchema>;
