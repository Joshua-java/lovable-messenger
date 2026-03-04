import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-welcome.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      {/* Fullscreen background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-foreground/60" />

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-primary-foreground">ChatFlow</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/signup">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight max-w-2xl">
            Connect with anyone, <span className="text-primary">anywhere</span>.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mt-4 max-w-md">
            Simple, fast, and reliable messaging. Start chatting today.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/signup">
              <Button size="lg" className="text-base px-8">Create Account</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
