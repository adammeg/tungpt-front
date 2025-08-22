import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-semibold text-xl">ChatAI</span>
            </div>
            <p className="text-gray-400 text-sm">
              The most advanced AI chat interface for all your conversational needs.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/chat" className="text-gray-400 hover:text-white text-sm">
                  Chat
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white text-sm">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 ChatAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
