export default {
  routes: [
    {
      method: 'GET',
      path: '/task',
      handler: 'weekly-task.getAll',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/task/:id',
      handler: 'weekly-task.get',
      config: {
        policies: ['global::is-authenticated', 'global::rewardable'],
      },
    },
  ],
};
