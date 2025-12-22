import { z } from 'zod';

export type Drug = {
  id: string;
  name: string;
};

export type InteractionSeverity = 'Mild' | 'Moderate' | 'Severe' | '';

export type Interaction = {
  id: string;
  drug1Id: string;
  drug2Id: string;
  severity: InteractionSeverity;
  description: string;
  reco: string;
  reco_details: string[];
};

export const interactionSchema = z.object({
  drug1Id: z.string().min(1, 'Please select the first drug.'),
  drug2Id: z.string().min(1, 'Please select the second drug.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  reco: z.string().min(1, 'Recommendation is required.'),
  reco_details: z.string().transform(val => val.split('\n').filter(s => s.trim() !== '')),
});

export type InteractionFormValues = z.infer<typeof interactionSchema>;


// Event Sourcing Types
type EventMetadata = {
  event_type: string;
  timestamp: number;
  uuid: string;
};

type DrugAddedPayload = {
  drug: string;
  drug_details: string[];
  uuid?: string;
};

type InteractionAddedPayload = Omit<Interaction, 'id' | 'description' | 'severity'> & {
    description: string[];
};

type DrugDeletedPayload = {
    drugId: string;
};

type InteractionDeletedPayload = {
    interactionId: string;
};

type InteractionUpdatedPayload = Partial<Omit<Interaction, 'drug1Id' | 'drug2Id'>> & {id: string};


export type AppEvent = {
  metadata: EventMetadata;
  payload: DrugAddedPayload | InteractionAddedPayload | DrugDeletedPayload | InteractionUpdatedPayload | { [key: string]: any };
};

// State slices
export interface AppState {
  drugs: Map<string, Drug>;
  interactions: Map<string, Interaction>;
}
