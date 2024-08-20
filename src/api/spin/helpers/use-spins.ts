import { User } from '../../../../types/user';
import { getAvailableSpins } from './get-available-spins';

export async function useSpins(user: User, amount: number = -1) {
  const spinUserData = (
    await strapi.entityService.findMany('api::spin.spin-user-data', {
      filters: { user: { id: user.id } },
      fields: ['lastSpinTimestamp', 'speed', 'bonusSpins'],
    })
  )[0];
  if (!spinUserData) {
    throw new Error('No Spin User Data');
  }
  const availableSpins = getAvailableSpins(spinUserData);
  let bonusSpins = spinUserData.bonusSpins || 0;
  amount = amount > availableSpins || amount < 0 ? availableSpins : amount;
  if (amount > spinUserData.bonusSpins || 0) {
    amount -= spinUserData.bonusSpins || 0;
    bonusSpins = 0;
  } else {
    bonusSpins -= amount;
    amount = 0;
  }
  const timeShift = spinUserData.speed ? Math.floor(amount / spinUserData.speed) : 0;
  await strapi.entityService.update('api::spin.spin-user-data', spinUserData.id, {
    data: {
      lastSpinTimestamp: Number(spinUserData.lastSpinTimestamp) + timeShift,
      bonusSpins,
    },
  });
}
