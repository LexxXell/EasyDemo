import uuid4 from 'uuid4';

export function getOAuthTgLink(botName: string, secret: string = uuid4()): { link: string; secret: string } {
  return { link: `https://t.me/${botName}?start=${secret}`, secret };
}
