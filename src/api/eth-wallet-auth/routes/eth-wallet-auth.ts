export default {
  routes: [
    {
      method: 'POST',
      path: '/wallet-login',
      handler: 'eth-wallet-auth.login',
    },
  ],
};
