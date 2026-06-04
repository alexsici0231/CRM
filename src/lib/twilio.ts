export async function sendSmsNotification(to: string, body: string) {
  // TODO: Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in Vercel env vars.
  console.info('[Twilio stub] SMS queued', { to, body });
  return { ok: true };
}

export async function sendReviewRequest(phone: string, locationName: string) {
  // TODO: Replace with a branded review request template once Twilio is connected.
  return sendSmsNotification(phone, `Thanks for visiting 365 Truck Repair ${locationName}. Please leave us a review.`);
}
