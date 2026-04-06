// Supabase Edge Function: send-transcript
// Sends a formatted HTML email with the conversation transcript via Resend.
//
// SETUP:
//   supabase secrets set RESEND_API_KEY=re_XXXXX

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_URL = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, messages } = await req.json();

    if (!email || !messages?.length) {
      return new Response(JSON.stringify({ error: "email and messages are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = messages
      .map((m: { who: string; text: string }) => {
        const label = m.who === "bot" ? "SommEvents" : "You";
        const bg = m.who === "bot" ? "#f7f7f7" : "#fdf0f0";
        return `<tr><td style="padding:8px 12px;font-weight:600;color:#555;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;background:${bg};border-radius:6px;">${escapeHtml(m.text)}</td></tr>`;
      })
      .join("");

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#850003;">Your SommEvents Chat Transcript</h2>
        <p style="color:#666;font-size:14px;">Here's a copy of your conversation with the SommEvents assistant.</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">${rows}</table>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#999;font-size:12px;">SommEvents — Ontario's premier corporate event planning &amp; wine experience company.</p>
      </div>`;

    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SommEvents Chatbot <onboarding@resend.dev>",
        to: [email],
        subject: "Your SommEvents Chat Transcript",
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");
}
