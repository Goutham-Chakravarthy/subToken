import Header from '@/components/landing/Header';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      {/* <FeaturesGrid /> */}
      <HowItWorks />
      {/* <Testimonials /> */}
      <CTASection />
      <Footer />
    </main>
  );
}
