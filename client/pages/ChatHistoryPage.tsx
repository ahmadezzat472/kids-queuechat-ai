import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { SavedConversation } from "@/lib/chatStorage";
import ChatHistory from "@/components/chat/ChatHistory";

export default function ChatHistoryPage() {
  const navigate = useNavigate();

  const handleResumeConversation = (conversation: SavedConversation) => {
    // Store the conversation to resume in localStorage temporarily
    localStorage.setItem("resume_conversation", JSON.stringify(conversation));
    // Navigate back to main chat
    navigate("/");
  };

  return (
    <MainLayout>
      <ChatHistory onResumeConversation={handleResumeConversation} />
    </MainLayout>
  );
}
