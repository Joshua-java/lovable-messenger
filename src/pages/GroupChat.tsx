import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, MessageCircle, Play } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import MessageInput from "@/components/chat/MessageInput";

interface GroupPost {
  id: number | string;
  text: string | null;
  sender: string;
  senderName: string;
  senderCity: string;
  senderAvatar: string | null;
  time: string;
  image: string | null;
  video: string | null;
}

const MOCK_GROUP_POSTS: GroupPost[] = [
  { id: "g1", text: "Hello everyone from Uyo! 🎉 Anyone selling iPhone 14?", sender: "+234 812 000 0001", senderName: "Aniekan Udoh", senderCity: "Uyo", senderAvatar: null, time: "09:15 AM", image: null, video: null },
  { id: "g2", text: "Fresh fish available in Eket market today! 🐟", sender: "+234 812 000 0003", senderName: "Emem Bassey", senderCity: "Eket", senderAvatar: null, time: "09:30 AM", image: null, video: null },
  { id: "g3", text: "Looking for a fashion designer in Uyo area ✨", sender: "+234 812 000 0002", senderName: "Blessing Edet", senderCity: "Uyo", senderAvatar: null, time: "10:00 AM", image: null, video: null },
  { id: "g4", text: "Beautiful sunset from Port Harcourt 🌅", sender: "+234 812 000 0008", senderName: "Chidi Nwosu", senderCity: "Port Harcourt", senderAvatar: null, time: "10:45 AM", image: null, video: null },
  { id: "g5", text: null, sender: "+234 812 000 0007", senderName: "Grace Okon", senderCity: "Calabar", senderAvatar: null, time: "11:20 AM", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", video: null },
  { id: "g6", text: "My latest cake design! Orders open 🍰", sender: "+234 812 000 0007", senderName: "Grace Okon", senderCity: "Calabar", senderAvatar: null, time: "11:21 AM", image: null, video: null },
];

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  uyo: { lat: 5.05, lng: 7.93 },
  eket: { lat: 4.64, lng: 7.94 },
  "port harcourt": { lat: 4.82, lng: 7.03 },
  calabar: { lat: 4.95, lng: 8.32 },
  aba: { lat: 5.12, lng: 7.37 },
  warri: { lat: 5.52, lng: 5.76 },
  benin: { lat: 6.34, lng: 5.63 },
  lagos: { lat: 6.52, lng: 3.38 },
  abuja: { lat: 9.06, lng: 7.49 },
  enugu: { lat: 6.44, lng: 7.50 },
  oron: { lat: 4.83, lng: 8.24 },
  "ikot ekpene": { lat: 5.18, lng: 7.71 },
};

const getDistance = (city1: string, city2: string): number => {
  const a = CITY_COORDS[city1.toLowerCase()];
  const b = CITY_COORDS[city2.toLowerCase()];
  if (!a || !b) return 9999;
  const dx = (a.lat - b.lat) * 111;
  const dy = (a.lng - b.lng) * 111;
  return Math.sqrt(dx * dx + dy * dy);
};

const GroupChat = () => {
  const navigate = useNavigate();
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const myCity = user?.city || "";

  const [posts, setPosts] = useState<GroupPost[]>(MOCK_GROUP_POSTS);
  const [filterCity, setFilterCity] = useState<"all" | "nearby">("nearby");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const filteredPosts = useMemo(() => {
    if (filterCity === "all") return posts;
    return posts.filter((p) => getDistance(myCity, p.senderCity) < 200);
  }, [posts, filterCity, myCity]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSendText = (text: string) => {
    setPosts((prev) => [...prev, { id: Date.now(), text, sender: user?.phone || "", senderName: user?.name || "You", senderCity: myCity, senderAvatar: user?.avatar || null, time: now(), image: null, video: null }]);
  };

  const handleSendImage = (file: File, caption?: string) => {
    const isVideo = file.type.startsWith("video/");
    setPosts((prev) => [...prev, {
      id: Date.now(),
      text: caption || null,
      sender: user?.phone || "",
      senderName: user?.name || "You",
      senderCity: myCity,
      senderAvatar: user?.avatar || null,
      time: now(),
      image: isVideo ? null : URL.createObjectURL(file),
      video: isVideo ? URL.createObjectURL(file) : null,
    }]);
  };

  const handleContactUser = (post: GroupPost) => {
    sessionStorage.setItem("chatWith", JSON.stringify({
      id: post.sender, name: post.senderName, phone: post.sender, city: post.senderCity, state: "", country: "Nigeria", avatar: post.senderAvatar, online: true, bio: "", gender: "",
    }));
    navigate("/chat");
  };

  if (!user) return null;

  const groupName = myCity ? `${myCity} & Nearby` : "Local Group";

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate("/discover")} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">{groupName}</p>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{filteredPosts.length} posts • Community</span>
            </div>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/80">
        {(["nearby", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilterCity(f)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCity === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
            {f === "nearby" ? "📍 Nearby" : "🌍 All"}
          </button>
        ))}
        {myCity && <span className="text-xs text-muted-foreground ml-auto">Your area: {myCity}</span>}
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {filteredPosts.map((post) => {
          const isMe = post.sender === user?.phone;
          const initials = post.senderName.split(" ").map((n) => n[0]).join("");
          const dist = getDistance(myCity, post.senderCity);
          const distLabel = dist < 1 ? "Same city" : `~${Math.round(dist)} km`;

          return (
            <div key={post.id} className="bg-card rounded-2xl border border-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  {post.senderAvatar ? (
                    <img src={post.senderAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{isMe ? "You" : post.senderName}</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{distLabel}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{post.senderCity} • {post.time}</span>
                  </div>
                </div>
                {!isMe && (
                  <Button variant="ghost" size="sm" onClick={() => handleContactUser(post)} className="text-primary text-xs shrink-0">
                    <MessageCircle className="w-4 h-4 mr-1" /> Chat
                  </Button>
                )}
              </div>

              {post.video && (
                <video src={post.video} controls className="w-full rounded-xl max-h-72 bg-muted" preload="metadata" />
              )}
              {post.image && (
                <img src={post.image} alt="" className="w-full rounded-xl max-h-72 object-cover" />
              )}
              {post.text && <p className="text-sm text-foreground whitespace-pre-wrap">{post.text}</p>}
            </div>
          );
        })}
      </div>

      <MessageInput onSendText={handleSendText} onSendImage={handleSendImage} placeholder="Post to your community..." />
    </div>
  );
};

export default GroupChat;
