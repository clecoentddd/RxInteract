import type { Drug, Interaction } from '@/lib/types';

export const initialDrugs: Drug[] = [
  { id: '1', name: 'Warfarin' },
  { id: '2', name: 'Aspirin' },
  { id: '3', name: 'Ibuprofen' },
  { id: '4', name: 'Amoxicillin' },
  { id: '5', name: 'Lisinopril' },
  { id: '6', name: 'Metformin' },
  { id: '7', name: 'Simvastatin' },
  { id: '8', name: 'Sildenafil' },
  { id: '9', name: 'Nitroglycerin' }
];

export const initialInteractions: Interaction[] = [
  {
    id: 'int1',
    drug1Id: '1', // Warfarin
    drug2Id: '2', // Aspirin
    severity: 'Severe',
    description: 'Concurrent use of Warfarin and Aspirin significantly increases the risk of bleeding. This combination should be avoided unless specifically prescribed and monitored by a healthcare professional.',
  },
  {
    id: 'int2',
    drug1Id: '1', // Warfarin
    drug2Id: '3', // Ibuprofen
    severity: 'Moderate',
    description: 'NSAIDs like Ibuprofen can increase the anticoagulant effect of Warfarin, raising the risk of bleeding. Monitor INR closely if co-administered.',
  },
  {
    id: 'int3',
    drug1Id: '5', // Lisinopril
    drug2Id: '3', // Ibuprofen
    severity: 'Moderate',
    description: 'NSAIDs may reduce the antihypertensive effect of ACE inhibitors like Lisinopril. Can also increase risk of renal impairment. Monitor blood pressure and renal function.',
  },
    {
    id: 'int4',
    drug1Id: '8', // Sildenafil
    drug2Id: '9', // Nitroglycerin
    severity: 'Severe',
    description: 'Co-administration can cause a severe and potentially fatal drop in blood pressure (hypotension). This combination is contraindicated.',
  },
];
