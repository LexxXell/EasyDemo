export default {
  routes: [
    {
      method: 'GET',
      path: '/single-task/me',
      handler: 'user-single-task.me',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/single-task/trained',
      handler: 'user-single-task.trained',
      config: {
        policies: ['global::is-authenticated', 'global::rewardable'],
      },
    },
  ],
};
