import { User } from '../../../../types/user';
// import { isBaseRewardRefTokens } from '../../../walletAudits/complex/base-reward-ref-tokens';
// import { processDepositReward } from '../../blast-deposit-reward/services/process-deposit-reward';
import { baseInviteTokenReward } from './first-creation';

export async function updateInviteTokenUserData(user: User) {
  const inviteTokenUserData = (
    await strapi.entityService.findMany('api::invite-token.invite-token-user-data', {
      filters: { user: { id: user.id } },
    })
  )[0];
  let availableTokenCount = inviteTokenUserData.availableTokenCount;
  if (availableTokenCount < baseInviteTokenReward && "(await isBaseRewardRefTokens(user.wallet))") {
    availableTokenCount = baseInviteTokenReward;
    await strapi.entityService.update('api::invite-token.invite-token-user-data', inviteTokenUserData.id, {
      data: { availableTokenCount },
    });
  }
  // await processDepositReward(user);
}
