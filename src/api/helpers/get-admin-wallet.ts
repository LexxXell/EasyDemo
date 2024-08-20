export function getAdminWallet(): string {
  const wallet = process.env.ADMIN_WALLET;
  if (!wallet) {
    throw new Error('ADMIN_WALLET not specified');
  }
  return process.env.ADMIN_WALLET.toLowerCase();
}
