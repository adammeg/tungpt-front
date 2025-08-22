import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient, { Conversation, Message, ChatMessage } from '@/lib/api';
import socketClient, { SocketEventHandlers } from '@/lib/socket';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  streaming: boolean;
  aiTyping: boolean;
  typingUsers: string[];
  models: Array<{ id: string; name: string; description: string; price: number }>;
  selectedModel: string;
  
  // Actions
  createConversation: (title?: string, model?: string) => Promise<Conversation | null>;
  loadConversation: (id: string) => Promise<void>;
  sendMessage: (message: string, model?: string) => Promise<void>;
  updateConversationTitle: (title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadModels: () => Promise<void>;
  setSelectedModel: (model: string) => void;
  
  // Real-time
  isConnected: boolean;
  joinConversation: (id: string) => void;
  leaveConversation: (id: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

export function useChat(): UseChatReturn {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [models, setModels] = useState<Array<{ id: string; name: string; description: string; price: number }>>([
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      description: 'Fast and efficient model for most tasks',
      price: 0.00015
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      description: 'Most capable model for complex tasks',
      price: 0.005
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Good balance of speed and capability',
      price: 0.0005
    }
  ]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const [isConnected, setIsConnected] = useState(false);
  
  const streamingMessageRef = useRef<string>('');
  const socketConnectedRef = useRef(false);

  // Initialize socket connection only when user is authenticated
  useEffect(() => {
    if (!user) {
      // Disconnect socket if user is not authenticated
      socketClient.destroy();
      setIsConnected(false);
      socketConnectedRef.current = false;
      return;
    }

    // Function to wait for token availability
    const waitForToken = (maxAttempts = 10, interval = 500) => {
      return new Promise<boolean>((resolve) => {
        let attempts = 0;
        
        const checkToken = () => {
          attempts++;
          const token = apiClient.getToken();
          
          if (token) {
            console.log('✅ Token found after', attempts, 'attempts');
            resolve(true);
            return;
          }
          
          if (attempts >= maxAttempts) {
            console.log('❌ Token not available after', maxAttempts, 'attempts');
            resolve(false);
            return;
          }
          
          console.log(`⏳ Token not available yet, attempt ${attempts}/${maxAttempts}`);
          setTimeout(checkToken, interval);
        };
        
        checkToken();
      });
    };

    // Function to attempt socket connection
    const attemptSocketConnection = () => {
      const token = apiClient.getToken();
      if (!token) {
        console.log('Token not available yet, will retry...');
        return false;
      }

      console.log('🔌 Connecting socket with token...');
      console.log('🔑 Token available:', token.substring(0, 10) + '...');
      
      const handlers: SocketEventHandlers = {
        onConnected: (data) => {
          setIsConnected(true);
          socketConnectedRef.current = true;
          console.log('Socket connected:', data);
        },
        onDisconnected: (data) => {
          setIsConnected(false);
          socketConnectedRef.current = false;
          console.log('Socket disconnected:', data);
        },
        onConnectionError: (error) => {
          setIsConnected(false);
          socketConnectedRef.current = false;
          console.error('Socket connection error:', error);
          // Only show error toast if it's not a token availability issue
          if (error.error !== 'No authentication token found') {
            toast.error('Real-time connection failed');
          }
        },
        onJoinedConversation: (data) => {
          console.log('Joined conversation:', data);
        },
        onMessageSent: (data) => {
          if (data.conversationId === currentConversation?._id) {
            setMessages(prev => [...prev, data.message]);
          }
        },
        onAITypingStart: (data) => {
          if (data.conversationId === currentConversation?._id) {
            setAiTyping(true);
          }
        },
        onAIStreamChunk: (data) => {
          if (data.conversationId === currentConversation?._id) {
            setStreaming(true);
            streamingMessageRef.current += data.chunk;
            
            // Update the last message with streaming content
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content = streamingMessageRef.current;
              }
              return newMessages;
            });
          }
        },
        onAIStreamComplete: (data) => {
          if (data.conversationId === currentConversation?._id) {
            setStreaming(false);
            setAiTyping(false);
            streamingMessageRef.current = '';
            
            // Update conversation with final message
            if (data.conversation) {
              setCurrentConversation(data.conversation);
              setConversations(prev => 
                prev.map(conv => 
                  conv._id === data.conversation._id ? data.conversation : conv
                )
              );
            }
          }
        },
        onAITypingStop: (data) => {
          if (data.conversationId === currentConversation?._id) {
            setAiTyping(false);
          }
        },
        onAIStreamError: (data) => {
          if (data.conversationId === currentConversation?._id) {
            setStreaming(false);
            setAiTyping(false);
            streamingMessageRef.current = '';
            toast.error('AI response failed');
          }
        },
        onTypingStart: (data) => {
          if (data.conversationId === currentConversation?._id) {
            setTypingUsers(prev => 
              prev.includes(data.userId) ? prev : [...prev, data.userId]
            );
          }
        },
        onTypingStopped: (data) => {
          if (data.conversationId === currentConversation?._id) {
            setTypingUsers(prev => prev.filter(id => id !== data.userId));
          }
        },
        onNotification: (data) => {
          toast.info(data.message);
        },
        onBroadcast: (data) => {
          toast.info(data.message);
        },
        onError: (error) => {
          console.error('Socket error:', error);
          toast.error('Real-time connection error');
        }
      };

      socketClient.connect(handlers);
      return true;
    };

    // Try to connect immediately
    if (!attemptSocketConnection()) {
      // If token not available, wait for it and then try to connect
      waitForToken().then((tokenAvailable) => {
        if (tokenAvailable) {
          attemptSocketConnection();
        } else {
          console.log('Failed to get token after waiting');
        }
      });
      
      return () => {
        // Cleanup if component unmounts during token wait
      };
    }

    return () => {
      socketClient.destroy();
    };
  }, [user]); // Removed currentConversation?._id and isConnected dependencies

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getConversations();
      if (response.success && response.data) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadModels = useCallback(async () => {
    try {
      console.log('🔍 Loading models from API...');
      const response = await apiClient.getModels();
      console.log('📥 Models API response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Models loaded successfully:', response.data);
        setModels(response.data);
        if (response.data.length > 0 && !selectedModel) {
          setSelectedModel(response.data[0].id);
        }
      } else {
        console.log('❌ Models API response not successful:', response);
      }
    } catch (error) {
      console.error('❌ Failed to load models:', error);
      // Keep the default models if API call fails
    }
  }, [selectedModel]);

  const createConversation = useCallback(async (title?: string, model?: string): Promise<Conversation | null> => {
    try {
      const response = await apiClient.createConversation({ title, model: model || selectedModel });
      console.log('🔍 Create conversation response:', response);
      
      if (response.success && response.data) {
        const newConversation = response.data;
        console.log('✅ Created new conversation:', newConversation);
        
        // Ensure the conversation has a valid _id
        if (!newConversation._id) {
          console.error('❌ New conversation missing _id:', newConversation);
          toast.error('Failed to create conversation - missing ID');
          return null;
        }
        
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversation(newConversation);
        setMessages([]);
        
        // No redirection - stay on the same page like ChatGPT
        // router.push(`/chat/${newConversation._id}`);
        
        return newConversation;
      }
      return null;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to create conversation');
      return null;
    }
  }, [selectedModel]);

  const loadConversation = useCallback(async (id: string) => {
    // Validate the ID before making the API call
    if (!id || id === 'undefined' || id === 'null') {
      console.log('❌ Invalid conversation ID provided:', id);
      toast.error('Invalid conversation ID');
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Loading conversation with ID:', id);
      
      const response = await apiClient.getConversation(id);
      if (response.success && response.data) {
        const conversation = response.data;
        console.log('✅ Conversation loaded successfully:', conversation._id);
        setCurrentConversation(conversation);
        setMessages(conversation.messages || []);
        setSelectedModel(conversation.model);
        
        // Join conversation room for real-time features
        if (socketConnectedRef.current) {
          socketClient.joinConversation(id);
        }
      } else {
        console.log('❌ Conversation not found for ID:', id);
        toast.error('Conversation not found');
        // No redirection - stay on current page
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      toast.error('Failed to load conversation');
      // No redirection - stay on current page
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (message: string, model?: string) => {
    if (!currentConversation || !message.trim()) return;

    try {
      setSending(true);
      setStreaming(false);
      streamingMessageRef.current = '';

      // Add user message immediately
      const userMessage: Message = {
        _id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Static response for now (instead of API call)
      const staticResponse = getStaticResponse(message);
      
      // Simulate AI typing
      setAiTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add assistant message
      const assistantMessage: Message = {
        _id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: staticResponse,
        timestamp: new Date(),
        model: model || selectedModel
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setAiTyping(false);

      // Update conversation stats
      setCurrentConversation(prev => prev ? {
        ...prev,
        totalMessages: (prev.totalMessages || 0) + 2,
        totalTokens: (prev.totalTokens || 0) + message.length + staticResponse.length
      } : null);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }, [currentConversation, selectedModel]);

  // Static response function
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

  const updateConversationTitle = useCallback(async (title: string) => {
    if (!currentConversation) return;

    try {
      const response = await apiClient.updateConversationTitle(currentConversation._id, title);
      if (response.success && response.data) {
        setCurrentConversation(response.data);
        setConversations(prev => 
          prev.map(conv => 
            conv._id === currentConversation._id 
              ? { ...conv, title: response.data!.title }
              : conv
          )
        );
        toast.success('Title updated successfully');
      }
    } catch (error) {
      console.error('Failed to update title:', error);
      toast.error('Failed to update title');
    }
  }, [currentConversation]);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      const response = await apiClient.deleteConversation(id);
      if (response.success) {
        setConversations(prev => prev.filter(conv => conv._id !== id));
        if (currentConversation?._id === id) {
          setCurrentConversation(null);
          setMessages([]);
          // No redirection - stay on current page
        }
        toast.success('Conversation deleted');
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast.error('Failed to delete conversation');
    }
  }, [currentConversation]);

  const joinConversation = useCallback((id: string) => {
    if (socketConnectedRef.current) {
      socketClient.joinConversation(id);
    }
  }, []);

  const leaveConversation = useCallback((id: string) => {
    if (socketConnectedRef.current) {
      socketClient.leaveConversation(id);
    }
  }, []);

  const startTyping = useCallback(() => {
    if (currentConversation && socketConnectedRef.current) {
      socketClient.startTyping(currentConversation._id);
    }
  }, [currentConversation]);

  const stopTyping = useCallback(() => {
    if (currentConversation && socketConnectedRef.current) {
      socketClient.stopTyping(currentConversation._id);
    }
  }, [currentConversation]);

  // Load initial data
  useEffect(() => {
    loadConversations();
    loadModels();
  }, [loadConversations, loadModels]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    sending,
    streaming,
    aiTyping,
    typingUsers,
    models,
    selectedModel,
    isConnected,
    
    createConversation,
    loadConversation,
    sendMessage,
    updateConversationTitle,
    deleteConversation,
    loadConversations,
    loadModels,
    setSelectedModel,
    
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
  };
}
