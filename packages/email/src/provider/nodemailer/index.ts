import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { keys } from '../../../keys';
import { type EmailPayload, type EmailProvider } from '../types';
import { detectTransport, type NodemailerTransport } from './detect-transport';

class NodemailerEmailProvider implements EmailProvider {
  private readonly from: string;
  private readonly transport: NodemailerTransport;

  constructor() {
    const from = keys().EMAIL_FROM;
    if (!from) {
      throw new Error('Missing EMAIL_FROM in environment configuration');
    }

    this.from = from;
    this.transport = detectTransport();
  }

  public async sendEmail(
    payload: EmailPayload
  ): Promise<SMTPTransport.SentMessageInfo> {
    return await nodemailer.createTransport(this.transport).sendMail({
      from: this.from,
      to: payload.recipient,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo
    });
  }
}

export default new NodemailerEmailProvider();
