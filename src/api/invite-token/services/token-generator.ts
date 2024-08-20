import { generateRandomString } from '../helpers/get-random-string.helper';
import { FreeTokenError } from '../errors/free-token-error';

export async function getToken(length: number, genTries = 4, countTries: number = 0): Promise<string> {
  const token = generateRandomString(length).toUpperCase();

  if (countTries >= genTries) {
    throw new FreeTokenError('Unable to find a free referral token. Try again later.');
  }

  const tokenCount = await strapi.entityService.count('api::invite-token.invite-token', {
    filters: {
      token,
      usedAt: null,
    },
  });

  return !tokenCount ? token : await getToken(length, genTries, countTries + 1);
}
