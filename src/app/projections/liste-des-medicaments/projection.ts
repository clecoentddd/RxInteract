// src/app/projections/liste-des-medicaments/projection.ts
import type { AppState, Drug } from '@/lib/types';
import { useMemo } from 'react';

export function useListeDesMedicaments(appState: AppState): Drug[] {
  const sortedDrugs = useMemo(() => {
    const drugsArray = Array.from(appState.drugs.values());
    return drugsArray.sort((a, b) => a.name.localeCompare(b.name));
  }, [appState.drugs]);

  return sortedDrugs;
}
