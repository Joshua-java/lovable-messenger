import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-welcome.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold text-foreground">ChatFlow</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/about">
            <Button variant="ghost" size="sm">About</Button>
          </Link>
          <Link to="/chat">
            <Button variant="ghost" size="sm">Sign Up</Button>
          </Link>
          <Link to="/chat">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/chat">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-6 md:px-12 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Connect with anyone, <span className="text-primary">anywhere</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
            Simple, fast, and reliable messaging. Start chatting with friends and family today.
          </p>
          <Link to="/chat">
            <Button size="lg" className="mt-4 text-base px-8">
              Start Chatting
            </Button>
          </Link>
        </div>
        <div className="flex-1 max-w-lg">
          <img
            src={heroImage}
            alt="Welcome to ChatFlow"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default Index;
