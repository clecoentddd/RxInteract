export type Drug = {
  id: string;
  name: string;
};

export type InteractionSeverity = 'Mild' | 'Moderate' | 'Severe';

export type Interaction = {
  id: string;
  drug1Id: string;
  drug2Id: string;
  severity: InteractionSeverity;
  description: string;
};
