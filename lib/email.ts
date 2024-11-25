import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  react: JSX.Element;
}

export const sendEmail = async ({ to, subject, react }: SendEmailParams) => {
  try {
    const data = await resend.emails.send({
      from: "GOALYFT <notifications@goalyft.com>",
      to,
      subject,
      react,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};