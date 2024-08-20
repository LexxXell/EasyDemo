export default {
  routes: [
    {
      method: 'GET',
      path: '/leaderboard',
      handler: 'leaderboard.get',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/leaderboard/me',
      handler: 'leaderboard.me',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
