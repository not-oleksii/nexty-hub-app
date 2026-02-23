export const GRADIENT_PALETTE = [
  // 1. Ocean Breeze (Blue -> Cyan -> Teal)
  {
    bg: '#3B82F6',
    gradient: ['#3B82F6', '#06B6D4', '#14B8A6'],
    text: '#FFFFFF',
  },
  // 2. Sunset Glow (Rose -> Orange -> Amber)
  {
    bg: '#F43F5E',
    gradient: ['#F43F5E', '#F97316', '#F59E0B'],
    text: '#FFFFFF',
  },
  // 3. Mystic Purple (Indigo -> Purple -> Pink)
  {
    bg: '#6366F1',
    gradient: ['#6366F1', '#A855F7', '#EC4899'],
    text: '#FFFFFF',
  },
  // 4. Emerald Dream (Teal -> Emerald -> Lime)
  {
    bg: '#14B8A6',
    gradient: ['#14B8A6', '#10B981', '#84CC16'],
    text: '#FFFFFF',
  },
  // 5. Fire & Ice (Violet -> Rose -> Orange)
  {
    bg: '#8B5CF6',
    gradient: ['#8B5CF6', '#F43F5E', '#F97316'],
    text: '#FFFFFF',
  },
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
