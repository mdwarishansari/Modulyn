/**
 * server/src/lib/email/index.ts
 * Universal Email driver capable of utilizing Resend (primary) or local SMTP.
 */

import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "@config/env";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

const FROM_SYSTEM = "Modulyn <no-reply@modulyn.app>"; // Adjust dynamically to APP url if needed

const resendClient = env.EMAIL_PROVIDER === "resend" && env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

const smtpTransporter = env.EMAIL_PROVIDER === "smtp"
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  : null;

/**
 * Fires an email dispatch. Abstraction automatically routes to active provider.
 */
export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions) {
  if (resendClient) {
    const { data, error } = await resendClient.emails.send({
      from: FROM_SYSTEM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || "",
      replyTo: replyTo,
    });

    if (error) throw new Error(`[Resend Error]: ${error.message}`);
    return data;
  }

  if (smtpTransporter) {
    const info = await smtpTransporter.sendMail({
      from: FROM_SYSTEM,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
      text,
      replyTo,
    });
    return info;
  }

  // Fallback to console log in development if keys are utterly unconfigured
  if (env.isDevelopment) {
    console.log("=== EMAIL INTERCEPTED (NO PROVIDER CONFIGURED) ===");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(html);
    console.log("==================================================");
    return true;
  }

  throw new Error("No mail provider successfully configured for dispatching emails.");
}
