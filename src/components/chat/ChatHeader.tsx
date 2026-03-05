import { useNavigate } from "react-router-dom";
import { LogOut, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

interface ChatHeaderProps {
  username: string;
  avatar?: string | null;
}

const ChatHeader = ({ username, avatar }: ChatHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-primary" />
        <span className="font-bold text-foreground text-lg">ChatFlow</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium text-foreground hidden sm:block">{username}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
