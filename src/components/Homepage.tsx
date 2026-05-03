"use client"
import React ,{useState} from 'react'
import HeroSection from './Herosection'
import Authentication from './Authentication'

function Homepage() {
  const [authOpen, setAuthOpen] =useState(true)
  return (
    <>
      <HeroSection />
      <Authentication open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default Homepage
