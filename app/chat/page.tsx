"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Settings, 
  LogOut, 
  User,
  Brain,
  Sparkles,
  Wifi,
  WifiOff,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { ChatInterface } from "@/components/chat-interface";

export default function ChatPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { 
    conversations, 
    currentConversation,
    loading: chatLoading,
    createConversation,
    loadConversation,
    isConnected
  } = useChat();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (currentConversation && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [currentConversation]);

  const handleCreateNewChat = async () => {
    const newConversation = await createConversation("New Chat");
    if (newConversation) {
      setShowNewChat(false);
    }
  };

  const filteredConversations = (conversations || []).filter(conv =>
    (conv.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 w-80 bg-muted/20 border-r flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold hidden sm:inline">ChatGPT Clone</span>
              <span className="font-semibold sm:hidden">Chat</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Offline</span>
                  </>
                )}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* New Chat Button */}
          <Button 
            onClick={handleCreateNewChat}
            className="w-full mb-4"
            disabled={chatLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Chat</span>
            <span className="sm:hidden">New</span>
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user.subscription.plan} Plan
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Usage Stats */}
          <div className="mt-3 p-3 bg-background rounded-lg">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span className="truncate">Messages this month</span>
              <span className="flex-shrink-0 ml-2">
                {user.usage.messagesThisMonth} / {user.subscription.plan === 'free' ? 20 : user.subscription.plan === 'basic' ? 100 : 1000}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((user.usage.messagesThisMonth / (user.subscription.plan === 'free' ? 20 : user.subscription.plan === 'basic' ? 100 : 1000)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {chatLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          ) : !conversations || filteredConversations.length === 0 ? (
            <div className="p-4 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateNewChat} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Start your first chat</span>
                  <span className="sm:hidden">Start chat</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                    currentConversation?._id === conversation._id
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => loadConversation(conversation._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conversation.title || "New Chat"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.messages?.length || 0} messages
                      </p>
                    </div>
                    {conversation.metadata?.tags && conversation.metadata.tags.length > 0 && (
                      <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                        {conversation.metadata.tags[0]}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="hidden sm:inline">Powered by OpenAI</span>
            <span className="sm:hidden">OpenAI</span>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">GPT-4o</span>
              <span className="sm:hidden">GPT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">ChatGPT Clone</span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        <ChatInterface />
      </div>
    </div>
  );
}
