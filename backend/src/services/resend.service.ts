import { ResendServiceTypes } from "../types/resend.types";

export const resendService = async ({
  RESEND_API_KEY,
  textToSend,
  email,
}: ResendServiceTypes) => {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "harsh <onboarding@resend.dev>",
      to: [email],
      subject: "Forgot Password",
      html: `<strong>${textToSend}</strong>`,
    }),
  });
};
