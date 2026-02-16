import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import ProgramsSection from "@/components/ProgramsSection";
import RecentActions from "@/components/RecentActions";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsCounter />
      <ProgramsSection />
      <RecentActions />
      <AboutSection />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
