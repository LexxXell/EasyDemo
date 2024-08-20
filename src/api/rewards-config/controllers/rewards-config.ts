import { getRewardsConfig } from '../../helpers/get-rewards-config';

export default {
  async get(ctx) {
    ctx.send(await getRewardsConfig(), 200);
  },
};
