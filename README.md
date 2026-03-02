# Buhumail - Professional Email Service

A modern, professional email service featuring temporary email addresses with custom domain support and self-destructive notes similar to Privnote.

## Features

- 🔐 **User Authentication** - Secure registration and login system
- 📧 **Temp Mail Service** - Create disposable email addresses with custom domains
- 🔗 **Custom Domain Support** - Connect and verify your own domains
- 💥 **Self-Destructive Notes** - Send secure messages that disappear after reading (like Privnote)
- 💬 **Reply Functionality** - Recipients can reply to secure notes
- 🎨 **Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS
- ⚡ **Fast & Secure** - Global deployment with enterprise-grade infrastructure

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/buhument/buhumail.git
cd buhumail
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

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
├── public/                # Static assets
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies
```

## Features in Detail

### Temporary Email Service

- Connect custom domains to receive emails
- Create unlimited temporary email addresses
- Set expiration times for emails
- Manage all incoming messages from one dashboard

### Self-Destructive Notes

- Create secure notes that self-destruct after reading
- Optional password protection for extra security
- Recipients can reply to notes
- View all replies in your dashboard
- Share notes via unique generated URLs

## Screenshots

Visit [buhumail.com](https://buhumail.com) to see the application in action.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ for secure and private communication

<!-- Last updated: 2026-03-02 -->
