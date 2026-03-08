import { Link } from "react-router-dom";
import { MessageCircle, Video, Users, Globe, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import heroImage from "@/assets/hero-welcome.jpg";
import { motion } from "framer-motion";

const floatingAnim = (delay: number, y: number = 20) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Floating decorative blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-40 right-20 w-4 h-4 rounded-full bg-primary/30 animate-bounce" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-60 left-20 w-3 h-3 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-40 left-1/3 w-5 h-5 rounded-full bg-primary/15 animate-bounce" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-32 right-1/3 w-2 h-2 rounded-full bg-primary/40 animate-ping" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-6 md:px-12 py-5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">ChatFlow</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="rounded-full px-5">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
          <motion.div {...floatingAnim(0.1)} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Zap className="w-3.5 h-3.5" />
              Connect with people near you
            </span>
          </motion.div>

          <motion.h1
            {...floatingAnim(0.2, 30)}
            className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1] max-w-3xl tracking-tight"
          >
            Chat, Share &{" "}
            <span className="text-primary relative">
              Connect
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>{" "}
            Locally
          </motion.h1>

          <motion.p
            {...floatingAnim(0.35, 25)}
            className="text-lg md:text-xl text-muted-foreground mt-6 max-w-lg leading-relaxed"
          >
            Discover people in your region, share videos with your community, and build meaningful connections.
          </motion.p>

          <motion.div {...floatingAnim(0.5, 20)} className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link to="/signup">
              <Button size="lg" className="text-base px-8 rounded-full h-12 shadow-lg shadow-primary/25">
                Create Account <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base px-8 rounded-full h-12">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...floatingAnim(0.65)}
            className="flex items-center gap-8 md:gap-12 mt-16 text-center"
          >
            {[
              { label: "Active Users", value: "2K+" },
              { label: "Communities", value: "50+" },
              { label: "Messages/Day", value: "10K+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Features */}
        <div className="px-6 md:px-12 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, title: "Proximity Chat", desc: "Find and chat with people near you. Filter by gender, city, and region." },
              { icon: Video, title: "Video Sharing", desc: "Upload and watch community videos. Share moments with your local network." },
              { icon: Globe, title: "Community Groups", desc: "Join locality-based group chats and stay connected with your community." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure • Private • Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
