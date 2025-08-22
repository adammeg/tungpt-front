# ChatGPT Clone Frontend

A modern, responsive frontend application for the ChatGPT Clone backend API. Built with Next.js, TypeScript, Tailwind CSS, and featuring real-time chat capabilities with Socket.IO.

## 🚀 Features

### 🔐 Authentication
- **User Registration & Login** - Secure authentication with JWT tokens
- **Profile Management** - Update user information and preferences
- **Password Management** - Change password functionality
- **Session Management** - Automatic token refresh and session handling

### 💬 Real-Time Chat
- **Live Message Streaming** - ChatGPT-like streaming responses
- **Typing Indicators** - Real-time typing indicators for users and AI
- **WebSocket Integration** - Socket.IO for instant communication
- **Message History** - Complete conversation history with search
- **Multiple AI Models** - Support for GPT-4o, GPT-4o Mini, and GPT-3.5 Turbo

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode** - Automatic theme switching with system preference
- **Smooth Animations** - Beautiful transitions and micro-interactions
- **Accessibility** - WCAG compliant with keyboard navigation
- **Professional Design** - Clean, modern interface inspired by ChatGPT

### 🔧 Advanced Features
- **Conversation Management** - Create, edit, delete, and organize conversations
- **Model Selection** - Choose between different AI models
- **Usage Tracking** - Monitor message limits and token usage
- **File Upload** - Support for file attachments (coming soon)
- **Export Options** - Export conversations in various formats
- **Search & Filter** - Advanced search through conversation history

### 🛡️ Security & Performance
- **Type Safety** - Full TypeScript implementation
- **Error Handling** - Comprehensive error handling and user feedback
- **Rate Limiting** - Built-in rate limiting and usage controls
- **Secure Communication** - HTTPS and secure WebSocket connections
- **Performance Optimized** - Fast loading and smooth interactions

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **State Management**: React hooks and context
- **Real-time**: Socket.IO client
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React icons

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Backend API server running (see backend README)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chatgpt-interface
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ChatGPT Clone

# Feature Flags
NEXT_PUBLIC_ENABLE_FILE_UPLOAD=true
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_SUBSCRIPTION=true
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
chatgpt-interface/
├── app/                    # Next.js App Router pages
│   ├── chat/              # Chat pages and components
│   ├── login/             # Authentication pages
│   ├── signup/            # Registration pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix)
│   ├── chat-interface.tsx # Main chat component
│   └── ...
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   └── useChat.ts        # Chat functionality hook
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   ├── socket.ts        # Socket.IO client
│   └── utils.ts         # Utility functions
├── styles/              # Additional styles
└── public/              # Static assets
```

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API through the `NEXT_PUBLIC_API_URL` environment variable. Make sure your backend server is running and accessible.

### Real-time Features
Socket.IO is used for real-time features. The connection is automatically established when users log in and handles:
- Message streaming
- Typing indicators
- Connection status
- Notifications

### Theme Configuration
The app supports both light and dark themes with automatic system preference detection. Theme configuration is handled by `next-themes`.

## 🎨 Customization

### Styling
The app uses Tailwind CSS with a custom design system. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `app/globals.css`

### Components
All UI components are built using Radix UI primitives for accessibility and customization. You can modify component behavior and styling in the `components/ui/` directory.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_APP_URL=https://your-frontend-app.com
NEXT_PUBLIC_APP_NAME=ChatGPT Clone
```

## 🔍 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and IntelliSense
- **Prettier**: Code formatting (configured with ESLint)

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:watch   # Run tests in watch mode
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use proper error handling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security

- JWT token authentication
- Secure WebSocket connections
- Input validation and sanitization
- XSS protection
- CSRF protection
- Rate limiting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the [Documentation](../../wiki)
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Socket.IO](https://socket.io/) - Real-time communication
- [OpenAI](https://openai.com/) - AI models and API
