import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Upload, Eye, EyeOff, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-welcome.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    phone: "",
    password: "",
    name: "",
    gender: "",
    city: "",
    state: "",
    country: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 4) {
      toast({ title: "Limit reached", description: "You can upload up to 4 photos.", variant: "destructive" });
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setPhotos((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.password) {
      toast({ title: "Error", description: "Phone and password are required.", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    const user = {
      ...form,
      avatar: photos[0] || null,
      photos,
      username: form.name || form.phone,
    };
    localStorage.setItem("user", JSON.stringify(user));
    toast({ title: "Account created!", description: "Welcome to ChatFlow." });
    navigate("/discover");
  };

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="absolute inset-0 bg-foreground/70" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <MessageCircle className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary-foreground">ChatFlow</span>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md bg-card/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo uploads */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Upload Photos (up to 4)</Label>
              <div className="flex gap-2 flex-wrap">
                {photos.map((photo, i) => (
                  <div key={i} className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border border-border group">
                    <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[9px] text-center py-0.5">
                        Main
                      </span>
                    )}
                  </div>
                ))}
                {photos.length < 4 && (
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" multiple />
                    <div className="w-[72px] h-[72px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted hover:border-primary transition-colors">
                      <ImagePlus className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground mt-0.5">Add</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Gender</Label>
              <div className="flex gap-3">
                {["Male", "Female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => update("gender", g.toLowerCase())}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.gender === g.toLowerCase()
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="e.g. Uyo" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="e.g. Akwa Ibom" value={form.state} onChange={(e) => update("state", e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="e.g. Nigeria" value={form.country} onChange={(e) => update("country", e.target.value)} />
            </div>

            <Button type="submit" className="w-full" size="lg">Sign Up</Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
