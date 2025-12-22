// src/app/actions/update-interaction/command.ts
import { interactionFormSchema } from '@/lib/types';
import { z } from 'zod';

export const UpdateInteractionCommandSchema = interactionFormSchema.extend({
  id: z.string(),
});

export type UpdateInteractionCommand = z.infer<typeof UpdateInteractionCommandSchema>;
