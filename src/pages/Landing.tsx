import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  BarChart3, 
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LandingDemoStage } from "@/components/landing/DemoStage";

const features = [
  {
    icon: BookOpen,
    title: "Learning Journey Builder",
    description: "Create engaging courses with modular content blocks, quizzes, and interactive activities.",
  },
  {
    icon: Users,
    title: "Student & Parent Portals",
    description: "Separate portals for students to learn and parents to track progress and payments.",
  },
  {
    icon: Calendar,
    title: "Integrated Live Classes",
    description: "Schedule sessions with Google Meet links, track attendance, and attach recordings.",
  },
  {
    icon: BarChart3,
    title: "Progress Dashboards",
    description: "Real-time analytics on completion rates, at-risk students, and learning outcomes.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp-Ready Messaging",
    description: "Templates and copy-to-clipboard for seamless parent communication.",
  },
  {
    icon: GraduationCap,
    title: "Active Learning",
    description: "Micro-quizzes, whiteboard activities, reflections, and peer galleries.",
  },
];
const featureAccents = [
  "text-accent",
  "text-primary",
  "text-success",
  "text-warning",
  "text-info",
  "text-foreground",
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
};

export function LandingPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBookCall = () => {
    toast({
      title: "Book a Call",
      description: "Redirecting to scheduling page...",
    });
    window.open("https://calendly.com", "_blank");
  };

  const handleGetStarted = () => {
    navigate("/auth/signin");
    toast({
      title: "Get Started",
      description: "Create your free account to get started.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-learning flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-xl">LearnCampus</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app">
              <Button variant="ghost" size="sm">View Demo</Button>
            </Link>
            <Link to="/auth/signin">
              <Button size="sm" className="gradient-hero text-primary-foreground hover:opacity-90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Compact */}
      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              White-label Learning Platform
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 text-foreground">
              Your Tuition Centre,{" "}
              <span className="text-accent">Elevated</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
              A premium learning platform built for Singapore and Malaysia tuition centres. 
              Course builder, live classes, progress tracking, and parent portals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/app">
                <Button size="default" className="gap-2">
                  <Play className="h-4 w-4" />
                  View Demo
                </Button>
              </Link>
              <Button 
                size="default" 
                variant="outline" 
                className="gap-2"
                onClick={handleBookCall}
              >
                Book a Call
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unified Demo Stage - tabs + auto-rotation */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <LandingDemoStage />
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-14 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Everything Your Centre Needs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for Singapore and Malaysia tuition centres with features that matter.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-primary/5 via-accent/5 to-muted/50 p-6 shadow-md shadow-black/5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="w-12 h-12 rounded-xl border border-border/60 bg-gradient-to-br from-primary/12 via-accent/10 to-secondary/30 shadow-sm flex items-center justify-center mb-4 transition-all duration-200 group-hover:shadow-md group-hover:border-primary/30">
                  <feature.icon className={`h-6 w-6 ${featureAccents[index % featureAccents.length]}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-foreground via-foreground to-foreground/90 p-10 md:p-16 text-center text-primary-foreground shadow-lg shadow-black/20"
            {...fadeInUp}
          >
            <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_18%_22%,hsl(var(--accent)/0.25),transparent_42%),radial-gradient(circle_at_82%_12%,hsl(var(--primary)/0.25),transparent_38%),radial-gradient(circle_at_50%_100%,hsl(var(--muted-foreground)/0.2),transparent_45%)]" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-primary-foreground">
                Ready to Transform Your Centre?
              </h2>
              <p className="text-primary-foreground/80 mb-10 max-w-lg mx-auto">
                Join leading tuition centres in SG & MY already using LearnCampus to deliver premium learning experiences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/app">
                  <Button size="lg" variant="secondary" className="gap-2 bg-background text-foreground hover:bg-background/90">
                    <Play className="h-4 w-4" />
                    View Demo
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="default"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleGetStarted}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Get Started Free
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-learning flex items-center justify-center">
              <GraduationCap className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold">LearnCampus</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 LearnCampus. Built for SG & MY Tuition Centres.
          </p>
        </div>
      </footer>
    </div>
  );
}

