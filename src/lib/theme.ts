export const THEME_KEY = 'zakat:theme';

export type ThemePreference = 'light' | 'dark';

/**
 * Dijalankan inline di <head> sebelum render agar tidak ada kedipan tema.
 * Tanpa preferensi tersimpan, ikuti pengaturan sistem.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export function applyTheme(theme: ThemePreference) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Preferensi hanya berlaku untuk sesi ini.
  }
}
