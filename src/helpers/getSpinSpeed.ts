const defaultSpeed = 1 / 86_400_000;

export async function getSpinSpeed(
  address: string,
  speedPerEth: number = defaultSpeed,
  currency: string = 'usd',
): Promise<number> {
  return defaultSpeed;
}
