export function normalizeAvatarUrl(filepath: string): string {
  return filepath.split('public/')[1] || filepath;
}
