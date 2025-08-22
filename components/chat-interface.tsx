"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Settings, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Bot,
  User,
  Sparkles,
  Wifi,
  WifiOff,
  MoreVertical,
  Download,
  Share2,
  Copy,
  Check,
  AlertCircle
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const { 
    currentConversation, 
    messages, 
    sending, 
    streaming, 
    aiTyping, 
    typingUsers,
    models,
    selectedModel,
    loading,
    sendMessage, 
    createConversation,
    updateConversationTitle, 
    deleteConversation,
    setSelectedModel,
    startTyping,
    stopTyping
  } = useChat();
  const { user } = useAuth();
  
  const [inputValue, setInputValue] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set title value when conversation changes
  useEffect(() => {
    if (currentConversation) {
      setTitleValue(currentConversation.title || "New Chat");
    }
  }, [currentConversation]);

  // Focus input when conversation loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentConversation]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue("");
    
    try {
      // If no conversation exists, create one automatically
      if (!currentConversation) {
        const newConversation = await createConversation("New Chat", selectedModel);
        if (newConversation) {
          // Wait a moment for the conversation to be set, then send the message
          setTimeout(async () => {
            try {
              await sendMessage(message, selectedModel);
            } catch (error) {
              toast.error("Failed to send message");
              setInputValue(message); // Restore message if failed
            }
          }, 100);
        } else {
          toast.error("Failed to create conversation");
          setInputValue(message); // Restore message if failed
        }
      } else {
        // Send message to existing conversation
        await sendMessage(message, selectedModel);
      }
    } catch (error) {
      toast.error("Failed to send message");
      setInputValue(message); // Restore message if failed
    }
  };

  // Static response function for now
  const getStaticResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm your AI assistant. How can I help you today?";
    }
    
    if (lowerMessage.includes("email") || lowerMessage.includes("meeting")) {
      return `Subject: Meeting Request

Dear [Recipient Name],

I hope this email finds you well. I am writing to request a meeting to discuss [specific topic or purpose].

I would appreciate if we could schedule a convenient time for both of us. Please let me know your availability for the upcoming week.

Looking forward to hearing from you.

Best regards,
[Your Name]`;
    }
    
    if (lowerMessage.includes("quantum") || lowerMessage.includes("computing")) {
      return "Quantum computing is a revolutionary technology that uses quantum mechanical phenomena like superposition and entanglement to process information. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or qubits that can exist in multiple states simultaneously. This allows them to solve certain complex problems much faster than traditional computers.";
    }
    
    if (lowerMessage.includes("paris") || lowerMessage.includes("trip")) {
      return "Here's a weekend trip plan for Paris:\n\n**Day 1:**\n- Morning: Eiffel Tower and Champ de Mars\n- Afternoon: Louvre Museum\n- Evening: Seine River cruise and dinner in Montmartre\n\n**Day 2:**\n- Morning: Notre-Dame Cathedral and Île de la Cité\n- Afternoon: Champs-Élysées and Arc de Triomphe\n- Evening: Dinner in Le Marais\n\n**Tips:**\n- Book tickets in advance for major attractions\n- Use the Metro for transportation\n- Try local cuisine like croissants and French wine";
    }
    
    if (lowerMessage.includes("python") || lowerMessage.includes("sort")) {
      return `Here's a Python function to sort a list:

\`\`\`python
def sort_list(lst, reverse=False):
    """
    Sort a list in ascending or descending order
    
    Args:
        lst: List to sort
        reverse: If True, sort in descending order
    
    Returns:
        Sorted list
    """
    return sorted(lst, reverse=reverse)

# Example usage:
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_numbers = sort_list(numbers)
print(sorted_numbers)  # [1, 1, 2, 3, 4, 5, 6, 9]

# Sort in descending order
desc_numbers = sort_list(numbers, reverse=True)
print(desc_numbers)  # [9, 6, 5, 4, 3, 2, 1, 1]
\`\`\``;
    }
    
    // Default response
    return `Thank you for your message: "${message}". I'm currently in demo mode with static responses. In the full version, I would provide a more detailed and contextual response to your query.`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Handle typing indicators
    if (e.target.value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleSaveTitle = async () => {
    if (!currentConversation) return;
    
    try {
      await updateConversationTitle(titleValue);
      setIsEditingTitle(false);
      toast.success("Title updated successfully");
    } catch (error) {
      toast.error("Failed to update title");
    }
  };

  const handleDeleteConversation = async () => {
    if (!currentConversation) return;
    
    if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      try {
        await deleteConversation(currentConversation._id);
        // router.push("/chat"); // Removed router dependency
        toast.success("Conversation deleted");
      } catch (error) {
        toast.error("Failed to delete conversation");
      }
    }
  };

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col h-full">
        {/* Welcome Screen */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-2xl mx-auto w-full">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">How can I help you today?</h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-8">
              I'm an AI assistant powered by OpenAI. Ask me anything!
            </p>
            
            {/* Quick Start Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 text-left justify-start"
                onClick={() => setInputValue("Write a professional email to schedule a meeting")}
              >
                <div>
                  <p className="font-medium text-sm sm:text-base">Write a professional email</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Schedule a meeting</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 text-left justify-start"
                onClick={() => setInputValue("Explain quantum computing in simple terms")}
              >
                <div>
                  <p className="font-medium text-sm sm:text-base">Explain quantum computing</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">In simple terms</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 text-left justify-start"
                onClick={() => setInputValue("Help me plan a weekend trip to Paris")}
              >
                <div>
                  <p className="font-medium text-sm sm:text-base">Plan a weekend trip</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">To Paris</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 text-left justify-start"
                onClick={() => setInputValue("Write a Python function to sort a list")}
              >
                <div>
                  <p className="font-medium text-sm sm:text-base">Write a Python function</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">To sort a list</p>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Input Area - Always visible */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-4xl mx-auto p-3 sm:p-4">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Message ChatGPT..."
                className="min-h-[60px] max-h-[200px] resize-none pr-12 text-sm sm:text-base"
                disabled={sending || loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sending || loading}
                size="sm"
                className="absolute right-2 bottom-2 h-8 w-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              ChatGPT can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Safety check for models - only show loading if we don't have any models at all
  if (!Array.isArray(models) || models.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading models...</p>
          <p className="text-xs text-muted-foreground mt-2">This should only take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {isEditingTitle ? (
                <div className="flex items-center space-x-2 w-full">
                  <Input
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSaveTitle()}
                    className="w-full max-w-xs sm:max-w-sm"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveTitle} className="flex-shrink-0">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsEditingTitle(false)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <h1 className="text-base sm:text-lg font-semibold truncate">
                    {currentConversation.title || "New Chat"}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingTitle(true)}
                    className="flex-shrink-0"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Model Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="text-xs"
                disabled={loading}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">
                  {Array.isArray(models) && models.length > 0 
                    ? models.find(m => m.id === selectedModel)?.name || selectedModel
                    : selectedModel
                  }
                </span>
                <span className="sm:hidden">Model</span>
              </Button>
              
              {showModelSelector && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {Array.isArray(models) && models.map((model) => (
                      <div
                        key={model.id}
                        className={`p-2 rounded cursor-pointer text-sm ${
                          selectedModel === model.id
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelSelector(false);
                        }}
                      >
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteConversation}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <p className="text-muted-foreground">Start a conversation by typing a message below.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex space-x-3 sm:space-x-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${
                  message.role === "user" ? "order-first" : ""
                }`}>
                  <Card className={`${
                    message.role === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-muted"
                  }`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
                        {message.role === "user" ? (
                          <p className="text-white">{message.content}</p>
                        ) : (
                          <div 
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ 
                              __html: message.content.replace(/\n/g, '<br>') 
                            }} 
                          />
                        )}
                      </div>
                      
                      {/* Message Actions */}
                      <div className={`flex items-center justify-between mt-3 text-xs ${
                        message.role === "user" ? "text-blue-100" : "text-muted-foreground"
                      }`}>
                        <span>{formatTimestamp(message.timestamp)}</span>
                        <div className="flex items-center space-x-2">
                          {message.role === "assistant" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.content, message._id)}
                                className="h-6 w-6 p-0"
                              >
                                {copiedMessageId === message._id ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Share2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* AI Typing Indicator */}
        {aiTyping && (
          <div className="flex space-x-3 sm:space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="p-3 sm:p-4 bg-muted">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="flex space-x-3 sm:space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <Card className="p-3 sm:p-4 bg-muted">
              <CardContent className="p-0">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3 sm:space-x-4">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="min-h-[60px] max-h-[200px] resize-none pr-12 text-sm sm:text-base"
                disabled={sending || streaming || loading}
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={sending || streaming}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || sending || streaming || loading}
              className="h-[60px] w-[60px] p-0 flex-shrink-0"
            >
              {sending || streaming ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Usage Info */}
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">
              {user?.usage.messagesThisMonth} / {user?.subscription.plan === 'free' ? 20 : user?.subscription.plan === 'basic' ? 100 : 1000} messages this month
            </span>
            <span className="flex-shrink-0 ml-2">
              Model: {Array.isArray(models) && models.length > 0 ? models.find(m => m.id === selectedModel)?.name || selectedModel : selectedModel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
