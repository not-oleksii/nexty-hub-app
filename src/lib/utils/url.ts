export function isValidFromPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}
