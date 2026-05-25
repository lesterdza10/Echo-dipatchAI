"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Authentication from "./Authentication";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { div } from "motion/react-client";
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { set } from "mongoose";
import { setUserData } from "@/redux/userSlice";
import { useOnClickOutside } from "next/dist/next-devtools/dev-overlay/hooks/use-on-click-outside";
const navItems = ["Home", "About", "Bookings", "Contact"];
function Nav() {
  const dispatch = useDispatch<AppDispatch>();
  const pathName = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userData = useSelector((state: RootState) => state.user?.userData);
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({ redirect: false });
    dispatch(setUserData(null));
    setProfileOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[94%]
    md:w-[90%] z-50 rounded-full bg-black
    text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Image src={"/logo.png"} alt="Logo" width={60} height={60} priority />
          <div className="hidden md:flex items-center gap-15">
            {navItems.map((item, index) => {
              let href = "";
              if (item === "Home") {
                href = "/";
              } else {
                href = "/${item.toLowerCase()}";
              }
              const isActive = pathName === href;
              return (
                <Link
                  key={index}
                  href={href}
                  className={
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white text-sm font-bold"
                  }
                >
                  {item}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3 relative">
            <div className="hidden md:block relative">
              {!userData ? (
                <button
                  className="bg-white text-black py-1.5 px-4 rounded-full text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 right-0 w-[300px] bg-white text-black rounded-2xl shadow-xl border"
                      >
                        <div className="p-4 border-b">
                          <p className="font-semibold text-lg">
                            {userData.name}
                          </p>
                          <p className="text-xs uppercase text-gray-500 mb-4">
                            {userData.role}
                          </p>
                          {userData.role != "partner" && (
                            <div
                              className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl"
                              onClick={() => {
                                router.push("/partner/onboarding/vehicle");
                              }}
                            >
                              <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Bike size={16} />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Car size={16} />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Truck size={16} />
                                </div>
                              </div>
                              Become a Partner
                              <ChevronRight size={16} className="ml-auto" />
                            </div>
                          )}
                          <button
                            className="w-full py-2 flex gap-3 items-center hover:bg-gray-100 rounded-xl mt-2"
                            onClick={handleLogout}
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            <div className="md:hidden">
              {!userData ? (
                <button
                  className="bg-white text-black py-1.5 px-4 rounded-full text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                </>
              )}
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            <motion.div className="fixed top-[85px] left-1/2 -translate-x-1/2 w-[92%] bg-[#0B0B0B] rounded-2xl shadow-2xl z-40 md:hidden overflow-hidden">
              <div className="flex flex-col divide-y divite-white/10">
                {navItems.map((item, index) => {
                  let href = "";
                  if (item === "Home") {
                    href = "/";
                  } else {
                    href = "/${item.toLowerCase()}";
                  }
                  return (
                    <Link
                      key={index}
                      href={href}
                      className="px-6 py-4 text-gray-300 hover:bg-white/5"
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {profileOpen && userData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden"
            >
              <div className="p-4 border-b">
                <p className="font-semibold text-lg">{userData.name}</p>
                <p className="text-xs uppercase text-gray-500 mb-4">
                  {userData.role}
                </p>
                {userData.role != "partner" && (
                  <div
                    className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl"
                    onClick={() => {
                      router.push("/partner/onboarding/vehicle");
                    }}
                  >
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Bike size={16} />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Car size={16} />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                    </div>
                    Become a Partner
                    <ChevronRight size={16} className="ml-auto" />
                  </div>
                )}
                <button
                  className="w-full py-2 flex gap-3 items-center hover:bg-gray-100 rounded-xl mt-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Authentication open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default Nav;
