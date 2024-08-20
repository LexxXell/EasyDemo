import { getRndFunc } from '../api/spin/controllers/spin';
import { getRandomInt } from './get-random-int.helper';

export async function randomPointsFactory(): Promise<() => number> {
  const spinConfig = await strapi.entityService.findMany('api::spin.spin-config');
  const rndFunc = getRndFunc(spinConfig);
  console.log(`\nInitialize randomPointsFactory: min(${spinConfig.minSpinReward}) max(${spinConfig.maxSpinReward})\n`);
  return () => getRandomInt(spinConfig.minSpinReward, spinConfig.maxSpinReward, rndFunc);
}
