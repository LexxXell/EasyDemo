import { User } from '../../../../types/user';
import { calculateWholeSpins } from '../helpers/calculate-whole-speed-spins';

export async function speedSpinsToBonusSpins(user: User) {
  let spinUserData = (
    await strapi.entityService.findMany('api::spin.spin-user-data', {
      filters: { user: { id: user.id } },
    })
  )[0];

  const spins = calculateWholeSpins(spinUserData);

  spinUserData = await strapi.entityService.update('api::spin.spin-user-data', spinUserData.id, {
    data: {
      lastSpinTimestamp: Date.now(),
      bonusSpins: spinUserData.bonusSpins + spins,
    },
  });
}
