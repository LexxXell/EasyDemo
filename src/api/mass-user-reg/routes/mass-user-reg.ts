import { RatelimitConfig } from '../../../policies/ratelimit';
import { getAdminWallet } from '../../helpers/get-admin-wallet';

const configRL: RatelimitConfig = {
  cooldownMs: 6000,
  endpointName: 'mass-user-reg',
};

const wallet = getAdminWallet();

export default {
  routes: [
    {
      method: 'POST',
      path: '/mass-user-reg',
      handler: 'mass-user-reg.register',
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
