import { X, MapPin, Phone, Heart, MessageCircle, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  avatar: string | null;
  online: boolean;
  bio: string;
  photos?: string[];
}

interface UserProfileModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onChat: (user: UserProfile) => void;
}

const UserProfileModal = ({ user, onClose, onChat }: UserProfileModalProps) => {
  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Hero photo */}
          <div className="relative h-72 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
            {user.photos && user.photos[0] ? (
              <img
                src={user.photos[0]}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <span className="text-6xl font-bold text-primary/40">{initials}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />

            {/* Online badge */}
            {user.online && (
              <div className="absolute top-4 left-4">
                <Badge className="border-0 shadow-lg text-xs gap-1" style={{ backgroundColor: "hsl(var(--success))", color: "white" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Online now
                </Badge>
              </div>
            )}
          </div>

          {/* Profile info */}
          <div className="px-6 -mt-8 relative z-10 pb-6">
            <div className="flex items-end gap-3 mb-4">
              <Avatar className="w-16 h-16 border-4 border-card shadow-lg">
                {user.photos && user.photos[0] ? (
                  <AvatarImage src={user.photos[0]} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{user.city}, {user.state}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-muted/50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-foreground leading-relaxed">{user.bio}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {user.gender === "male" ? "👨 Male" : "👩 Female"}
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Country</p>
                <p className="text-sm font-semibold text-foreground">{user.country}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="text-sm font-semibold text-foreground truncate">{user.phone}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className={`text-sm font-semibold ${user.online ? "text-emerald-500" : "text-muted-foreground"}`}>
                  {user.online ? "🟢 Online" : "⚫ Offline"}
                </p>
              </div>
            </div>

            {/* Photo gallery */}
            {user.photos && user.photos.length > 1 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Photos</p>
                <div className="grid grid-cols-3 gap-2">
                  {user.photos.map((photo, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden">
                      <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified badge */}
            <div className="flex items-center gap-2 mb-5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Verified member of ChatFlow community</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => onChat(user)}
                className="flex-1 gap-2 rounded-xl h-12"
                size="lg"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chat
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl h-12 w-12 p-0"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfileModal;
