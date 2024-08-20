import { getRandomInt } from '../../../helpers/get-random-int.helper';
import { getRewardsConfig } from '../../helpers/get-rewards-config';
import { getTweetLink } from '../../helpers/get-tweet-link';
import { rewardUser } from '../../helpers/reward-user.helper';
import { firstSpinTwitterClient, firstSpinTwitterClientOAuth } from '../../twitter/constants';
import { getSpinInfo } from '../helpers/get-spin-info';
import { useSpins } from '../helpers/use-spins';

export default {
  async spin(ctx: any) {
    const user = ctx.state.user;

    const spinConfig = await strapi.entityService.findMany('api::spin.spin-config');

    const { availableSpins, flagFirstSpin } = await getSpinInfo(user);

    if (availableSpins === 0) {
      return ctx.badRequest('You have 0 (zero) available spins');
    }

    const rndFunc = getRndFunc(spinConfig);

    const points = getRandomInt(spinConfig.minSpinReward, spinConfig.maxSpinReward, rndFunc);

    try {
      await rewardUser(user, points, 'spin');
      await useSpins(user, 1);
    } catch (error) {
      console.error("Error updating user's spins or points:", error);
      return ctx.badRequest("Error updating user's spins or points");
    }

    if (flagFirstSpin) {
      const rewardUrl = getTweetLink(getFirstSpinMessage(points));
      return ctx.send({ points, rewardUrl }, 200);
    }

    ctx.send({ points }, 200);
  },
  async spinAll(ctx: any) {
    const user = ctx.state.user;

    const spinConfig = await strapi.entityService.findMany('api::spin.spin-config');

    const { availableSpins, flagFirstSpin } = await getSpinInfo(user);

    if (availableSpins === 0) {
      return ctx.badRequest('You have 0 (zero) available spins');
    }

    const rndFunc = getRndFunc(spinConfig);

    let points: number = 0;
    let spins: number[] = [];
    for (let i = availableSpins; i > 0; i--) {
      const reward = getRandomInt(spinConfig.minSpinReward, spinConfig.maxSpinReward, rndFunc);
      points += reward;
      spins.push(reward);
    }

    try {
      await rewardUser(user, points, 'spin');
      await useSpins(user);
    } catch (error) {
      console.error("Error updating user's spins or points (spinAll):", error);
      return ctx.badRequest("Error updating user's spins or points (spinAll)");
    }

    if (flagFirstSpin) {
      const rewardUrl = getTweetLink(getFirstSpinMessage(points));
      return ctx.send({ points, spins, rewardUrl }, 200);
    }

    ctx.send({ points, spins }, 200);
  },
  async get(ctx) {
    const user = ctx.state.user;
    const spinInfo = await getSpinInfo(user);
    return ctx.send(spinInfo, 200);
  },
  async firstSpinTweet(ctx) {
    try {
      const user = ctx.state.user;

      const { id, flagFirstSpin } = await getSpinInfo(user);

      if (!flagFirstSpin) {
        return ctx.badRequest('Does not meet the conditions');
      }

      const rewardsConfig = await getRewardsConfig();

      await rewardUser(user, rewardsConfig.pointsFirstSpinTweetReward, 'twitter');

      await strapi.entityService.update('api::spin.spin-user-data', id, {
        data: {
          flagFirstSpinReward: true,
        },
      });

      ctx.send({ result: 'success' }, 200);
    } catch (e) {
      console.log('firstSpinTweet: ', e);
    }
  },
};

export function getRndFunc(spinConfig): () => number {
  let rndFunc: () => number;
  try {
    rndFunc = eval(spinConfig.randomFunction);
    rndFunc();
  } catch (e) {
    console.log('Error in rndFunc. Replaced by Math.random.', e);
    rndFunc = Math.random;
  }
  return rndFunc;
}

function getFirstSpinMessage(points: number): string {
  return `Farming $EZX on the @EasyDemo airdrop?

I just got ${points} points from my spin on the #EasyDemoDrop`;
}
