import sgMail from '@sendgrid/mail';

import { keys } from '../../../keys';
import { type EmailPayload, type EmailProvider } from '../types';

class SendGridEmailProvider implements EmailProvider {
  private readonly from: string;

  constructor() {
    const from = keys().EMAIL_FROM;
    if (!from) {
      throw new Error('Missing EMAIL_FROM in environment configuration');
    }

    const apiKey = keys().EMAIL_SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Missing EMAIL_SENDGRID_API_KEY in environment configuration'
      );
    }
    sgMail.setApiKey(apiKey);

    this.from = from;
  }

  public async sendEmail(
    payload: EmailPayload
  ): Promise<sgMail.ClientResponse> {
    const [response] = await sgMail.send({
      from: this.from,
      to: payload.recipient,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo
    });
    return response;
  }
}

export default new SendGridEmailProvider();
