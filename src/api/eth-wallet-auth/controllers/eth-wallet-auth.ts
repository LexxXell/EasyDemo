import { GetReferrerResult, getReferrerUserByActiveInviteToken } from '../../helpers/get-referrer.helper';
import { EthereumAuthObject } from '../@types/eth-auth-obj.types';
import { getJWT, validateWalletSign } from '../services/eth-wallet-auth';
import uuid4 from 'uuid4';
import { firstCreateInviteTokenUserData } from '../../invite-token/services/first-creation';
// import { processDepositReward } from '../../blast-deposit-reward/services/process-deposit-reward';
import { setTokenIsUsed } from '../../invite-token/services/use-token';
import { firstCreateSpinUserData } from '../../spin/services/first-creation';
import { firstCreateUserSingleTask } from '../../user-single-task/services/first-creation';
import { sanitizeUser } from '../../helpers/sanitize-user';
import { updateSpinUserData } from '../../spin/services/update-spin-user-data';

export default {
  async login(ctx) {
    try {
      const { wallet: rawWallet, signature, token }: EthereumAuthObject = ctx.request.body;

      const wallet = rawWallet.toLowerCase();

      if (!wallet || !signature) {
        return ctx.badRequest('Wallet or signature not specified');
      }

      if (!process.env.NO_SIG_VAL && !validateWalletSign({ wallet, signature })) {
        return ctx.badRequest('Wallet or signature is wrong');
      }

      let user = (
        await strapi.entityService.findMany('plugin::users-permissions.user', {
          filters: { wallet },
        })
      )[0];

      let rewards;
      if (!user) {
        if (!token) {
          return ctx.badRequest('You need to provide a invite token');
        }

        const getReferrerResult: GetReferrerResult = await getReferrerUserByActiveInviteToken(token);
        if (getReferrerResult?.error) {
          return ctx.badRequest(getReferrerResult.error.message);
        }
        const referrer = getReferrerResult?.data?.referrer;
        if (!referrer) {
          return ctx.badRequest('Invite code doesn`t exist');
        }

        user = await strapi.plugins['users-permissions'].services.user.add({
          username: `User${wallet}`,
          name: `User${wallet}`,
          email: `${wallet}@noemail.noemail`,
          provider: 'local',
          password: uuid4(),
          ReferrerWallet: referrer.wallet,
          referrer,
          points: 0,
          role: 1,
          wallet,
          blocked: false,
          confirmed: true,
          created_by: 1, //user admin id
          updated_by: 1, //user admin id
        });
        rewards = await firstCreateInviteTokenUserData(user);
        rewards = { ...rewards, ...(await firstCreateSpinUserData(user)) };
        await firstCreateUserSingleTask(user);
        await setTokenIsUsed(referrer, user, token);
        // await processDepositReward(user);
      } else {
        await updateSpinUserData(user);
      }

      const jwt = getJWT(user.id as number);

      ctx.send({ jwt, user: sanitizeUser(user), rewards });
    } catch (e) {
      console.error(e);
      ctx.send({ error: 'Login ERROR' }, 500);
    }
  },
};
