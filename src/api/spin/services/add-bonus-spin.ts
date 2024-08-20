import { User } from '../../../../types/user';
import { firstCreateSpinUserData } from './first-creation';

export async function addBonusSpin(user: User, bonusSpinAmount: number = 1) {
  let spinUserData = (
    await strapi.entityService.findMany('api::spin.spin-user-data', {
      filters: { user: { id: user.id } },
    })
  )[0];
  if (!spinUserData) {
    await firstCreateSpinUserData(user);
    spinUserData = (
      await strapi.entityService.findMany('api::spin.spin-user-data', {
        filters: { user: { id: user.id } },
      })
    )[0];
  }

  await strapi.entityService.update('api::spin.spin-user-data', spinUserData.id, {
    data: {
      bonusSpins: spinUserData.bonusSpins + bonusSpinAmount,
    },
  });
}
