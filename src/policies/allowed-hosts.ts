export default (policyContext, config, { strapi }) => {
  if (config.allowedHosts?.includes(policyContext.request?.host)) {
    return true;
  }
  console.log(policyContext.request?.host, config.allowedHosts);
  return false;
};
