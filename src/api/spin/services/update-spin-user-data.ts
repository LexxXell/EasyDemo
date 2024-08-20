import { User } from '../../../../types/user';
import { getSpinSpeed } from '../../../helpers/getSpinSpeed';
import { firstCreateSpinUserData } from './first-creation';

export async function updateSpinUserData(user: User) {
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
  const speed = await getSpinSpeed(user.wallet);
  await strapi.entityService.update('api::spin.spin-user-data', spinUserData.id, { data: { speed } });
}
