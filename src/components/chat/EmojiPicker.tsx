import { useState } from "react";
import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const EMOJI_CATEGORIES = [
  { label: "😊", emojis: ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","🥰","😘","😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","☹️","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰","😱","🥵","🥶","😳","🤪","😵","🥴","😠","😡","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"] },
  { label: "👋", emojis: ["👋","🤚","🖐","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁","👅","👄"] },
  { label: "❤️", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","♥️","💌","💋","💍","💎","🔥","⭐","🌟","✨","⚡","💫","🌈","☀️","🌤","⛅","🌥","🌦","🌧","⛈","🌩","🌪","🌫","🌬","🌀","🌊"] },
  { label: "🎉", emojis: ["🎉","🎊","🎈","🎁","🎂","🍰","🧁","🎄","🎃","🎗","🎟","🎫","🏆","🥇","🥈","🥉","⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🥍","🏏","🪃","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸","🥌","🎿","⛷","🏂"] },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary shrink-0">
          <Smile className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" side="top" align="start">
        <div className="flex gap-1 border-b border-border pb-2 mb-2">
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`text-lg px-2 py-1 rounded transition-colors ${activeTab === i ? "bg-accent" : "hover:bg-muted"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-0.5 max-h-48 overflow-y-auto">
          {EMOJI_CATEGORIES[activeTab].emojis.map((emoji, i) => (
            <button
              key={i}
              onClick={() => { onSelect(emoji); setOpen(false); }}
              className="text-xl p-1 rounded hover:bg-accent transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
