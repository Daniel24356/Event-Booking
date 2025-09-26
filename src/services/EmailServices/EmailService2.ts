import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { render } from '@react-email/render';
import sanitizeHtml from 'sanitize-html';
import ReactDOMServer from 'react-dom/server';
import juice from 'juice';
import dotenv from 'dotenv';
dotenv.config();


export default class EmailService2 {
  private transport: Transporter;

  constructor() {
    this.transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    });
  }

  public async sendEmail(to: string | string[], subject: string, template: React.ReactElement) {

    const reactHtml = ReactDOMServer.renderToString(template);
    const inlinedHtml = juice(reactHtml);

    const mailOptions: SendMailOptions = {
      from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USERNAME}>`,
      to,
      subject,
      html: inlinedHtml,
    };

    try {
      const result = await this.transport.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${subject}`);
      return { success: true, result };
    } catch (error: any) {
      console.error(`Failed to send email to ${to}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}