// src/app/actions/add-drug/command.ts
import { z } from 'zod';

export const AddDrugCommandSchema = z.object({
  name: z.string().min(2, 'Drug name must be at least 2 characters.'),
  details: z.string().optional(),
});

export type AddDrugCommand = z.infer<typeof AddDrugCommandSchema>;
