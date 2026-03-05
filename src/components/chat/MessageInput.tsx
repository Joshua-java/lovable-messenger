import { useState, useRef } from "react";
import { Send, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "./EmojiPicker";

interface MessageInputProps {
  onSendText: (text: string) => void;
  onSendImage: (file: File, caption?: string) => void;
  placeholder?: string;
}

const MessageInput = ({ onSendText, onSendImage, placeholder = "Type a message..." }: MessageInputProps) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (imageFile) {
      onSendImage(imageFile, text || undefined);
      setImageFile(null);
      setImagePreview(null);
      setText("");
      return;
    }
    if (!text.trim()) return;
    onSendText(text.trim());
    setText("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-border bg-card">
      {imagePreview && (
        <div className="px-4 pt-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
            <button onClick={clearImage} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 px-4 py-3">
        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
        <Button variant="ghost" size="icon" onClick={() => fileRef.current?.click()} className="text-muted-foreground hover:text-primary shrink-0">
          <ImagePlus className="w-5 h-5" />
        </Button>
        <EmojiPicker onSelect={handleEmojiSelect} />
        <Input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={placeholder}
          className="flex-1 bg-muted border-0"
        />
        <Button onClick={handleSend} size="icon" disabled={!text.trim() && !imageFile} className="shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
