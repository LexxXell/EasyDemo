import { getToken } from '../../invite-token/services/token-generator';

type InvitesTask = { name: string; amount: number; activations: number };

let cooldownTime = 0;
const cooldownMs = 100;

function validateInvitesTask(obj: any): obj is InvitesTask {
  const nameRegex = /^[a-zA-Z0-9]+$/; // Регулярное выражение для проверки наличия только букв и цифр

  return (
    typeof obj.name === 'string' &&
    nameRegex.test(obj.name) && // Проверка по регулярному выражению
    typeof obj.amount === 'number' &&
    typeof obj.activations === 'number'
  );
}

const link = 'https://easydrop.easyx.trade/';

const tokenLength = parseInt(process.env.INVITE_TOKEN_LENGTH) || 8;

export default {
  async create(ctx: any) {
    try {
      if (Date.now() < cooldownTime) {
        return ctx.badRequest('Cooldown');
      } else {
        cooldownTime = Date.now() + cooldownMs;
      }

      const user = ctx.state.user;

      const invitesTasks: InvitesTask[] = ctx.request.body;

      if (!Array.isArray(invitesTasks)) {
        return ctx.badRequest('Wrong data type.  [{ name: string; amount: number; activations: number }]');
      }

      if (!invitesTasks.every((task) => validateInvitesTask(task))) {
        return ctx.badRequest('Wrong data type.  [{ name: string; amount: number; activations: number }]');
      }

      const invites: Record<string, string[]> = {};

      for (const task of invitesTasks) {
        invites[task.name] = [];
        for (let i = 0; i < task.amount; i++) {
          const tokenString = await getToken(tokenLength);

          await strapi.entityService.create('api::invite-token.invite-token', {
            data: {
              user,
              token: tokenString,
              availableActivations: task.activations,
            },
          });

          invites[task.name].push(`${link}${tokenString}`);
        }
      }
      ctx.send(invites, 200);
    } catch (e) {
      console.log(e);
      ctx.send({ error: (e as Error).message }, 500);
    }
  },
};
