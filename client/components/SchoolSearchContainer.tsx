import { useState } from "react";
import ChatInterface from "./chat/ChatInterface";
import ClassicSearch from "./search/ClassicSearch";

export default function SchoolSearchContainer() {
  const [mode, setMode] = useState<"chat" | "classic">("chat");

  const toggleMode = () => {
    setMode(prev => prev === "chat" ? "classic" : "chat");
  };

  return (
    <div className="h-screen">
      {mode === "chat" ? (
        <ChatInterface mode={mode} onToggleMode={toggleMode} />
      ) : (
        <ClassicSearch mode={mode} onToggleMode={toggleMode} />
      )}
    </div>
  );
}
