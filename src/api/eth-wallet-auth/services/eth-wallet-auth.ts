import jwt from 'jsonwebtoken';
import { EthereumAuthObject } from '../@types/eth-auth-obj.types';
import { ethers } from 'ethers';

export function getJWT(id: number): string {
  const secret: string = process.env.JWT_SECRET;
  const expiresIn: string = process.env.JWT_EXPIRES_IN || '1d';
  if (!secret) {
    throw new Error('JWT_SECRET not specified');
  }
  const jwtToken: string = jwt.sign({ id }, secret, {
    expiresIn,
  });

  return jwtToken;
}

export function validateWalletSign(
  authObj: EthereumAuthObject,
  msgBase: string = 'AUTH',
  roundMs: number = 600000,
): boolean {
  try {
    const { wallet, signature }: EthereumAuthObject = authObj;
    if (!wallet || !signature) {
      console.error('Wallet or signature is missing');
      return false;
    }
    const msg = msgBase + (Math.ceil(Date.now() / roundMs) * roundMs).toString();
    const recoveredAddress = ethers.verifyMessage(msg, signature);
    if (recoveredAddress.toLowerCase() !== wallet.toLowerCase()) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
