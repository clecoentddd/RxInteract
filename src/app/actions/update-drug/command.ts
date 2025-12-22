// src/app/actions/update-drug/command.ts
import { z } from 'zod';

export const UpdateDrugCommandSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Drug name must be at least 2 characters.'),
  details: z.string().transform(val => val.split('\n').filter(s => s.trim() !== '')),
});

export type UpdateDrugCommand = z.infer<typeof UpdateDrugCommandSchema>;
