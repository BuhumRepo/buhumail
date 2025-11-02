# Buhumail - Professional Email Service

A modern, professional email service built for Cloudflare Pages, Workers, and D1 database. Features temporary email addresses with custom domain support and self-destructive notes similar to Privnote.

## Features

- 🔐 **User Authentication** - Secure registration and login system
- 📧 **Temp Mail Service** - Create disposable email addresses with custom domains
- 🔗 **Custom Domain Support** - Connect and verify your own domains
- 💥 **Self-Destructive Notes** - Send secure messages that disappear after reading (like Privnote)
- 💬 **Reply Functionality** - Recipients can reply to secure notes
- 🎨 **Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS
- ⚡ **Cloudflare Powered** - Fast, global deployment with Workers and D1

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide Icons

### Backend
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- Email Workers (for email routing)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Cloudflare account
- Wrangler CLI

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Create D1 database:
```bash
wrangler d1 create buhumail-db
```

4. Update `wrangler.toml` with your D1 database ID from the previous command

5. Run migrations:
```bash
wrangler d1 migrations apply buhumail-db --local
```

### Development

1. Start the Vite dev server (frontend):
```bash
npm run dev
```

2. In a separate terminal, start the Workers dev server (backend):
```bash
npm run worker:dev
```

3. Open your browser to `http://localhost:3000`

## Deployment

### Deploy to Cloudflare

1. **Build the frontend:**
```bash
npm run build
```

2. **Deploy the frontend to Cloudflare Pages:**
```bash
npm run deploy
```

3. **Deploy the Worker:**
```bash
npm run worker:deploy
```

4. **Run database migrations on production:**
```bash
wrangler d1 migrations apply buhumail-db
```

### Email Routing Setup

To enable email receiving for temp mail:

1. Go to Cloudflare Dashboard → Email Routing
2. Add your verified domain
3. Configure email routes to forward to your Worker
4. Update the `wrangler.toml` email bindings

### Custom Domain DNS Setup

For users connecting custom domains, they need to add:

1. **MX Record:**
   - Type: MX
   - Name: @
   - Value: mx.buhumail.com
   - Priority: 10

2. **Verification TXT Record:**
   - Type: TXT
   - Name: @
   - Value: buhumail-verify={domain_id}

## Project Structure

```
buhumail/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── worker/                # Cloudflare Worker backend
│   ├── routes/            # API route handlers
│   ├── utils/             # Worker utilities
│   ├── index.ts           # Worker entry point
│   ├── types.ts           # TypeScript types
│   └── email.ts           # Email handler
├── migrations/            # D1 database migrations
├── public/                # Static assets
├── wrangler.toml          # Cloudflare configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies

```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Domains
- `GET /api/domains` - List user domains
- `POST /api/domains` - Add new domain
- `POST /api/domains/:id/verify` - Verify domain
- `DELETE /api/domains/:id` - Delete domain

### Temp Emails
- `GET /api/temp-emails` - List temp emails
- `POST /api/temp-emails` - Create temp email
- `DELETE /api/temp-emails/:id` - Delete temp email

### Notes
- `GET /api/notes` - List user's notes
- `POST /api/notes` - Create new note
- `POST /api/notes/:id/view` - View note (public)
- `POST /api/notes/:id/reply` - Reply to note (public)
- `GET /api/notes/:id/replies` - Get note replies
- `DELETE /api/notes/:id` - Delete note

### Messages
- `GET /api/messages/email/:id` - Get messages for temp email
- `GET /api/messages/:id` - Get single message
- `POST /api/messages/:id/read` - Mark message as read

## Features in Detail

### Temporary Email Service

1. Users can connect their custom domains
2. Verify domain ownership via DNS records
3. Create unlimited temporary email addresses
4. Set expiration times for emails
5. Receive and manage incoming messages

### Self-Destructive Notes

1. Create secure notes with optional password protection
2. Notes can self-destruct after being read
3. Recipients can reply to notes
4. Senders can view all replies in their dashboard
5. Share notes via generated unique URLs

## Security

- Passwords are hashed using SHA-256
- Session-based authentication with tokens
- CORS enabled for API access
- Input validation on all endpoints
- SQL injection prevention via prepared statements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using Cloudflare's edge platform
