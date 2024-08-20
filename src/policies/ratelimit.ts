import { User } from '../../types/user';
import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

type RatelimitErrorDetails = { policy?: string; errCode?: string; retryAfterMs: number };

class RatelimitError extends ApplicationError {
  constructor(retryAfterMs: number = 0) {
    super('Too many requests. Try later.');
    this.name = 'RatelimitError';
    this.details = { policy: 'ratelimit', errCode: 'RATE_LIMIT_ERROR', retryAfterMs };
    this.updateMessageWithRetryAfter();
  }

  updateMessageWithRetryAfter() {
    const { retryAfterMs } = this.details as RatelimitErrorDetails;
    const seconds = Math.ceil(retryAfterMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const retryAfterMessage = `${minutes} minute(s) ${remainingSeconds} second(s)`;
    this.message = `${this.message} Retry after ${retryAfterMessage}`;
  }
}

export type RatelimitConfig = {
  cooldownMs: number;
  endpointName: string;
};

type RatelimitLog = {
  id: number | string;
  userId: bigint | string;
  endpointName: string;
  lastRequestTimestamp: bigint | string;
};

export default async (policyContext, config: RatelimitConfig, { strapi }) => {
  const user = policyContext.state.user;
  if (!user) {
    return false;
  }
  const ratelimitLog = await getRatelimitLog(user, config);

  const deltaTime: number = Date.now() - Number(ratelimitLog.lastRequestTimestamp);

  if (deltaTime < config.cooldownMs) {
    throw new RatelimitError(config.cooldownMs - deltaTime);
  }

  await updateRatelimitLog(ratelimitLog);

  return true;
};

async function getRatelimitLog(user: User, config: RatelimitConfig): Promise<RatelimitLog> {
  let ratelimitLog: RatelimitLog = (
    await strapi.entityService.findMany('api::ratelimit-log.ratelimit-log', {
      filters: { userId: user.id, endpointName: config.endpointName },
    })
  )[0];

  if (!ratelimitLog) {
    ratelimitLog = await strapi.entityService.create('api::ratelimit-log.ratelimit-log', {
      data: {
        userId: user.id,
        endpointName: config.endpointName,
        lastRequestTimestamp: Date.now() - config.cooldownMs,
      },
    });
  }

  return ratelimitLog;
}

async function updateRatelimitLog(ratelimitLog: RatelimitLog) {
  strapi.entityService.update('api::ratelimit-log.ratelimit-log', ratelimitLog.id, {
    data: { lastRequestTimestamp: Date.now() },
  });
}
