import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for notifications
  app.post('/api/notifications/new-user', async (req, res) => {
    const { displayName, email } = req.body;

    if (!resend) {
      console.warn('RESEND_API_KEY is not set. Email not sent.');
      return res.status(200).json({ status: 'ignored', message: 'No API key set' });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: 'StockFlow <onboarding@resend.dev>',
        to: ['kaalekelvin47@gmail.com'],
        subject: 'New User Joined StockFlow',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #334155;">
            <h1 style="color: #4f46e5;">New Team Member Alert!</h1>
            <p>A new user has just registered on your platform:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p><strong>Name:</strong> ${displayName}</p>
              <p><strong>Email:</strong> ${email}</p>
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #64748b;">You can manage user access in the Team Management tab of your dashboard.</p>
          </div>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ status: 'success', id: data?.id });
    } catch (err: any) {
      console.error('Server error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
