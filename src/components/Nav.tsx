"use client"
import {motion} from 'motion/react'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const navItems = ['Home', 'About', 'Bookings', 'Contact']
function Nav() {
  const pathName=usePathname()
  return (
    <motion.div 
    initial={{ opacity: 0, y: -60 }}
    animate={{ opacity: 1, y: 0 }}
    className='fixed top-3 left-1/2 -translate-x-1/2 w-[94%]
    md:w-[90%] z-50 rounded-full bg-white/10
    text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3'>
      <div className='max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between'>
        <Image src={"/logo.png"} alt="Logo" width={60} height={60} priority />
         <div className='hidden md:flex items-center gap-15'>
        {navItems.map((item, index) =>{
          let href=''
          if(item === 'Home'){
            href='/'
          } else {
            href='/${item.toLowerCase()}'
          }
          const isActive = pathName === href
          return <Link key={index} href={href} className={isActive ? 'text-white' :'text-gray-400 hover:text-white text-sm font-bold'}>{item}</Link>
            
          
        })}
      </div>
      <button className="bg-white text-black py-1.5 px-4 rounded-full text-sm">login</button>
      </div>
     
    
    </motion.div>
  )
}

export default Nav
