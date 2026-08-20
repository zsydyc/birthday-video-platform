import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "zsyoscar@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "BirthdayVid <onboarding@resend.dev>";

interface OrderNotificationParams {
  orderId: string;
  userEmail: string;
  userName: string;
  templateName: string;
  category: string;
  formData: Record<string, unknown>;
}

export async function sendAdminOrderNotification(params: OrderNotificationParams) {
  if (!resend) return; // no-op in dev if key not set

  const { orderId, userEmail, userName, templateName, category, formData } = params;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `🎂 New Order — ${templateName} (${category})`,
    html: `
      <h2>New order received on BirthdayVid</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px">
        <tr><td style="padding:8px;color:#888">Order ID</td><td style="padding:8px;font-family:monospace">${orderId}</td></tr>
        <tr><td style="padding:8px;color:#888">Customer</td><td style="padding:8px">${userName} (${userEmail})</td></tr>
        <tr><td style="padding:8px;color:#888">Template</td><td style="padding:8px">${templateName}</td></tr>
        <tr><td style="padding:8px;color:#888">Category</td><td style="padding:8px">${category}</td></tr>
        <tr><td style="padding:8px;color:#888">Subject name</td><td style="padding:8px">${formData.subjectName ?? "—"}</td></tr>
        <tr><td style="padding:8px;color:#888">Age</td><td style="padding:8px">${formData.age ?? "—"}</td></tr>
        <tr><td style="padding:8px;color:#888">Occasion</td><td style="padding:8px">${formData.occasion ?? "—"}</td></tr>
        <tr><td style="padding:8px;color:#888">Message</td><td style="padding:8px">${formData.blessingMessage ?? "—"}</td></tr>
      </table>
      <p style="margin-top:24px">
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/en/admin" style="background:#FF6B8A;color:white;padding:10px 20px;border-radius:999px;text-decoration:none;font-weight:600">
          View in Admin Dashboard →
        </a>
      </p>
    `,
  }).catch(console.error);
}

export async function sendUserOrderConfirmation(params: {
  orderId: string;
  userEmail: string;
  userName: string;
  templateName: string;
}) {
  if (!resend) return;

  const { orderId, userEmail, userName, templateName } = params;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject: `🎉 Your BirthdayVid order is confirmed!`,
    html: `
      <h2>Hi ${userName}, your order is in!</h2>
      <p>We've received your order for <strong>${templateName}</strong> and our team is on it.</p>
      <p style="font-family:monospace;background:#FFF8F2;padding:12px;border-radius:8px">Order ID: ${orderId}</p>
      <h3>What happens next?</h3>
      <ol>
        <li>Our team reviews your details</li>
        <li>We craft your personalised video (usually within 24 hours)</li>
        <li>You'll receive a preview link to approve</li>
      </ol>
      <p>Questions? Reply to this email and we'll get back to you.</p>
      <p style="color:#888;font-size:12px">— The BirthdayVid Team 🎂</p>
    `,
  }).catch(console.error);
}
