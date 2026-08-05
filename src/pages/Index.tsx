
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import BenefitsSection from '@/components/BenefitsSection';
import FeaturesSection from '@/components/FeaturesSection';
import SocialProofSection from '@/components/SocialProofSection';
import DemoSection from '@/components/DemoSection';
import CtaSection from '@/components/CtaSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import ExpertPanel from '@/components/ExpertPanel';

const Index = () => {
  const { hash } = useLocation();

  // Arriving from another route with a hash (e.g. /pricing -> /#contact) does not
  // scroll on its own — the router only changes the URL. Scroll once the target
  // exists; rAF gives the section components a frame to mount first.
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <BenefitsSection />
        <FeaturesSection />
        <SocialProofSection />
        <DemoSection />
        <ExpertPanel />
        <CtaSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
