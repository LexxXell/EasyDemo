import { User } from '../../../../types/user';
import { getAvailableSpins } from './get-available-spins';

const weekMs = 604_800_000;

type spinInfo = {
  id: number | string;
  availableSpins: number;
  msToNextSpin: number;
  spinTempPerWeek: number;
  flagFirstSpin?: boolean;
};

export async function getSpinInfo(user: User): Promise<spinInfo> {
  const spinUserData = (
    await strapi.entityService.findMany('api::spin.spin-user-data', {
      filters: { user: { id: user.id } },
      fields: ['lastSpinTimestamp', 'speed', 'bonusSpins', 'flagFirstSpinReward'],
    })
  )[0];
  if (!spinUserData) {
    return { id: null, availableSpins: 0, msToNextSpin: null, spinTempPerWeek: null };
  }

  const deltaTime = Date.now() - Number(spinUserData.lastSpinTimestamp);

  const availableSpins = getAvailableSpins(spinUserData);

  const msToNextSpin =
    deltaTime < 0
      ? 0
      : Math.ceil(
          1 / spinUserData.speed - (deltaTime - (availableSpins - spinUserData.bonusSpins || 0) / spinUserData.speed),
        );

  const spinTempPerWeek = Math.round(weekMs * spinUserData.speed * 10) / 10;

  if (!spinUserData.flagFirstSpinReward /*  && user.twitter */) {
    return { id: spinUserData.id, availableSpins, msToNextSpin, spinTempPerWeek, flagFirstSpin: true };
  }

  return { id: spinUserData.id, availableSpins, msToNextSpin, spinTempPerWeek };
}
