'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { cities, type CityId, type City } from './site';

/**
 * Город для клиентских компонентов (шапка, форма, карта).
 * Ставится один раз в src/app/[city]/layout.tsx. Серверные компоненты
 * получают город параметром — контекст им недоступен.
 */
const CityContext = createContext<CityId>('moscow');

export function CityProvider({ cityId, children }: { cityId: CityId; children: ReactNode }) {
  return <CityContext.Provider value={cityId}>{children}</CityContext.Provider>;
}

export function useCity(): City {
  return cities[useContext(CityContext)];
}
