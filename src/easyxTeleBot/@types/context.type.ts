import TelegrafI18n from 'telegraf-i18n';
import { TelegrafContext } from 'telegraf/typings/context';
import { User } from '../../../types/user';

export interface Chat {
  id: number;
  ChatID: string;
}

export type BotConfig = {
  ProjectName: string;
  ProjectSiteURL: string;
  AllChannelsSubscriptionReward: number;
  EveryGroupSubscriptionReward: number;
  tg_channels: Chat[];
  tg_groups: Chat[];
};

interface BotUser extends User {
  tgOAuthToken: string;
  tg_channels: Chat[];
  tg_groups: Chat[];
}

export type Context = TelegrafContext & { i18n: TelegrafI18n; botConfig: BotConfig; user: BotUser };
