import type SendmailTransport from 'nodemailer/lib/sendmail-transport';
import type SMTPConnection from 'nodemailer/lib/smtp-connection';

import { keys } from '../../../keys';

export type NodemailerTransport =
  | SendmailTransport.Options
  | SMTPConnection.Options
  | string;

export function detectTransport(): NodemailerTransport {
  const env = keys();

  if (env.EMAIL_NODEMAILER_URL) {
    try {
      const url = new URL(env.EMAIL_NODEMAILER_URL);
      const port = parseInt(url.port) || 25;
      const auth =
        url.username && url.password
          ? {
              user: decodeURIComponent(url.username),
              pass: decodeURIComponent(url.password)
            }
          : undefined;

      return {
        host: url.hostname,
        port,
        auth,
        secure: port === 465,
        tls: {
          rejectUnauthorized: false
        }
      };
    } catch (error) {
      console.error('Failed to parse EMAIL_NODEMAILER_URL:', error);
    }
  }

  // Fallback to sendmail if no URL is provided or if parsing fails
  return {
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail',
    secure: true
  };
}
