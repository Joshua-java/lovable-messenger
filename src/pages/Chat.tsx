import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: number;
  text: string;
  sent: boolean;
  time: string;
}

interface Contact {
  id: number;
  name: string;
  initials: string;
  lastMessage: string;
  online: boolean;
}

const contacts: Contact[] = [
  { id: 1, name: "Sarah Johnson", initials: "SJ", lastMessage: "Hey! How are you?", online: true },
  { id: 2, name: "Mike Chen", initials: "MC", lastMessage: "See you tomorrow!", online: false },
  { id: 3, name: "Emma Wilson", initials: "EW", lastMessage: "That's awesome 🎉", online: true },
  { id: 4, name: "Alex Brown", initials: "AB", lastMessage: "Thanks for sharing", online: false },
  { id: 5, name: "Lisa Park", initials: "LP", lastMessage: "Let me know!", online: true },
];

const initialMessages: Message[] = [
  { id: 1, text: "Hey! How are you?", sent: false, time: "10:30 AM" },
  { id: 2, text: "I'm good, thanks! How about you?", sent: true, time: "10:31 AM" },
  { id: 3, text: "Doing great! Want to grab coffee later?", sent: false, time: "10:32 AM" },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [showSidebar, setShowSidebar] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: Date.now(), text: input, sent: true, time }]);
    setInput("");
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className={`${showSidebar ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 border-r border-border bg-card`}>
        {/* Sidebar header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Link to="/">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
          </Link>
          <MessageCircle className="w-6 h-6 text-primary" />
          <span className="font-bold text-foreground text-lg">Chats</span>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9 bg-muted border-0" />
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => { setActiveContact(contact); setShowSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left ${activeContact.id === contact.id ? "bg-accent" : ""}`}
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {contact.initials}
                  </AvatarFallback>
                </Avatar>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{contact.name}</p>
                <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`${!showSidebar ? "flex" : "hidden"} md:flex flex-col flex-1`}>
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setShowSidebar(true)} className="md:hidden">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {activeContact.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground text-sm">{activeContact.name}</p>
            <p className="text-xs text-muted-foreground">{activeContact.online ? "Active now" : "Offline"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  msg.sent
                    ? "bg-chat-sent text-chat-sent-foreground rounded-br-md"
                    : "bg-chat-received text-chat-received-foreground rounded-bl-md"
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sent ? "text-chat-sent-foreground/70" : "text-muted-foreground"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-muted border-0"
          />
          <Button onClick={sendMessage} size="icon" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
