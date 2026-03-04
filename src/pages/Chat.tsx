import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ChatMessages from "@/components/chat/ChatMessages";
import MessageInput from "@/components/chat/MessageInput";

interface Message {
  id: number | string;
  text: string | null;
  sender: string;
  time: string;
  image: string | null;
}

const AUTO_REPLIES = [
  "Hey! Nice to hear from you 😊",
  "That sounds interesting, tell me more!",
  "Haha sure! Let's talk about it.",
  "I'm doing great, thanks for asking!",
  "Oh cool! I'd love that.",
  "Let me think about it and get back to you 🤔",
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const chatWithStored = sessionStorage.getItem("chatWith");
  const chatWith = chatWithStored ? JSON.parse(chatWithStored) : null;

  useEffect(() => {
    if (!user) navigate("/login");
    if (!chatWith) navigate("/discover");
  }, [user, chatWith, navigate]);

  useEffect(() => {
    if (chatWith) {
      setMessages([
        {
          id: "welcome",
          text: `Hey there! I'm ${chatWith.name} from ${chatWith.city}. ${chatWith.bio}`,
          sender: "admin",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          image: null,
        },
      ]);
    }
  }, []);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const simulateReply = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
          sender: "admin",
          time: now(),
          image: null,
        },
      ]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
  };

  const handleSendText = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), text, sender: "user", time: now(), image: null }]);
    simulateReply();
  };

  const handleSendImage = (file: File, caption?: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: caption || null, sender: "user", time: now(), image: URL.createObjectURL(file) },
    ]);
    simulateReply();
  };

  if (!user || !chatWith) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with chat partner info */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate("/discover")} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {chatWith.name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          {chatWith.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{chatWith.name}</p>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{chatWith.city}, {chatWith.state}</span>
            <span className="text-xs text-muted-foreground ml-1">• {chatWith.online ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>

      <ChatMessages messages={messages} isTyping={isTyping} />
      <MessageInput onSendText={handleSendText} onSendImage={handleSendImage} />
    </div>
  );
};

export default Chat;
