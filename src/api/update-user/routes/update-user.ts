export default {
  routes: [
    {
      method: 'PATCH',
      path: '/users/me',
      handler: 'update-user.update',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
