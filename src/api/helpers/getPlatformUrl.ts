export function getPlatformURL(): string {
  return process.env.PLATFORM_API_URL || 'https://api.studio.thegraph.com/query/36008/easyx-v3/version/latest';
}
