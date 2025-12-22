import type { AppState, AppEvent } from '@/lib/types';
import { drugAddedReducer } from '@/app/actions/add-drug/reducer';
import { drugDeletedReducer } from '@/app/actions/delete-drug/reducer';
import { interactionAddedReducer } from '@/app/actions/add-interaction/reducer';
import { interactionDeletedReducer } from '@/app/actions/delete-interaction/reducer';
import { interactionUpdatedReducer } from '@/app/actions/update-interaction/reducer';
import { drugUpdatedReducer } from '@/app/actions/update-drug/reducer';

export function createInitialState(): AppState {
    return {
        drugs: new Map(),
        interactions: new Map(),
    };
}

const eventReducers: Record<string, (state: AppState, event: AppEvent) => AppState> = {
  'DrugAdded': drugAddedReducer,
  'DrugUpdated': drugUpdatedReducer,
  'DrugDeleted': drugDeletedReducer,
  'InteractionAdded': interactionAddedReducer,
  'InteractionUpdated': interactionUpdatedReducer,
  'InteractionDeleted': interactionDeletedReducer,
};

export function applyEvent(state: AppState, event: AppEvent): AppState {
    const reducer = eventReducers[event.metadata.event_type];
    return reducer ? reducer(state, event) : state;
}
