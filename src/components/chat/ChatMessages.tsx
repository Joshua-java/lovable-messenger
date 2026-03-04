import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";

interface Message {
  id: number | string;
  text: string | null;
  sender: string;
  time: string;
  image: string | null;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatMessages = ({ messages, isTyping }: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg) => {
        const isUser = msg.sender === "user";
        return (
          <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
            {!isUser && (
              <Avatar className="w-8 h-8 mt-1 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  <MessageCircle className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                isUser
                  ? "bg-chat-sent text-chat-sent-foreground rounded-br-md"
                  : "bg-chat-received text-chat-received-foreground rounded-bl-md"
              }`}
            >
              {msg.image && (
                <img src={msg.image} alt="shared" className="rounded-lg mb-2 max-w-full max-h-48 object-cover" />
              )}
              {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
              <p className={`text-[10px] mt-1 ${isUser ? "text-chat-sent-foreground/60" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex justify-start gap-2">
          <Avatar className="w-8 h-8 mt-1 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              <MessageCircle className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="bg-chat-received text-chat-received-foreground px-4 py-3 rounded-2xl rounded-bl-md">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
