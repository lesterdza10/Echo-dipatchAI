"use client";
import React, { useState } from "react";
import HeroSection from "./Herosection";
import Authentication from "./Authentication";
import Vehicleslider from "./Vehicleslider";

function Homepage() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <HeroSection onAuthRequired={() => setAuthOpen(true)} />
      <Authentication open={authOpen} onClose={() => setAuthOpen(false)} />
      <Vehicleslider />
    </>
  );
}

export default Homepage;
