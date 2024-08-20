import { easyxTeleBot } from '../easyxTeleBot/easyxTeleBot';

export default (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      const { webhookPath } = config;
      if (ctx.request.url === webhookPath && ctx.request?.body) {
        await easyxTeleBot(ctx.request?.body);
        return ctx.send(null, 200);
      }
    } catch (error) {
      console.error(error);
      ctx.send(null, 200);
    } finally {
      await next();
    }
  };
};
