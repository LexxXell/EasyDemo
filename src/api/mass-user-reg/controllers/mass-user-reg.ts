import uuid4 from 'uuid4';
import { User } from '../../../../types/user';
import { getAdminWallet } from '../../helpers/get-admin-wallet';
import { firstCreateInviteTokenUserData } from '../../invite-token/services/first-creation';
import { firstCreateSpinUserData } from '../../spin/services/first-creation';
import { firstCreateUserSingleTask } from '../../user-single-task/services/first-creation';
// import { processDepositReward } from '../../blast-deposit-reward/services/process-deposit-reward';
import { addBonusSpin } from '../../spin/services/add-bonus-spin';

let cooldownTime = 0;
const cooldownMs = 100;

function validateEthWalletArray(arr: any[]): arr is string[] {
  if (!Array.isArray(arr)) {
    return false;
  }

  const ethWalletRegex = /(^0x[a-fA-F0-9]{40}$)/; // Регулярное выражение для проверки кошелька Ethereum

  return arr.every((item) => ethWalletRegex.test(item));
}

export default {
  async register(ctx: any) {
    try {
      if (Date.now() < cooldownTime) {
        return ctx.badRequest('Cooldown');
      } else {
        cooldownTime = Date.now() + cooldownMs;
      }

      const wallets: string[] = ctx.request.body;

      if (!validateEthWalletArray(wallets)) {
        return ctx.badRequest('Wrong wallets array');
      }

      const referrer = (
        await strapi.entityService.findMany('plugin::users-permissions.user', { filters: { wallet: getAdminWallet() } })
      )[0];

      if (!referrer) {
        throw new Error('No Admin wallet register!');
      }

      const report = {
        new_users_count: 0,
        updated_users_count: 0,
      };

      for (let wallet of wallets) {
        wallet = wallet.toLowerCase();
        const user = (
          await strapi.entityService.findMany('plugin::users-permissions.user', { filters: { wallet } })
        )[0];
        if (!user) {
          await createUser(wallet, referrer);
          report.new_users_count++;
        } else {
          await addBonusSpin(user);
          report.updated_users_count++;
        }
      }

      ctx.send({ status: 'OK', report }, 200);
    } catch (e) {
      console.log(e);
      ctx.send({ error: (e as Error).message }, 500);
    }
  },
};

async function createUser(wallet: string, referrer: User) {
  const user = await strapi.plugins['users-permissions'].services.user.add({
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

  await firstCreateInviteTokenUserData(user);
  await firstCreateSpinUserData(user);
  await firstCreateUserSingleTask(user);
  // await processDepositReward(user);
}
