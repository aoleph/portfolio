// functions/api/contact.js
// Cloudflare Pages Function — obsługuje POST /api/contact
// Wymaga zmiennej środowiskowej RESEND_API_KEY ustawionej w:
// Cloudflare Pages > Twój projekt > Settings > Environment variables (jako Secret)

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json({ error: "Ungültige Anfrage." }, 400);
  }

  const name = (data.name || "").toString().trim();
  const email = (data.email || "").toString().trim();
  const message = (data.message || "").toString().trim();

  // podstawowa walidacja
  if (!name || !email || !message) {
    return json({ error: "Bitte alle Felder ausfüllen." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Ungültige E-Mail-Adresse." }, 400);
  }
  // proste zabezpieczenie przed nadużyciem (limit długości)
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return json({ error: "Eingabe zu lang." }, 400);
  }

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
    <p><strong>Nachricht:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // "from" musi być z domeny zweryfikowanej w Resend.
        // Dopóki domena nie jest zweryfikowana, użyj: "onboarding@resend.dev"
        from: "Kontaktformular <kontakt@adamolendzki.com>",
        to: "aolendzki.photo@gmail.com",
        reply_to: email,
        subject: `Neue Anfrage von ${name}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend error:", errText);
      return json({ error: "Senden fehlgeschlagen." }, 502);
    }

    return json({ success: true }, 200);
  } catch (err) {
    console.error("Contact form error:", err);
    return json({ error: "Unerwarteter Fehler." }, 500);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
