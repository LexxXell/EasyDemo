class StopRewardError extends Error {
  name: string;
  status: number;

  constructor(message = 'Rewards are no longer issued!') {
    super(message);
    this.name = 'StopRewardError';
    this.status = 400;
  }
}

export default (policyContext, config, { strapi }) => {
  if (process.env.STOP_REWARD) {
    throw new StopRewardError();
  }
  return true;
};
