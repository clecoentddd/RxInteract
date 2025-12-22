// src/app/actions/delete-interaction/command.ts
import { z } from 'zod';

export const DeleteInteractionCommandSchema = z.object({
  interactionId: z.string(),
});

export type DeleteInteractionCommand = z.infer<typeof DeleteInteractionCommandSchema>;
