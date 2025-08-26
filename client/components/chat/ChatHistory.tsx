import { useState, useEffect } from "react";
import { MessageCircle, Clock, Trash2, Eye, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  schoolResults?: any[];
  isQuestion?: boolean;
}

interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  preview: string;
}

interface ChatHistoryProps {
  onResumeConversation?: (conversation: SavedConversation) => void;
}

export default function ChatHistory({ onResumeConversation }: ChatHistoryProps) {
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<SavedConversation | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    try {
      const saved = localStorage.getItem("schoolfinder_conversations");
      if (saved) {
        const parsed = JSON.parse(saved);
        const conversations = parsed.map((conv: any) => ({
          ...conv,
          lastUpdated: new Date(conv.lastUpdated),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversations.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()));
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter(conv => conv.id !== id);
    setConversations(updated);
    localStorage.setItem("schoolfinder_conversations", JSON.stringify(updated));
    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-purple-200 bg-white/50 backdrop-blur-sm">
        <div className="p-4 border-b border-purple-200">
          <h2 className="text-xl font-bold text-purple-900 mb-4">Chat History</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-2 border-purple-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-purple-300 mx-auto mb-3" />
              <p className="text-purple-600 font-medium">No conversations yet</p>
              <p className="text-sm text-purple-400 mt-1">
                Start chatting to see your history here
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={cn(
                    "group p-4 rounded-xl mb-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedConversation?.id === conversation.id
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300"
                      : "bg-white hover:bg-purple-50 border border-purple-100"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-purple-900 text-sm mb-1 truncate">
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {conversation.preview}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-purple-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(conversation.lastUpdated)}</span>
                        <span>•</span>
                        <span>{conversation.messages.length} messages</span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onResumeConversation?.(conversation);
                        }}
                        className="p-1 rounded-lg hover:bg-purple-200 text-purple-600"
                        title="Resume conversation"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        className="p-1 rounded-lg hover:bg-red-200 text-red-600"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversation Details */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-purple-200 bg-white/50 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-purple-900">{selectedConversation.title}</h3>
              <p className="text-sm text-purple-600">
                {formatDate(selectedConversation.lastUpdated)} • {selectedConversation.messages.length} messages
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  {message.type === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl rounded-br-md p-4 shadow-lg">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="mt-2 text-xs text-purple-100">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-white rounded-2xl rounded-bl-md p-5 shadow-lg border border-purple-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">A</span>
                          </div>
                          <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">Answer</span>
                        </div>
                        <div className="prose prose-purple prose-sm max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{message.content}</p>
                        </div>
                        
                        {/* School Results */}
                        {message.schoolResults && message.schoolResults.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {message.schoolResults.map((school: any) => (
                              <div
                                key={school.id}
                                className="border border-purple-200 rounded-xl p-4 bg-gradient-to-r from-purple-50 to-blue-50"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-semibold text-purple-900">{school.name}</h4>
                                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                                        {school.type}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{school.description}</p>
                                  </div>
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
            </div>
            {onResumeConversation && (
              <div className="p-4 border-t border-purple-200 bg-white/50 backdrop-blur-sm">
                <button
                  onClick={() => onResumeConversation(selectedConversation)}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  Resume This Conversation
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Select a Conversation</h3>
              <p className="text-purple-600">
                Choose a conversation from the sidebar to view its details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
