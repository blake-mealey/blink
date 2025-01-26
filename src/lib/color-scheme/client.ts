'use client';

import { useEffect, useState } from 'react';
import {
  SITE_PREFERENCE_COOKIE,
  ColorScheme,
  SitePreference,
  SystemPreference,
  chooseColorScheme,
} from './lib';

const COLOR_SCHEME_CHANGED_EVENT = 'color_scheme_changed';

function setColorScheme(scheme: ColorScheme) {
  if (scheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  window.dispatchEvent(
    new CustomEvent(COLOR_SCHEME_CHANGED_EVENT, {
      detail: scheme,
    })
  );
}

export function subscribeToColorSchemeChanged(
  cb: (scheme: ColorScheme) => void
) {
  function onEvent(event: CustomEvent) {
    const scheme = event.detail;
    if (scheme === 'light' || scheme === 'dark') {
      cb(scheme);
    }
  }

  // @ts-expect-error custom event
  window.addEventListener(COLOR_SCHEME_CHANGED_EVENT, onEvent);
  return () => {
    // @ts-expect-error custom event
    window.removeEventListener(COLOR_SCHEME_CHANGED_EVENT, onEvent);
  };
}

function clientSitePreference(): SitePreference {
  const cookies = decodeURIComponent(document.cookie).split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=', 2);
    if (name === SITE_PREFERENCE_COOKIE) {
      if (value !== 'dark' && value !== 'light') {
        return 'system';
      }
      return value;
    }
  }
  return 'system';
}

export function setClientSitePreference(sitePreference: SitePreference) {
  document.cookie = `${SITE_PREFERENCE_COOKIE}=${sitePreference}; path=/; max-age=${
    60 * 60 * 24 * 365 * 1
  }`;
  const systemPreference = clientSystemPreference();
  const scheme = chooseColorScheme(sitePreference, systemPreference);
  setColorScheme(scheme);
}

function clientSystemPreference(): SystemPreference {
  const query = matchMedia('(prefers-color-scheme: dark)');
  return query.matches ? 'dark' : 'light';
}

export function clientColorScheme(): ColorScheme {
  const sitePreference = clientSitePreference();
  const systemPreference = clientSystemPreference();
  return chooseColorScheme(sitePreference, systemPreference);
}

export function ColorSchemes() {
  useEffect(() => {
    function update(dark: boolean) {
      const sitePreference = clientSitePreference();
      const systemPreference: ColorScheme = dark ? 'dark' : 'light';
      const scheme = chooseColorScheme(sitePreference, systemPreference);
      setColorScheme(scheme);
    }

    function onChange(event: MediaQueryListEvent) {
      update(event.matches);
    }

    const query = matchMedia('(prefers-color-scheme: dark)');
    update(query.matches);

    query.addEventListener('change', onChange);

    return () => query.removeEventListener('change', onChange);
  }, []);

  return null;
}

export function useColorScheme() {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    // if (typeof window === 'undefined') {
    //   // todo: return server theme?
    //   return 'light';
    // }
    return clientColorScheme();
  });

  useEffect(() => {
    return subscribeToColorSchemeChanged(setScheme);
  }, []);

  return scheme;
}
