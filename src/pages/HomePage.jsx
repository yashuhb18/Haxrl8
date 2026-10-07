import React from 'react';
import PlayfulHeroSection from '../components/hero/PlayfulHeroSection';
import PlayfulAboutSection from '../components/sections/PlayfulAboutSection';
import PlayfulDomainsSection from '../components/sections/PlayfulDomainsSection';
import PlayfulTimelineSection from '../components/sections/PlayfulTimelineSection';
import PlayfulPrizesSection from '../components/sections/PlayfulPrizesSection';
import PlayfulGuidelinesSection from '../components/sections/PlayfulGuidelinesSection';
import PlayfulFaqSection from '../components/sections/PlayfulFaqSection';
import PlayfulCtaSection from '../components/sections/PlayfulCtaSection';

export default function HomePage() {
  return (
    <main style={{ backgroundColor: '#fffaf3', color: '#0f172a', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 1. Playful Hero Section */}
      <PlayfulHeroSection />

      {/* 2. Playful About Section (What is HAXLR8 3.0?) */}
      <PlayfulAboutSection />

      {/* 3. Playful Domains Section */}
      <PlayfulDomainsSection />

      {/* 4. Flight Timeline (Dark purple space section with smooth wave transitions) */}
      <PlayfulTimelineSection />

      {/* 5. Prizes Section (3D Golden Trophy + ₹30,000 Total Prize Pool) */}
      <PlayfulPrizesSection />

      {/* 6. Guidelines & Protocols (Sector 1 Essentials & Sector 2 Logistics) */}
      <PlayfulGuidelinesSection />

      {/* 7. Frequently Asked Questions */}
      <PlayfulFaqSection />

      {/* 8. Final CTA: Ready To Launch? */}
      <PlayfulCtaSection />
    </main>
  );
}
