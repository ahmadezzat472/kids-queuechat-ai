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

const STORAGE_KEY = "schoolfinder_conversations";

export const chatStorage = {
  // Save a conversation to local storage
  saveConversation: (messages: Message[]): string => {
    try {
      if (messages.length === 0) return "";

      // Generate conversation ID and title
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Generate title from first user message
      const firstUserMessage = messages.find(msg => msg.type === "user");
      let title = "New Conversation";
      if (firstUserMessage) {
        title = firstUserMessage.content.length > 50 
          ? firstUserMessage.content.substring(0, 50) + "..."
          : firstUserMessage.content;
      }

      // Generate preview from first assistant message
      const firstAssistantMessage = messages.find(msg => msg.type === "assistant");
      let preview = "No response yet";
      if (firstAssistantMessage) {
        preview = firstAssistantMessage.content.length > 100
          ? firstAssistantMessage.content.substring(0, 100) + "..."
          : firstAssistantMessage.content;
      }

      const conversation: SavedConversation = {
        id: conversationId,
        title,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        lastUpdated: new Date(),
        preview
      };

      // Get existing conversations
      const existing = chatStorage.getConversations();
      
      // Add new conversation at the beginning
      const updated = [conversation, ...existing];
      
      // Keep only the last 50 conversations
      const trimmed = updated.slice(0, 50);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return conversationId;
    } catch (error) {
      console.error("Error saving conversation:", error);
      return "";
    }
  },

  // Update an existing conversation
  updateConversation: (conversationId: string, messages: Message[]): void => {
    try {
      const conversations = chatStorage.getConversations();
      const index = conversations.findIndex(conv => conv.id === conversationId);
      
      if (index !== -1) {
        conversations[index].messages = messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        conversations[index].lastUpdated = new Date();
        
        // Update preview with latest assistant message
        const lastAssistantMessage = messages.filter(msg => msg.type === "assistant").pop();
        if (lastAssistantMessage) {
          conversations[index].preview = lastAssistantMessage.content.length > 100
            ? lastAssistantMessage.content.substring(0, 100) + "..."
            : lastAssistantMessage.content;
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      }
    } catch (error) {
      console.error("Error updating conversation:", error);
    }
  },

  // Get all conversations
  getConversations: (): SavedConversation[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      return parsed.map((conv: any) => ({
        ...conv,
        lastUpdated: new Date(conv.lastUpdated),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error("Error loading conversations:", error);
      return [];
    }
  },

  // Get a specific conversation
  getConversation: (id: string): SavedConversation | null => {
    try {
      const conversations = chatStorage.getConversations();
      return conversations.find(conv => conv.id === id) || null;
    } catch (error) {
      console.error("Error loading conversation:", error);
      return null;
    }
  },

  // Delete a conversation
  deleteConversation: (id: string): void => {
    try {
      const conversations = chatStorage.getConversations();
      const filtered = conversations.filter(conv => conv.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  },

  // Clear all conversations
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing conversations:", error);
    }
  }
};

export type { Message, SavedConversation };
