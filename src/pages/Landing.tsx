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
    // In production, this would open Calendly or similar
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
            <span className="font-display font-bold text-xl">LearnCampus</span>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              White-label Learning Platform
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Your Tuition Centre,{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Elevated</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A premium learning campus platform built for Singapore and Malaysia tuition centres. 
              Course builder, live classes, progress tracking, and parent portals—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app">
                <Button size="lg" className="gradient-hero text-primary-foreground hover:opacity-90 gap-2 px-8">
                  <Play className="h-4 w-4" />
                  View Demo
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2"
                onClick={handleBookCall}
              >
                Book a Call
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl shadow-xl border overflow-hidden">
              <div className="h-8 bg-muted flex items-center px-4 gap-2 border-b">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-warning/50" />
                <div className="w-3 h-3 rounded-full bg-success/50" />
                <span className="ml-4 text-xs text-muted-foreground">brightminds.learncampus.app</span>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 via-accent/5 to-background p-8 flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  {/* Dashboard Preview Cards */}
                  <div className="bg-card rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-accent" />
                      </div>
                      <span className="font-medium text-sm">Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">78%</div>
                    <div className="text-xs text-muted-foreground">Average completion</div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-3/4 gradient-accent rounded-full" />
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">Students</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">124</div>
                    <div className="text-xs text-muted-foreground">Active this month</div>
                    <div className="mt-3 flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-card" />
                      ))}
                      <div className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center border-2 border-card">
                        +
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-success" />
                      </div>
                      <span className="font-medium text-sm">Today</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-xs text-muted-foreground">Sessions scheduled</div>
                    <div className="mt-3 space-y-1">
                      <div className="h-1.5 bg-success/20 rounded-full w-full" />
                      <div className="h-1.5 bg-success/20 rounded-full w-4/5" />
                      <div className="h-1.5 bg-success/20 rounded-full w-3/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
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
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="gradient-hero rounded-2xl p-8 md:p-12 text-center text-primary-foreground"
            {...fadeInUp}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Centre?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join leading tuition centres in SG & MY already using LearnCampus to deliver premium learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Play className="h-4 w-4" />
                  View Demo
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 gap-2"
                onClick={handleGetStarted}
              >
                <CheckCircle2 className="h-4 w-4" />
                Get Started Free
              </Button>
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
            <span className="font-display font-semibold">LearnCampus</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 LearnCampus. Built for SG & MY Tuition Centres.
          </p>
        </div>
      </footer>
    </div>
  );
}
