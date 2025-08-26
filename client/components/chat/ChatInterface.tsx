import { useState, useRef, useEffect } from "react";
import { Send, Mic, RotateCcw, Bookmark, HelpCircle, Star, MapPin, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatStorage } from "@/lib/chatStorage";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  schoolResults?: SchoolResult[];
  isQuestion?: boolean;
}

interface SchoolResult {
  id: string;
  name: string;
  type: string;
  rating: number;
  distance: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  fees?: string;
  ofstedRating?: string;
}

interface QuickQuestion {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  question: string;
  category: string;
}

interface ChatInterfaceProps {
  mode: "chat" | "classic";
  onToggleMode: () => void;
}

const quickQuestions: QuickQuestion[] = [
  {
    id: "1",
    icon: MapPin,
    question: "What are the best schools near me?",
    category: "Location"
  },
  {
    id: "2", 
    icon: Star,
    question: "Which schools have Outstanding Ofsted ratings?",
    category: "Quality"
  },
  {
    id: "3",
    icon: GraduationCap,
    question: "What are the admission requirements for top schools?",
    category: "Admissions"
  },
  {
    id: "4",
    icon: Users,
    question: "Which schools have the smallest class sizes?",
    category: "Environment"
  },
  {
    id: "5",
    icon: HelpCircle,
    question: "How do I compare schools effectively?",
    category: "Guidance"
  },
  {
    id: "6",
    icon: Star,
    question: "What extracurricular activities are available?",
    category: "Activities"
  }
];

export default function ChatInterface({ mode, onToggleMode }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Welcome to Kidsqueue Q&A! I'm here to answer all your questions about finding the perfect school for your child. Click on any question below to get started, or ask me anything directly.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for resumed conversation on component mount
  useEffect(() => {
    const resumeData = localStorage.getItem("resume_conversation");
    if (resumeData) {
      try {
        const conversation = JSON.parse(resumeData);
        setMessages(conversation.messages);
        setCurrentConversationId(conversation.id);
        setShowQuickQuestions(false);
        localStorage.removeItem("resume_conversation");
      } catch (error) {
        console.error("Error loading resumed conversation:", error);
      }
    }
  }, []);

  // Auto-save conversations when messages change
  useEffect(() => {
    // Only save if we have more than just the initial welcome message
    if (messages.length > 1) {
      if (currentConversationId) {
        // Update existing conversation
        chatStorage.updateConversation(currentConversationId, messages);
      } else {
        // Save new conversation and get the ID
        const newId = chatStorage.saveConversation(messages);
        if (newId) {
          setCurrentConversationId(newId);
        }
      }
    }
  }, [messages, currentConversationId]);

  const handleQuickQuestion = (question: string) => {
    setShowQuickQuestions(false);
    handleSendMessage(question);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageText = customMessage || inputValue;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
      isQuestion: true,
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customMessage) setInputValue("");
    setIsLoading(true);

    // Simulate AI response with context-aware answers
    setTimeout(() => {
      let responseContent = "";
      let schoolResults: SchoolResult[] | undefined;

      if (messageText.toLowerCase().includes("near me") || messageText.toLowerCase().includes("location")) {
        responseContent = "Here are the top-rated schools in your area based on your location:";
        schoolResults = [
          {
            id: "1",
            name: "Greenwood Primary Academy",
            type: "Primary School",
            rating: 4.8,
            distance: "0.3 miles",
            description: "Outstanding primary school with excellent STEM programs and small class sizes.",
            website: "www.greenwoodprimary.edu",
            phone: "020 7123 4567",
            address: "123 Oak Street, London, SW1A 1AA",
            ofstedRating: "Outstanding"
          },
          {
            id: "2",
            name: "St. Mary's Catholic School",
            type: "Primary School", 
            rating: 4.6,
            distance: "0.5 miles",
            description: "Catholic primary school with strong community values and excellent pastoral care.",
            website: "www.stmarys.edu",
            phone: "020 7234 5678",
            address: "456 Church Lane, London, SW1A 2BB",
            ofstedRating: "Good"
          }
        ];
      } else if (messageText.toLowerCase().includes("outstanding") || messageText.toLowerCase().includes("ofsted")) {
        responseContent = "These schools have received Outstanding Ofsted ratings in recent inspections:";
        schoolResults = [
          {
            id: "1",
            name: "Greenwood Primary Academy",
            type: "Primary School",
            rating: 4.8,
            distance: "0.3 miles",
            description: "Outstanding in all areas including teaching quality, pupil progress, and leadership.",
            website: "www.greenwoodprimary.edu",
            phone: "020 7123 4567",
            address: "123 Oak Street, London, SW1A 1AA",
            ofstedRating: "Outstanding"
          }
        ];
      } else if (messageText.toLowerCase().includes("admission") || messageText.toLowerCase().includes("requirements")) {
        responseContent = "Here's what you need to know about admission requirements for top schools:\n\n• **Application deadlines**: Most schools require applications by January 15th\n• **Documents needed**: Birth certificate, proof of address, previous school reports\n• **Entrance criteria**: Some schools use catchment areas, others have academic or religious criteria\n• **Waiting lists**: Popular schools often have waiting lists - apply early!";
      } else if (messageText.toLowerCase().includes("class size") || messageText.toLowerCase().includes("environment")) {
        responseContent = "Schools with smaller class sizes tend to offer more personalized attention:\n\n• **Average class size**: Look for schools with 20-25 pupils per class\n• **Teacher-pupil ratio**: Best schools maintain 1:15 or better ratios\n• **Support staff**: Check if teaching assistants are available\n• **Individual attention**: Smaller classes mean more one-on-one time";
      } else if (messageText.toLowerCase().includes("compare") || messageText.toLowerCase().includes("choose")) {
        responseContent = "Here's a systematic approach to comparing schools:\n\n**1. Academic Performance**\n• Ofsted ratings and reports\n• SATs results and progress data\n• GCSE/A-Level results for secondary schools\n\n**2. School Environment**\n• Class sizes and teacher-pupil ratios\n• Facilities and resources\n• School culture and values\n\n**3. Practical Considerations**\n• Distance from home\n• Transport links\n• After-school care options\n• Uniform and equipment costs";
      } else if (messageText.toLowerCase().includes("activities") || messageText.toLowerCase().includes("extracurricular")) {
        responseContent = "Most schools offer a variety of extracurricular activities:\n\n**Sports & Physical**\n• Football, netball, athletics\n• Swimming, gymnastics\n• Dance and martial arts\n\n**Creative Arts**\n• Music lessons and choir\n• Drama and theatre\n• Art and craft clubs\n\n**Academic Enrichment**\n• Science and coding clubs\n• Reading and writing groups\n• Language clubs\n• Chess and debating";
      } else {
        responseContent = "That's a great question! Let me help you with that. Based on what you're asking, I'd recommend looking at several factors when choosing a school for your child.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responseContent,
        timestamp: new Date(),
        schoolResults: schoolResults
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-200 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-purple-900">School Search Q&A</h1>
          <p className="text-sm text-purple-600">
            Get answers to all your school-related questions
          </p>
        </div>
        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 rounded-xl bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Switch to {mode === "chat" ? "Classic" : "Q&A"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="space-y-4">
            {message.type === "user" ? (
              // User Question
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl rounded-br-md p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Question</span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="mt-2 text-xs text-purple-100">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ) : (
              // Assistant Answer
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white rounded-2xl rounded-bl-md p-5 shadow-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">kidsqueue Ai</span>
                  </div>
                  <div className="prose prose-purple prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  {/* School Results */}
                  {message.schoolResults && (
                    <div className="mt-4 space-y-3">
                      {message.schoolResults.map((school) => (
                        <div
                          key={school.id}
                          className="border border-purple-200 rounded-xl p-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-purple-900">{school.name}</h3>
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                                  {school.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{school.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {school.rating}
                                </span>
                                <span>{school.distance}</span>
                                <span className="text-purple-600 font-medium">Ofsted: {school.ofstedRating}</span>
                              </div>
                            </div>
                            <button className="p-2 rounded-lg hover:bg-purple-100 transition-colors">
                              <Bookmark className="h-4 w-4 text-purple-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Quick Questions */}
        {showQuickQuestions && messages.length === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-purple-700 text-center">Popular Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuickQuestion(q.question)}
                  className="group text-left p-4 rounded-xl bg-white border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                      <q.icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
                        {q.question}
                      </p>
                      <p className="text-xs text-purple-500 mt-1">{q.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md p-5 shadow-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
                </div>
                <span className="text-sm text-purple-600">Preparing your answer...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-purple-200 bg-white/80 backdrop-blur-sm p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about schools..."
              className="w-full min-h-[44px] max-h-32 resize-none rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-colors"
              rows={1}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="p-3 rounded-xl text-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              disabled={isLoading}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
