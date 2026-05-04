"use client";
import React, { useState } from "react";
import HeroSection from "./Herosection";
import Authentication from "./Authentication";

function Homepage() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <HeroSection onAuthRequired={() => setAuthOpen(true)} />
      <Authentication open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default Homepage;
