import { Client, auth } from 'twitter-api-sdk';

export const authTwitterClientOAuth = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID as string,
  client_secret: process.env.TWITTER_CLIENT_SECRET as string,
  callback: process.env.TWITTER_CONNECT_CALLBACK as string,
  scopes: ['tweet.read', 'users.read', 'offline.access'],
});

export const firstSpinTwitterClientOAuth = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID as string,
  client_secret: process.env.TWITTER_CLIENT_SECRET as string,
  callback: process.env.TWITTER_FIRST_SPIN_CALLBACK as string,
  scopes: ['tweet.write', 'tweet.read', 'users.read'],
});

export const authTwitterClient = new Client(authTwitterClientOAuth);
export const firstSpinTwitterClient = new Client(firstSpinTwitterClientOAuth);
