"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

import img1 from '../assets/highlights/haxlr8_crew_group.jpg';
import img2 from '../assets/highlights/haxlr8_mentorship.png';
import img3 from '../assets/highlights/haxlr8_smart_demo.png';
import img4 from '../assets/highlights/haxlr8_jury_pitch.png';
import img5 from '../assets/highlights/haxlr8_team_defense.png';

export const products = [
  { title: "Grand Cohort", thumbnail: img1 },
  { title: "Mentorship & Guidance", thumbnail: img2 },
  { title: "Smart Screen Prototyping", thumbnail: img3 },
  { title: "Jury Pitch Arena", thumbnail: img4 },
  { title: "Hands-on Tech Defense", thumbnail: img5 },
  { title: "AI Integration", thumbnail: img1 },
  { title: "Machine Learning", thumbnail: img2 },
  { title: "Cloud Architecture", thumbnail: img3 },
  { title: "Neural Networks", thumbnail: img4 },
  { title: "Quantum Computing", thumbnail: img5 },
  { title: "Data Analytics", thumbnail: img1 },
  { title: "Cybersecurity", thumbnail: img2 },
  { title: "Blockchain Tech", thumbnail: img3 },
  { title: "IoT Devices", thumbnail: img4 },
  { title: "Edge Computing", thumbnail: img5 },
];

