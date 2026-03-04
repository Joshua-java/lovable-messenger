import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import MessageInput from "@/components/chat/MessageInput";

interface Message {
  id: number | string;
  text: string | null;
  sender: string;
  time: string;
  image: string | null;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  text: "Welcome to ChatFlow! 🎉\n\nI'm here to help you get started. Send a message to begin your conversation!",
  sender: "admin",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  image: null,
};

const AUTO_REPLIES = [
  "Thanks for your message! We'll get back to you shortly. 😊",
  "Got it! Let me look into that for you.",
  "Interesting! Tell me more about that.",
  "That's great to hear! Is there anything else I can help with?",
  "Sure thing! Give me a moment to check.",
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const simulateReply = () => {
    setIsTyping(true);
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        sender: "admin",
        time: now(),
        image: null,
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
  };

  const handleSendText = (text: string) => {
    const msg: Message = { id: Date.now(), text, sender: "user", time: now(), image: null };
    setMessages((prev) => [...prev, msg]);
    simulateReply();
  };

  const handleSendImage = (file: File, caption?: string) => {
    const msg: Message = {
      id: Date.now(),
      text: caption || null,
      sender: "user",
      time: now(),
      image: URL.createObjectURL(file),
    };
    setMessages((prev) => [...prev, msg]);
    simulateReply();
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader username={user.username || user.phone} avatar={user.avatar} />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <MessageInput onSendText={handleSendText} onSendImage={handleSendImage} />
    </div>
  );
};

export default Chat;
