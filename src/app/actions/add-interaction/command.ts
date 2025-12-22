// src/app/actions/add-interaction/command.ts
import { interactionFormSchema } from '@/lib/types';

export type AddInteractionCommand = Zod.infer<typeof interactionFormSchema>;
