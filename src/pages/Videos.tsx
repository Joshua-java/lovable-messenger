import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Play, MapPin, Heart, MessageCircle, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPost {
  id: string;
  videoUrl: string;
  caption: string;
  senderName: string;
  senderCity: string;
  time: string;
  likes: number;
  liked: boolean;
}

const MOCK_VIDEOS: VideoPost[] = [
  {
    id: "v1",
    videoUrl: "",
    caption: "Beautiful morning in Uyo! 🌅 The streets are alive today.",
    senderName: "Aniekan Udoh",
    senderCity: "Uyo",
    time: "2 hours ago",
    likes: 24,
    liked: false,
  },
  {
    id: "v2",
    videoUrl: "",
    caption: "Market day in Eket! Come and buy fresh fish 🐟",
    senderName: "Emem Bassey",
    senderCity: "Eket",
    time: "5 hours ago",
    likes: 18,
    liked: false,
  },
  {
    id: "v3",
    videoUrl: "",
    caption: "My latest fashion design showcase ✨ DM for orders!",
    senderName: "Blessing Edet",
    senderCity: "Uyo",
    time: "1 day ago",
    likes: 45,
    liked: false,
  },
  {
    id: "v4",
    videoUrl: "",
    caption: "Calabar carnival vibes! 🎉🎶",
    senderName: "Grace Okon",
    senderCity: "Calabar",
    time: "2 days ago",
    likes: 67,
    liked: false,
  },
];

const Videos = () => {
  const navigate = useNavigate();
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const fileRef = useRef<HTMLInputElement>(null);

  const [videos, setVideos] = useState<VideoPost[]>(MOCK_VIDEOS);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!uploadFile) return;
    const newVideo: VideoPost = {
      id: `user-${Date.now()}`,
      videoUrl: URL.createObjectURL(uploadFile),
      caption: uploadCaption || "Check out my video! 🎬",
      senderName: user?.name || "You",
      senderCity: user?.city || "",
      time: "Just now",
      likes: 0,
      liked: false,
    };
    setVideos((prev) => [newVideo, ...prev]);
    setShowUpload(false);
    setUploadFile(null);
    setUploadPreview(null);
    setUploadCaption("");
  };

  const toggleLike = (id: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 } : v
      )
    );
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate("/discover")} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <Play className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Videos</span>
        </div>
        <ThemeToggle />
        <Button size="sm" onClick={() => setShowUpload(true)} className="rounded-full gap-1.5">
          <Plus className="w-4 h-4" /> Upload
        </Button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-2xl"
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Upload Video</h3>

              <input ref={fileRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

              {uploadPreview ? (
                <div className="mb-4">
                  <video src={uploadPreview} controls className="w-full rounded-xl max-h-48 bg-muted" />
                  <button
                    onClick={() => { setUploadFile(null); setUploadPreview(null); }}
                    className="text-xs text-destructive mt-2"
                  >
                    Remove video
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors mb-4"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tap to select a video</span>
                </button>
              )}

              <textarea
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 border-0 outline-none focus:ring-2 focus:ring-primary/30"
              />

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setShowUpload(false)} className="flex-1 rounded-full">Cancel</Button>
                <Button onClick={handleUpload} disabled={!uploadFile} className="flex-1 rounded-full">Post Video</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto py-4 px-4 space-y-4">
          {videos.map((video, i) => {
            const initials = video.senderName.split(" ").map((n) => n[0]).join("");
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                {/* Video Player or Placeholder */}
                {video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full aspect-video bg-muted"
                    preload="metadata"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{video.senderName}</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{video.senderCity} • {video.time}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-3">{video.caption}</p>

                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    <button
                      onClick={() => toggleLike(video.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        video.liked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${video.liked ? "fill-current" : ""}`} />
                      {video.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Comment
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Videos;
