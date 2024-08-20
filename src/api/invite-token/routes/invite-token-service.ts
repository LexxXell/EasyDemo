import { RatelimitConfig } from '../../../policies/ratelimit';

const config: RatelimitConfig = {
  cooldownMs: 60000,
  endpointName: 'inviteTokens',
};

export default {
  routes: [
    {
      method: 'GET',
      path: '/invite/new',
      handler: 'invite-token-service.getNew',
      config: {
        policies: ['global::is-authenticated', { name: 'global::ratelimit', config }],
      },
    },
    {
      method: 'GET',
      path: '/invite',
      handler: 'invite-token-service.getAll',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
