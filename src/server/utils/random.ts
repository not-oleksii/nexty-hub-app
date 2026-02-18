const TITLES_POOL: string[] = [
  // Games
  'Dead by Daylight',
  'The Witcher 3: Wild Hunt',
  'Cyberpunk 2077',
  'It Takes Two',
  'Portal 2',
  'Hollow Knight',

  // Movies
  'The Matrix',
  'Inception',
  'Interstellar',
  'Dune: Part Two',
  'Spider-Man: Into the Spider-Verse',

  // Series
  'Breaking Bad',
  'Stranger Things',
  'The Office',
  'Arcane',
  'Severance',

  // Books
  '1984',
  'The Hobbit',
  'Project Hail Mary',
  'Foundation',
];

export function getRandomItem<T>(items: T[]): T | null {
  if (!items || items.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * items.length);

  return items[randomIndex];
}

export function getRandomTitle(): string {
  return getRandomItem(TITLES_POOL) ?? 'Unknown';
}

export function getRandomizedArray<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function getArrayOfRandomItems<T>(items: T[], count: number): T[] {
  if (!items || items.length === 0) return [];

  const filledArray = Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * items.length);

    return items[randomIndex];
  });

  return getRandomizedArray(filledArray);
}
