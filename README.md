# EzyOS - Web-based Operating System

A modern web-based operating system with a Windows 11-inspired interface, built with React, TypeScript, and Tailwind CSS.

## Features

- 🖥️ Windows 11-inspired interface
- 🔒 User authentication system
- 🎨 Customizable desktop with wallpaper settings
- 📱 Responsive design for desktop and mobile
- 💾 Local storage for user data
- ☁️ Optional Supabase integration
- 🤖 AI-powered applications

## Applications

- 🌐 Web Browsers (Chrome & Firefox with Wayback Machine)
- 📂 File Explorer with drag & drop
- 💬 AI Chat Apps (ChatGPT, Gemini)
- 👥 AI Employee Manager
- 📝 Creative Writer
- 🎭 Joi - AI Companion
- 📺 YouTube Player
- 🏪 App Store
- ⚙️ Settings Manager

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A modern web browser

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ezy-os.git
   cd ezy-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## API Keys Setup

Configure the following API keys in the Settings app:

- OpenAI API Key (for ChatGPT)
- Google Gemini API Key
- Groq API Key
- ElevenLabs API Key (for Joi voice)

## Default Login

- Username: admin
- Password: admin

## Supabase Integration

To use Supabase instead of local storage:

1. Create a Supabase project
2. Copy your project URL and anon key
3. Add them to your `.env` file
4. Uncomment the Supabase configuration in `src/lib/supabase.ts`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.