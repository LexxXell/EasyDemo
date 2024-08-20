import { unlinkSync, writeFileSync } from 'node:fs';
import { normalizeAvatarUrl } from '../../helpers/normalize-avatar-url';
import { rewardSingleTask } from '../../user-single-task/services/reward-single-task';
import { sanitizeUser } from '../../helpers/sanitize-user';

type UserPatch = {
  name: string;
  wallet?: string;
  twitter?: string;
  telegram?: string;
  avatar: string;
};

export default {
  async update(ctx) {
    const user = ctx.state.user;

    let { name, wallet, twitter, telegram, avatar } = ctx.request.body as UserPatch;

    if (avatar) {
      try {
        avatar = await processAvatar(avatar);
        avatar = normalizeAvatarUrl(avatar);
      } catch (e) {
        return ctx.badRequest((e as Error).message);
      }
      try {
        unlinkSync(user.avatar);
      } catch {}
    }

    const userPatch: UserPatch = {
      name,
      // wallet,
      // twitter,
      // telegram,
      avatar,
    };

    try {
      const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: userPatch,
      });

      if (user.name !== updatedUser.name) {
        try {
          user.points = Number(user.points) + (await rewardSingleTask(user, 'IsProfileUpdatedUsername'));
        } catch (error) {
          console.error('Error reward IsProfileUpdatedUsername:', error);
        }
      }
      if (user.avatar !== updatedUser.avatar) {
        try {
          user.points = Number(user.points) + (await rewardSingleTask(user, 'IsProfileUpdatedAvatar'));
        } catch (error) {
          console.error('Error reward IsProfileUpdatedAvatar:', error);
        }
      }

      return { ...sanitizeUser(updatedUser), points: Number(user.points) };
    } catch (error) {
      console.error('Error updating user:', error);
      return ctx.badRequest('Error updating user');
    }
  },
};

async function processAvatar(avatar: string | undefined): Promise<string | undefined> {
  const urlPattern = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;

  if (!avatar || urlPattern.test(avatar)) {
    return avatar;
  }

  return saveAvatar(avatar);
}

function saveAvatar(base64Avatar: string): string {
  const dataUriPattern = /^data:image\/(\w+);base64,/;
  const matches = base64Avatar.match(dataUriPattern);

  if (!matches || matches.length !== 2) {
    throw new Error('Wrong image format');
  }

  const imageExtension = matches[1];
  const buffer = Buffer.from(base64Avatar.replace(dataUriPattern, ''), 'base64');

  const path = `public/avatars/avatar_${Date.now()}.${imageExtension}`;

  writeFileSync(path, buffer);

  return path;
}
