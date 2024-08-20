import { RatelimitConfig } from '../../../policies/ratelimit';
import { getAdminWallet } from '../../helpers/get-admin-wallet';

const configRL: RatelimitConfig = {
  cooldownMs: 6000,
  endpointName: 'create-ex-invites',
};

const wallet = getAdminWallet();

export default {
  routes: [
    {
      method: 'POST',
      path: '/create-ex-invites',
      handler: 'create-invites.create',
      config: {
        policies: [
          'global::is-authenticated',
          { name: 'global::is-auth-wallet', config: { wallet } },
          { name: 'global::ratelimit', config: configRL },
        ],
      },
    },
  ],
};
