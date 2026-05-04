import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { submitHostApplication } from "@/lib/data";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN = process.env.CONTACT_EMAIL || "";
const FROM = "AtollDrift Maldives <hello@atolldriftmaldives.com>";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.atoll || !body.contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save to Supabase
    const result = await submitHostApplication(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Send emails (non-blocking)
    try {
      // Only send to applicant if they gave an email address
      const applicantEmail = body.contact.includes("@") ? body.contact : null;
      const emails = [];

      if (applicantEmail) {
        emails.push(resend.emails.send({
          from: FROM,
          to: applicantEmail,
          subject: "Your AtollDrift submission received",
          html: hostConfirmationHtml({ fullName: body.fullName, atoll: body.atoll }),
        }));
      }

      if (ADMIN) {
        emails.push(resend.emails.send({
          from: FROM,
          to: ADMIN,
          subject: `New host application — ${body.fullName}`,
          html: hostAdminHtml(body),
        }));
      }

      if (emails.length) await Promise.all(emails);
    } catch (err) {
      console.error("[AtollDrift] Host email failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function hostConfirmationHtml({ fullName, atoll }: { fullName: string; atoll: string }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 20px;background:#FAF7F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table style="max-width:520px;width:100%;margin:0 auto;">
  <tr><td style="padding:0 0 24px;">
    <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#086675;">AtollDrift · Southern Maldives</p>
  </td></tr>
  <tr><td style="background:#ffffff;padding:36px;border-left:3px solid #C8960C;">
    <p style="margin:0 0 20px;font-size:22px;color:#022830;font-family:Georgia,serif;font-weight:600;">Hey ${fullName} 👋</p>
    <p style="margin:0 0 16px;font-size:15px;color:#1E5060;line-height:1.7;">
      Thank you for submitting your experience in <strong style="color:#022830;">${atoll}</strong>. We've received everything and will review it personally.
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#1E5060;line-height:1.7;">
      We'll get back to you within <strong style="color:#022830;">3 working days</strong>. If it looks like a good fit, we'll reach out to arrange a call and learn more about what you do.
    </p>
    <p style="margin:0;font-size:15px;color:#1E5060;line-height:1.7;">
      We don't list anything we haven't verified — so that call matters to us. Talk soon.
    </p>
  </td></tr>
  <tr><td style="padding:20px 0 0;">
    <p style="margin:0;font-size:12px;color:#1A4858;line-height:1.6;">AtollDrift · Huvadhu · Fuvahmulah · Addu</p>
  </td></tr>
</table>
</body></html>`;
}

function hostAdminHtml(body: Record<string, any>) {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 0;font-size:13px;color:#666;width:140px;vertical-align:top;">${label}</td><td style="padding:6px 0;font-size:13px;color:#022830;font-weight:600;">${value}</td></tr>` : "";
  return `<!DOCTYPE html><html><body style="margin:0;padding:20px;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
<table style="background:#fff;padding:28px;max-width:480px;width:100%;border-left:4px solid #C8960C;">
<tr><td>
  <p style="margin:0 0 20px;font-size:17px;font-weight:700;color:#022830;">New host application</p>
  <table style="width:100%;border-collapse:collapse;">
    ${row("Name", body.fullName)}
    ${row("Contact", body.contact)}
    ${row("Atoll", body.atoll)}
    ${row("Island", body.island || "")}
    ${row("Years there", body.yearsHere || "")}
    ${row("Category", body.category || "")}
    ${row("Experience", body.xpTitle || "")}
    ${row("Description", body.xpDescription || "")}
    ${row("Duration", body.duration || "")}
    ${row("Group size", body.groupSize || "")}
    ${row("Price/person", body.price ? `$${body.price}` : "")}
    ${row("Included", body.included || "")}
    ${row("Notes", body.notes || "")}
  </table>
  <p style="margin:20px 0 0;font-size:12px;color:#999;">Manage in admin → /admin → Host Applications</p>
</td></tr>
</table>
</body></html>`;
}
