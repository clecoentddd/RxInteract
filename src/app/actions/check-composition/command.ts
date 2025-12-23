// src/app/actions/check-composition/command.ts
import { z } from 'zod';

export const CheckCompositionCommandSchema = z.object({
  drugId: z.string(),
  drugName: z.string(),
});

export type CheckCompositionCommand = z.infer<typeof CheckCompositionCommandSchema>;
