export default {
  routes: [
    {
      method: 'GET',
      path: '/rewards-config',
      handler: 'rewards-config.get',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
