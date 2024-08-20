export default {
  routes: [
    {
      method: 'GET',
      path: '/spin',
      handler: 'spin.get',
      config: {
        policies: ['global::is-authenticated', 'global::rewardable'],
      },
    },
    {
      method: 'POST',
      path: '/spin',
      handler: 'spin.spin',
      config: {
        policies: ['global::is-authenticated', 'global::rewardable'],
      },
    },
    {
      method: 'POST',
      path: '/spin/all',
      handler: 'spin.spinAll',
      config: {
        policies: ['global::is-authenticated', 'global::rewardable'],
      },
    },
    {
      method: 'POST',
      path: '/first-spin-tweet',
      handler: 'spin.firstSpinTweet',
      config: {
        policies: ['global::is-authenticated', 'global::rewardable'],
      },
    },
  ],
};
