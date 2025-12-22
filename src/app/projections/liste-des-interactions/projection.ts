// src/app/projections/liste-des-interactions/projection.ts
import type { AppState, Interaction } from '@/lib/types';
import { useMemo } from 'react';

export function useListeDesInteractions(appState: AppState): Interaction[] {
  const sortedInteractions = useMemo(() => {
    const interactionsArray = Array.from(appState.interactions.values());
    return interactionsArray.sort((a, b) => {
      const drug1NameA = appState.drugs.get(a.drug1Id)?.name || '';
      const drug1NameB = appState.drugs.get(b.drug1Id)?.name || '';
      return drug1NameA.localeCompare(drug1NameB);
    });
  }, [appState.interactions, appState.drugs]);

  return sortedInteractions;
}
