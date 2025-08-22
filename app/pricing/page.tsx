import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                20 messages per day
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Basic AI model
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Standard response time
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Community support
              </li>
            </ul>

            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              Get Started
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-purple-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-purple-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$20</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">For power users and professionals</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited messages
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced AI model
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority response time
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Chat history & export
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
            </ul>

            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Start Pro Trial</Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">For teams and organizations</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Everything in Pro
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Team collaboration
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Custom AI training
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                API access
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Dedicated support
              </li>
            </ul>

            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              Contact Sales
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently asked questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">
                Yes, Pro plan comes with a 7-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Do you offer refunds?</h3>
              <p className="text-gray-400">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
