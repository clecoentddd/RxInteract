export type Drug = {
  id: string; // This will be the UUID from the DrugAdded event
  name: string;
};

export type InteractionSeverity = 'Mild' | 'Moderate' | 'Severe' | '';

export type Interaction = {
  id: string; // This will be the UUID from the InteractionAdded/Updated event
  drug1Id: string;
  drug2Id: string;
  severity: InteractionSeverity;
  description: string;
  reco: string;
  reco_details: string[];
};

// Event Sourcing Types
type EventMetadata = {
  event_type: string;
  timestamp: number;
  uuid: string;
};

type DrugAddedPayload = {
  drug: string;
  drug_details: string[];
};

type InteractionAddedPayload = {
    drug_uuid: string; 
    drug_name1: string;
    drug_name2: string;
    description: string[];
    reco: string;
    reco_details: string[];
    severity: InteractionSeverity;
};

type DrugDeletedPayload = {
    drugId: string;
};

type InteractionDeletedPayload = {
    interactionId: string;
};

type InteractionUpdatedPayload = Omit<Interaction, 'id'> & {id: string};


export type AppEvent = {
  metadata: EventMetadata;
  payload: DrugAddedPayload | InteractionAddedPayload | DrugDeletedPayload | InteractionUpdatedPayload | { [key: string]: any };
};
