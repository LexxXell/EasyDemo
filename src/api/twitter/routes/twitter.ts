export default {
  routes: [
    {
      method: 'POST',
      path: '/twitter/connect/callback',
      handler: 'twitter.connect_callback',
      config: {
        policies: ['global::rewardable'],
      },
    },
    {
      method: 'GET',
      path: '/twitter/connect',
      handler: 'twitter.connect',
      config: {
        policies: ['global::is-authenticated', 'global::rewardable'],
      },
    },
  ],
};
