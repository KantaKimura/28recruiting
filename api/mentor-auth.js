export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const expected = process.env.PORTAL_PASSWORD;

  if (!expected) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  if (password === expected) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
}
