export default {
  routes: [
    {
      method: 'POST',
      path: '/tg-oauth',
      handler: 'tg-oauth.login',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
  ],
};
