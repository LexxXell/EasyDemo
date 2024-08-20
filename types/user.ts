export type User = {
  id: number | string;
  wallet?: string;
  points?: bigint | string;
  ReferrerWallet?: string;
  referrer?: User;
  twitter?: string;
};
