"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

import img1 from '../assets/highlights/haxlr8_crew_group.jpg';
import img2 from '../assets/highlights/haxlr8_mentorship.png';
import img3 from '../assets/highlights/haxlr8_smart_demo.png';
import img4 from '../assets/highlights/haxlr8_jury_pitch.png';
import img5 from '../assets/highlights/haxlr8_team_defense.png';
import img6 from '../assets/highlights/haxlr8_hardware_lab.png';
import img7 from '../assets/highlights/haxlr8_squad_celebration.jpg';
import img8 from '../assets/highlights/haxlr8_prototype_review.jpg';
import img9 from '../assets/highlights/haxlr8_stage_pitch.jpg';
import img10 from '../assets/highlights/haxlr8_smart_glasses_pitch.jpg';

export const products = [
  { title: "Grand Cohort Assembly", thumbnail: img1 },
  { title: "Faculty Mentorship", thumbnail: img2 },
  { title: "Smart Screen Prototyping", thumbnail: img3 },
  { title: "Jury Pitch Arena", thumbnail: img4 },
  { title: "Hands-on Tech Defense", thumbnail: img5 },
  { title: "Hardware Lab Prototyping", thumbnail: img6 },
  { title: "Squad Celebration", thumbnail: img7 },
  { title: "Circuit & PCB Inspection", thumbnail: img8 },
  { title: "Auditorium Stage Keynote", thumbnail: img9 },
  { title: "Healthcare Smart Glasses", thumbnail: img10 },
  { title: "Embedded Systems Sprint", thumbnail: img6 },
  { title: "Grand Jury Evaluation", thumbnail: img8 },
  { title: "Live Solution Demo", thumbnail: img3 },
  { title: "Final Stage Spotlight", thumbnail: img9 },
  { title: "Championship Arena", thumbnail: img1 },
];

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

