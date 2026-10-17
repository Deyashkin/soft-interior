import { notFound } from 'next/navigation';
import { cities, isCityId, type City } from './site';

/** Параметры страниц внутри src/app/[city]/. */
export type CityParams = Promise<{ city: string }>;

/** Город из адреса страницы. Неизвестный город — 404. */
export async function cityFromParams(params: CityParams): Promise<City> {
  const { city } = await params;
  if (!isCityId(city)) notFound();
  return cities[city];
}
