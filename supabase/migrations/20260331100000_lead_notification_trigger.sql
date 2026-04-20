-- Lead notification: sends an email via Resend whenever a new lead is captured.
--
-- SETUP (run once in the Supabase SQL Editor after pushing this migration):
--
--   SELECT vault.create_secret('resend_api_key',      'YOUR_RESEND_API_KEY');
--   SELECT vault.create_secret('notification_email',   'marte@sommevents.com');
--
-- Get a free Resend API key at https://resend.com (3,000 emails/month free).

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  api_key TEXT;
  notify_email TEXT;
  email_body TEXT;
BEGIN
  BEGIN
    SELECT decrypted_secret INTO api_key
    FROM vault.decrypted_secrets WHERE name = 'resend_api_key' LIMIT 1;

    SELECT decrypted_secret INTO notify_email
    FROM vault.decrypted_secrets WHERE name = 'notification_email' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
  END;

  IF api_key IS NULL THEN
    RETURN NEW;
  END IF;

  notify_email := COALESCE(notify_email, 'marte@sommevents.com');

  email_body :=
    '<div style="font-family:sans-serif;max-width:500px;">' ||
    '<h2 style="color:#4A5D4E;">New Lead from SommEvents Chatbot</h2>' ||
    '<table style="border-collapse:collapse;width:100%;">' ||
    '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Name</td>'        || '<td style="padding:8px 12px;">' || COALESCE(NEW.name, '—')                || '</td></tr>' ||
    '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Email</td>'       || '<td style="padding:8px 12px;">' || COALESCE(NEW.email, '—')               || '</td></tr>' ||
    '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Phone</td>'       || '<td style="padding:8px 12px;">' || COALESCE(NEW.phone, '—')               || '</td></tr>' ||
    '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Consultation</td>'|| '<td style="padding:8px 12px;">' || COALESCE(NEW.consultation_time, '—')   || '</td></tr>' ||
    '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Captured</td>'    || '<td style="padding:8px 12px;">' || COALESCE(NEW.captured_at::TEXT, '—')   || '</td></tr>' ||
    '</table>';

  IF NEW.context IS NOT NULL THEN
    email_body := email_body ||
      '<h3 style="color:#4A5D4E;margin-top:20px;">Conversation Context</h3>' ||
      '<table style="border-collapse:collapse;width:100%;">' ||
      '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Flow Path</td>'   || '<td style="padding:8px 12px;">' || COALESCE(array_to_string(ARRAY(SELECT jsonb_array_elements_text(NEW.context->'path')), ' → '), '—') || '</td></tr>' ||
      '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Intent Tags</td>' || '<td style="padding:8px 12px;">' || COALESCE(array_to_string(ARRAY(SELECT DISTINCT jsonb_array_elements_text(NEW.context->'tags')), ', '), '—') || '</td></tr>' ||
      '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Messages</td>'    || '<td style="padding:8px 12px;">' || COALESCE((NEW.context->>'messageCount'), '—') || '</td></tr>' ||
      '<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Duration</td>'    || '<td style="padding:8px 12px;">' || COALESCE((NEW.context->>'duration'), '—') || 's</td></tr>' ||
      '</table>';
  END IF;

  email_body := email_body || '</div>';

  BEGIN
    PERFORM extensions.http_post(
      url     := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || api_key,
        'Content-Type',  'application/json'
      ),
      body    := jsonb_build_object(
        'from',    'SommEvents Chatbot <onboarding@resend.dev>',
        'to',      jsonb_build_array(notify_email),
        'subject', 'New Lead: ' || COALESCE(NEW.name, 'Unknown'),
        'html',    email_body
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Lead notification email failed: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_lead_notify
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_lead();
