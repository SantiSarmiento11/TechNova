/**
 * TechNova IT Helpdesk - Lumina Support Design Tokens & Tailwind Configuration
 * Basado en la especificación de diseño frontend/stitch_technova/lumina_support/DESIGN.md
 */
export const luminaTailwindConfig = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#3525cd',
        'primary-container': '#4f46e5',
        'on-primary': '#ffffff',
        'on-primary-container': '#dad7ff',
        'primary-fixed': '#e2dfff',
        'primary-fixed-dim': '#c3c0ff',
        'on-primary-fixed': '#0f0069',
        'on-primary-fixed-variant': '#3323cc',
        'secondary': '#0051d5',
        'secondary-container': '#316bf3',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#fefcff',
        'secondary-fixed': '#dbe1ff',
        'secondary-fixed-dim': '#b4c5ff',
        'on-secondary-fixed': '#00174b',
        'on-secondary-fixed-variant': '#003ea8',
        'tertiary': '#005338',
        'tertiary-container': '#006e4b',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#67f4b7',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4edea3',
        'on-tertiary-fixed': '#002113',
        'on-tertiary-fixed-variant': '#005236',
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        'background': '#f8f9ff',
        'on-background': '#0b1c30',
        'surface': '#f8f9ff',
        'surface-dim': '#cbdbf5',
        'surface-bright': '#f8f9ff',
        'surface-variant': '#d3e4fe',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#464555',
        'outline': '#777587',
        'outline-variant': '#c7c4d8',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        code: ['"Plus Jakarta Sans"', 'monospace'],
      },
    },
  },
};

if (typeof window !== 'undefined' && window.tailwind) {
  window.tailwind.config = luminaTailwindConfig;
}
