import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Filter, MessageCircle, LogOut, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  uyo: { lat: 5.05, lng: 7.93 }, eket: { lat: 4.64, lng: 7.94 }, "port harcourt": { lat: 4.82, lng: 7.03 },
  calabar: { lat: 4.95, lng: 8.32 }, aba: { lat: 5.12, lng: 7.37 }, warri: { lat: 5.52, lng: 5.76 },
  benin: { lat: 6.34, lng: 5.63 }, lagos: { lat: 6.52, lng: 3.38 }, abuja: { lat: 9.06, lng: 7.49 },
  enugu: { lat: 6.44, lng: 7.50 }, oron: { lat: 4.83, lng: 8.24 }, "ikot ekpene": { lat: 5.18, lng: 7.71 },
};

const getDistance = (city1: string, city2: string): number => {
  const a = CITY_COORDS[city1.toLowerCase()]; const b = CITY_COORDS[city2.toLowerCase()];
  if (!a || !b) return 9999;
  return Math.sqrt(((a.lat - b.lat) * 111) ** 2 + ((a.lng - b.lng) * 111) ** 2);
};

interface MockUser { id: string; name: string; phone: string; gender: string; city: string; state: string; country: string; avatar: string | null; online: boolean; bio: string; }

const MOCK_USERS: MockUser[] = [
  { id: "1", name: "Aniekan Udoh", phone: "+234 812 000 0001", gender: "male", city: "Uyo", state: "Akwa Ibom", country: "Nigeria", avatar: null, online: true, bio: "Love music and tech 🎵" },
  { id: "2", name: "Blessing Edet", phone: "+234 812 000 0002", gender: "female", city: "Uyo", state: "Akwa Ibom", country: "Nigeria", avatar: null, online: true, bio: "Fashion designer ✨" },
  { id: "3", name: "Emem Bassey", phone: "+234 812 000 0003", gender: "female", city: "Eket", state: "Akwa Ibom", country: "Nigeria", avatar: null, online: false, bio: "Foodie & traveler 🌍" },
  { id: "4", name: "Nsikak James", phone: "+234 812 000 0004", gender: "male", city: "Eket", state: "Akwa Ibom", country: "Nigeria", avatar: null, online: true, bio: "Software developer 💻" },
  { id: "5", name: "Iniobong Akpan", phone: "+234 812 000 0005", gender: "female", city: "Ikot Ekpene", state: "Akwa Ibom", country: "Nigeria", avatar: null, online: false, bio: "Nurse and proud mom 💉" },
  { id: "6", name: "Okon Sunday", phone: "+234 812 000 0006", gender: "male", city: "Oron", state: "Akwa Ibom", country: "Nigeria", avatar: null, online: true, bio: "Fisherman by trade 🐟" },
  { id: "7", name: "Grace Okon", phone: "+234 812 000 0007", gender: "female", city: "Calabar", state: "Cross River", country: "Nigeria", avatar: null, online: true, bio: "Entrepreneur & baker 🍰" },
  { id: "8", name: "Chidi Nwosu", phone: "+234 812 000 0008", gender: "male", city: "Port Harcourt", state: "Rivers", country: "Nigeria", avatar: null, online: false, bio: "Oil & gas engineer ⛽" },
  { id: "9", name: "Amaka Eze", phone: "+234 812 000 0009", gender: "female", city: "Port Harcourt", state: "Rivers", country: "Nigeria", avatar: null, online: true, bio: "Lawyer and writer 📚" },
  { id: "10", name: "Uduak Udo", phone: "+234 812 000 0010", gender: "male", city: "Uyo", state: "Akwa Ibom", country: "Nigeria", avatar: null, online: false, bio: "Gym rat 💪" },
  { id: "11", name: "Imaobong Essien", phone: "+234 812 000 0011", gender: "female", city: "Uyo", state: "Akwa Ibom", country: "Nigeria", avatar: null, online: true, bio: "Student & dreamer 🌟" },
  { id: "12", name: "Effiong Brown", phone: "+234 812 000 0012", gender: "male", city: "Aba", state: "Abia", country: "Nigeria", avatar: null, online: false, bio: "Trader & hustler 💼" },
  { id: "13", name: "Nkechi Obi", phone: "+234 812 000 0013", gender: "female", city: "Enugu", state: "Enugu", country: "Nigeria", avatar: null, online: true, bio: "Artist & painter 🎨" },
  { id: "14", name: "Kingsley Etim", phone: "+234 812 000 0014", gender: "male", city: "Calabar", state: "Cross River", country: "Nigeria", avatar: null, online: true, bio: "Chef extraordinaire 👨‍🍳" },
];

const Discover = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [showNearbyOnly, setShowNearbyOnly] = useState(true);

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const myCity = user?.city || "";

  const filteredUsers = useMemo(() => {
    let users = MOCK_USERS.filter((u) => u.phone !== user?.phone);
    if (genderFilter !== "all") users = users.filter((u) => u.gender === genderFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || u.bio.toLowerCase().includes(q));
    }
    users.sort((a, b) => getDistance(myCity, a.city) - getDistance(myCity, b.city));
    if (showNearbyOnly && myCity) users = users.filter((u) => getDistance(myCity, u.city) < 150);
    return users;
  }, [genderFilter, search, showNearbyOnly, myCity, user?.phone]);

  if (!user) { navigate("/login"); return null; }

  const getDistanceLabel = (city: string) => {
    if (!myCity) return "";
    const d = getDistance(myCity, city);
    return d < 1 ? "Same city" : `~${Math.round(d)} km away`;
  };

  const handleSelectUser = (selectedUser: MockUser) => {
    sessionStorage.setItem("chatWith", JSON.stringify(selectedUser));
    navigate("/chat");
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          <span className="font-bold text-foreground text-lg">People Near You</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">{myCity || "No location"}</span>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex gap-2 px-4 mt-3">
        <button onClick={() => navigate("/group")} className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground text-sm">{myCity || "Local"} Community</p>
            <p className="text-[11px] text-muted-foreground">Group chat</p>
          </div>
        </button>
        <button onClick={() => navigate("/videos")} className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground text-sm">Videos</p>
            <p className="text-[11px] text-muted-foreground">Watch & share</p>
          </div>
        </button>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, city, or interest..." className="pl-9 bg-muted border-0" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "male", "female"] as const).map((g) => (
            <button key={g} onClick={() => setGenderFilter(g)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${genderFilter === g ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              {g === "all" ? "All" : g === "male" ? "👨 Male" : "👩 Female"}
            </button>
          ))}
          <span className="w-px h-4 bg-border" />
          <button onClick={() => setShowNearbyOnly(!showNearbyOnly)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${showNearbyOnly ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
            📍 Nearby only
          </button>
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No people found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Try changing your filters</p>
            {showNearbyOnly && <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowNearbyOnly(false)}>Show all regions</Button>}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredUsers.map((person) => {
              const distLabel = getDistanceLabel(person.city);
              const isSameCity = myCity.toLowerCase() === person.city.toLowerCase();
              return (
                <button key={person.id} onClick={() => handleSelectUser(person)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors text-left">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{person.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    {person.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card" style={{ backgroundColor: "hsl(var(--success))" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm truncate">{person.name}</p>
                      {isSameCity && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Same city</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{person.bio}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground/60" />
                      <span className="text-[11px] text-muted-foreground/80">{person.city}, {person.state}</span>
                      {distLabel && <span className="text-[11px] text-primary/70 ml-1">• {distLabel}</span>}
                    </div>
                  </div>
                  <MessageCircle className="w-5 h-5 text-primary/50 shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
