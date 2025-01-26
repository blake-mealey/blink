// TODO: extract into standalone package (next-color-schemes)

import { NextConfig } from 'next';

export const SITE_PREFERENCE_COOKIE = '_color_scheme_site_preference';

export type ColorScheme = 'light' | 'dark';
export type SitePreference = ColorScheme | 'system';
export type SystemPreference = ColorScheme;

export function chooseColorScheme(
  sitePreference: SitePreference,
  systemPreference: SystemPreference
): ColorScheme {
  if (sitePreference === 'system') {
    return systemPreference;
  }
  return sitePreference;
}

const SCHEME_HEADERS = [
  {
    key: 'Accept-CH',
    value: 'Sec-CH-Prefers-Color-Scheme',
  },
  {
    key: 'Critical-CH',
    value: 'Sec-CH-Prefers-Color-Scheme',
  },
  {
    key: 'Vary',
    value: 'Sec-CH-Prefers-Color-Scheme',
  },
];

export function withColorSchemes(config: NextConfig): NextConfig {
  type Headers = Awaited<ReturnType<NonNullable<NextConfig['headers']>>>;

  const originalHeaders = config.headers;
  config.headers = async function ColorSchemesHeaders() {
    let headers: Headers = [];
    if (originalHeaders) {
      headers = await originalHeaders();
    }
    headers.push(
      {
        source: '/',
        headers: SCHEME_HEADERS,
      },
      {
        source: '/:path*',
        headers: SCHEME_HEADERS,
      }
    );
    return headers;
  };

  return config;
}
