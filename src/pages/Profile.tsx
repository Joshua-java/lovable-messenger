import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, ImagePlus, X, MapPin, Phone, Save, Edit3, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface UserData {
  name: string;
  phone: string;
  password: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  avatar: string | null;
  photos: string[];
  username: string;
  bio?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [form, setForm] = useState<Partial<UserData>>({});

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    // Ensure photos array exists
    if (!parsed.photos) parsed.photos = parsed.avatar ? [parsed.avatar] : [];
    if (!parsed.bio) parsed.bio = "";
    setUser(parsed);
    setForm(parsed);
  }, [navigate]);

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentPhotos = form.photos || [];
    if (currentPhotos.length + files.length > 4) {
      toast({ title: "Limit reached", description: "You can upload up to 4 photos.", variant: "destructive" });
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setForm((p) => ({ ...p, photos: [...(p.photos || []), reader.result as string] }));
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setForm((p) => ({
      ...p,
      photos: (p.photos || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const updated = { ...user, ...form, avatar: form.photos?.[0] || null, username: form.name || form.phone };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated as UserData);
    setEditing(false);
    toast({ title: "Profile updated!", description: "Your changes have been saved." });
  };

  if (!user) return null;

  const initials = (user.name || "U").split(" ").map((n) => n[0]).join("");
  const mainPhoto = form.photos?.[0] || user.photos?.[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with cover photo */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        {mainPhoto ? (
          <img src={mainPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm">ChatFlow</span>
          </div>
          {!editing ? (
            <Button variant="ghost" size="icon" onClick={() => setEditing(true)} className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full">
              <Edit3 className="w-5 h-5" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleSave} className="gap-1.5 rounded-full">
              <Save className="w-4 h-4" /> Save
            </Button>
          )}
        </div>
      </div>

      {/* Profile content */}
      <div className="max-w-lg mx-auto px-4 -mt-20 relative z-10 pb-12">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          {/* Avatar */}
          <div className="flex items-end gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                {mainPhoto ? (
                  <AvatarImage src={mainPhoto} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
                )}
              </Avatar>
              {editing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const result = reader.result as string;
                      setForm((p) => ({ ...p, photos: [result, ...(p.photos || []).slice(1)] }));
                    };
                    reader.readAsDataURL(file);
                    e.target.value = "";
                  }} />
                </label>
              )}
            </div>
            <div className="flex-1 pb-1">
              {editing ? (
                <Input value={form.name || ""} onChange={(e) => update("name", e.target.value)} className="text-xl font-bold h-auto py-1 px-2" placeholder="Your name" />
              ) : (
                <h1 className="text-2xl font-bold text-foreground">{user.name || "No name"}</h1>
              )}
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.city}, {user.state}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">About me</Label>
            {editing ? (
              <Textarea value={form.bio || ""} onChange={(e) => update("bio", e.target.value)} placeholder="Tell people about yourself..." className="resize-none" rows={3} />
            ) : (
              <p className="text-sm text-foreground leading-relaxed">{user.bio || "No bio yet. Tap edit to add one!"}</p>
            )}
          </div>

          {/* Photos */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Photos</Label>
            <div className="grid grid-cols-4 gap-2">
              {(editing ? form.photos : user.photos)?.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                  <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  {editing && (
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[9px] text-center py-0.5">Main</span>
                  )}
                </div>
              ))}
              {editing && (form.photos || []).length < 4 && (
                <label className="cursor-pointer aspect-square">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" multiple />
                  <div className="w-full h-full rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted hover:border-primary transition-colors">
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground mt-0.5">Add</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Details</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</span>
                {editing ? (
                  <Input value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} className="w-48 h-8 text-sm" />
                ) : (
                  <span className="text-sm font-medium text-foreground">{user.phone}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gender</span>
                {editing ? (
                  <div className="flex gap-2">
                    {["Male", "Female"].map((g) => (
                      <button key={g} type="button" onClick={() => update("gender", g.toLowerCase())}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.gender === g.toLowerCase() ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"}`}
                      >{g}</button>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm font-medium text-foreground capitalize">{user.gender === "male" ? "👨 Male" : "👩 Female"}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> City</span>
                {editing ? (
                  <Input value={form.city || ""} onChange={(e) => update("city", e.target.value)} className="w-48 h-8 text-sm" />
                ) : (
                  <span className="text-sm font-medium text-foreground">{user.city}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">State</span>
                {editing ? (
                  <Input value={form.state || ""} onChange={(e) => update("state", e.target.value)} className="w-48 h-8 text-sm" />
                ) : (
                  <span className="text-sm font-medium text-foreground">{user.state}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Country</span>
                {editing ? (
                  <Input value={form.country || ""} onChange={(e) => update("country", e.target.value)} className="w-48 h-8 text-sm" />
                ) : (
                  <span className="text-sm font-medium text-foreground">{user.country}</span>
                )}
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => navigate("/discover")}>
              Back to Discover
            </Button>
            <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => {
              localStorage.removeItem("user");
              toast({ title: "Logged out", description: "See you soon!" });
              navigate("/");
            }}>
              Log Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
