import { cookies, headers } from 'next/headers';
import {
  chooseColorScheme,
  ColorScheme,
  SITE_PREFERENCE_COOKIE,
  SitePreference,
  SystemPreference,
} from './lib';

async function serverSitePreference(): Promise<SitePreference> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SITE_PREFERENCE_COOKIE)?.value;
  if (cookie !== 'light' && cookie !== 'dark') {
    return 'system';
  }
  return cookie;
}

async function serverSystemPreference(): Promise<SystemPreference> {
  const headersMap = await headers();
  const preference = headersMap.get('Sec-CH-Prefers-Color-Scheme');
  if (preference !== 'light' && preference !== 'dark') {
    return 'light';
  }
  return preference;
}

export async function serverColorScheme(): Promise<ColorScheme> {
  const [sitePreference, systemPreference] = await Promise.all([
    serverSitePreference(),
    serverSystemPreference(),
  ]);
  return chooseColorScheme(sitePreference, systemPreference);
}
