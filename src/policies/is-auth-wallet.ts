export default (policyContext, config, { strapi }) => {
  const user = policyContext.state.user;
  if (user && user.wallet === config.wallet) {
    return true;
  }
  return false;
};
