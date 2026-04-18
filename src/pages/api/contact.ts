import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message, website } = await request.json();

    // Honeypot — bots fill hidden fields
    if (website) {
      return json({ ok: true });
    }

    if (!name || !email || !message) {
      return json({ error: 'Missing required fields.' }, 400);
    }
    if (typeof message !== 'string' || message.length > 5000) {
      return json({ error: 'Message too long.' }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Invalid email.' }, 400);
    }

    // Forward to FormSubmit (no SMTP credentials needed, zero-config).
    // Replace with Resend / Postmark / SendGrid if you want full control.
    const formEndpoint = 'https://formsubmit.co/ajax/mistershilai@gmail.com';
    const res = await fetch(formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `New message from ${name} via mistershilai.com`,
        _template: 'table',
      }),
    });

    if (!res.ok) {
      return json({ error: 'Mail provider rejected the request.' }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ error: 'Unexpected error.' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
