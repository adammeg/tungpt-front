import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  showChatLink?: boolean
}

export function Navigation({ showChatLink = false }: NavigationProps) {
  return (
    <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-sm bg-background/80 sticky top-0 z-40 border-b border-border/50">
      <Link href="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <span className="text-white font-semibold text-2xl tracking-tight">ChatAI</span>
      </Link>

      <div className="flex items-center space-x-2">
        {showChatLink && (
          <Link href="/chat">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 px-4 py-2 rounded-lg"
            >
              Chat
            </Button>
          </Link>
        )}
        <Link href="/pricing">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 px-4 py-2 rounded-lg"
          >
            Pricing
          </Button>
        </Link>
        <Link href="/login">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 px-4 py-2 rounded-lg"
          >
            Log in
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 px-6 py-2 rounded-lg font-medium">
            Sign up
          </Button>
        </Link>
      </div>
    </nav>
  )
}
