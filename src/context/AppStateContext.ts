import { createContext } from 'react';
import type { AppState, AppAction } from './AppStateContext.types';

// Context
export const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);
