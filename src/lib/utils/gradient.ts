export const GRADIENT_PALETTE = [
  { bg: '#3B82F6', gradient: ['#60A5FA', '#1D4ED8'], text: '#FFFFFF' },
  { bg: '#22C55E', gradient: ['#4ADE80', '#15803D'], text: '#FFFFFF' },
  { bg: '#F97316', gradient: ['#FDBA74', '#C2410C'], text: '#111827' },
  { bg: '#A855F7', gradient: ['#C084FC', '#6D28D9'], text: '#FFFFFF' },
  { bg: '#14B8A6', gradient: ['#5EEAD4', '#0F766E'], text: '#0F172A' },
  { bg: '#F43F5E', gradient: ['#FDA4AF', '#BE123C'], text: '#111827' },
] as const;

export function pickGradientPalette(
  seed: string,
): (typeof GRADIENT_PALETTE)[number] {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * 17) % 9973;
  }

  return GRADIENT_PALETTE[hash % GRADIENT_PALETTE.length];
}
