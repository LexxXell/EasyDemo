export default {
  routes: [
    {
      method: 'GET',
      path: '/referrals',
      handler: 'referrals.get',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
