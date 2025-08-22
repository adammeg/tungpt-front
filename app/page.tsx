import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Zap, 
  Shield, 
  Users, 
  Brain, 
  Sparkles,
  Check,
  ArrowRight,
  Star,
  Globe,
  Lock,
  Clock
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Models",
      description: "Access to GPT-4o, GPT-4o Mini, and GPT-3.5 Turbo for powerful conversations"
    },
    {
      icon: Zap,
      title: "Real-time Streaming",
      description: "Experience ChatGPT-like streaming responses with live typing indicators"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with end-to-end encryption and data privacy"
    },
    {
      icon: Users,
      title: "Multi-user Support",
      description: "Perfect for teams and organizations with role-based access control"
    },
    {
      icon: MessageSquare,
      title: "Conversation History",
      description: "Advanced search, filtering, and analytics for all your conversations"
    },
    {
      icon: Sparkles,
      title: "Smart Features",
      description: "File uploads, conversation tagging, and intelligent insights"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      currency: "TND",
      period: "month",
      description: "Perfect for getting started",
      features: [
        "20 messages per month",
        "GPT-4o Mini access",
        "Basic conversation history",
        "Community support"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Basic",
      price: "30",
      currency: "TND",
      period: "month",
      description: "Great for regular users",
      features: [
        "100 messages per month",
        "All AI models access",
        "Advanced conversation features",
        "Priority support",
        "File uploads"
      ],
      popular: true,
      cta: "Start Basic Plan"
    },
    {
      name: "Premium",
      price: "60",
      currency: "TND",
      period: "month",
      description: "For power users and teams",
      features: [
        "1000 messages per month",
        "All AI models access",
        "Advanced analytics",
        "Priority support",
        "File uploads",
        "Team collaboration",
        "Custom integrations"
      ],
      popular: false,
      cta: "Start Premium Plan"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Messages Sent", value: "1M+" },
    { label: "Countries", value: "50+" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ChatGPT Clone</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by OpenAI GPT Models
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            The Future of AI Chat
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the power of advanced AI models with real-time streaming, 
            intelligent conversations, and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Chatting Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern AI Chat
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for intelligent conversations, collaboration, and productivity.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core features.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-600 shadow-xl' : 'border shadow-lg'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.currency}/{plan.period}</span>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Conversations?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the future of AI chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ChatGPT Clone</span>
              </div>
              <p className="text-muted-foreground">
                The future of AI chat is here. Experience intelligent conversations with advanced AI models.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ChatGPT Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
