import { User } from '../../../../types/user';
import { getSpinSpeed } from '../../../helpers/getSpinSpeed';

const bonusSpins = 1;

export type UserRegistrationReward = {
  spinSpeed: number;
};

export async function firstCreateSpinUserData(user: User): Promise<UserRegistrationReward> {
  const spinUserDataCount = await strapi.entityService.count('api::spin.spin-user-data', {
    filters: { user: { id: user.id } },
  });
  if (spinUserDataCount) {
    throw new Error('spinUserDataCount already exist');
  }

  const speed = await getSpinSpeed(user.wallet);

  await strapi.entityService.create('api::spin.spin-user-data', {
    data: {
      user,
      speed,
      lastSpinTimestamp: Date.now(),
      bonusSpins,
      flagFirstSpinReward: false,
    },
  });

  return { spinSpeed: speed };
}
