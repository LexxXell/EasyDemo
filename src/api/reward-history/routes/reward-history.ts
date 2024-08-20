export default {
  routes: [
    {
      method: 'GET',
      path: '/reward-history',
      handler: 'reward-history-updates.get',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/reward-history',
      handler: 'reward-history-updates.read',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
