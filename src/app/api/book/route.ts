import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveBookingRequest } from "@/lib/data";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN = process.env.CONTACT_EMAIL || "";
const FROM = "AtollDrift Maldives <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, itemId, guestName, guestEmail, guestCount, preferredDate, notes } = body;

    if (!guestName || !guestEmail || !itemId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save to Supabase
    const result = await saveBookingRequest({
      type, itemId, guestName, guestEmail,
      guestCount: guestCount ?? 1, preferredDate, notes,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Send confirmation emails (non-blocking — booking is already saved if this fails)
    try {
      const emails = [
        resend.emails.send({
          from: FROM,
          to: guestEmail,
          subject: `Your AtollDrift request — ${itemId.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`,
          html: guestConfirmationHtml({ guestName, itemId, preferredDate }),
        }),
      ];
      if (ADMIN) {
        emails.push(resend.emails.send({
          from: FROM,
          to: ADMIN,
          subject: `New ${type} request — ${guestName}`,
          html: adminNotificationHtml({ guestName, guestEmail, type, itemId, guestCount: guestCount ?? 1, preferredDate, notes }),
        }));
      }
      await Promise.all(emails);
    } catch (err) {
      console.error("[AtollDrift] Email failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function guestConfirmationHtml({ guestName, itemId, preferredDate }: { guestName: string; itemId: string; preferredDate?: string }) {
  const journeyName = itemId.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const dateLine = preferredDate
    ? `<p style="margin:0 0 16px;font-size:15px;color:#1E5060;line-height:1.7;">Your requested arrival date is <strong style="color:#022830;">${preferredDate}</strong>.</p>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 20px;background:#FAF7F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table style="max-width:520px;width:100%;margin:0 auto;">
  <tr><td style="padding:0 0 24px;">
    <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#086675;">AtollDrift · Southern Maldives</p>
  </td></tr>
  <tr><td style="background:#ffffff;padding:36px;border-left:3px solid #0A7B8C;">
    <p style="margin:0 0 20px;font-size:22px;color:#022830;font-family:Georgia,serif;font-weight:600;">Hey ${guestName} 👋</p>
    <p style="margin:0 0 16px;font-size:15px;color:#1E5060;line-height:1.7;">
      We've got your request for <strong style="color:#022830;">${journeyName}</strong> — thank you for reaching out.
    </p>
    ${dateLine}
    <p style="margin:0 0 16px;font-size:15px;color:#1E5060;line-height:1.7;">
      We'll be in touch within <strong style="color:#022830;">24 hours</strong> to confirm your place and go over the details. No payment is needed until then.
    </p>
    <p style="margin:0;font-size:15px;color:#1E5060;line-height:1.7;">
      If you have any questions before we get back to you, just reply to this email.
    </p>
  </td></tr>
  <tr><td style="padding:20px 0 0;">
    <p style="margin:0;font-size:12px;color:#1A4858;line-height:1.6;">AtollDrift · Huvadhu · Fuvahmulah · Addu</p>
  </td></tr>
</table>
</body></html>`;
}

function adminNotificationHtml({ guestName, guestEmail, type, itemId, guestCount, preferredDate, departureId, notes }: {
  guestName: string; guestEmail: string; type: string; itemId: string;
  guestCount: number; preferredDate?: string; departureId?: number; notes?: string;
}) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;font-size:13px;color:#666;width:120px;">${label}</td><td style="padding:6px 0;font-size:13px;color:#022830;font-weight:600;">${value}</td></tr>`;
  return `<!DOCTYPE html><html><body style="margin:0;padding:20px;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
<table style="background:#fff;padding:28px;max-width:480px;width:100%;border-left:4px solid #0A7B8C;">
<tr><td>
  <p style="margin:0 0 20px;font-size:17px;font-weight:700;color:#022830;">New ${type} request</p>
  <table style="width:100%;border-collapse:collapse;">
    ${row("Name", guestName)}
    ${row("Email", `<a href="mailto:${guestEmail}" style="color:#0A7B8C;">${guestEmail}</a>`)}
    ${row("Journey", itemId)}
    ${row("Guests", String(guestCount))}
    ${preferredDate ? row("Date", preferredDate) : ""}
    ${notes ? row("Notes", notes) : ""}
  </table>
  <p style="margin:20px 0 0;font-size:12px;color:#999;">Manage in admin → /admin → Bookings</p>
</td></tr>
</table>
</body></html>`;
}
