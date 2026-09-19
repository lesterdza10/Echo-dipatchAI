"use client";
import axios from "axios";
import { useState } from "react";
import { CircleDashed, Lock, Mail, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { signIn } from "next-auth/react";
type stepType = "login" | "signup" | "otp";
function Authentication({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<stepType>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const handleSignup = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setStep("otp");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setErr(
        error.response.data.error || "An error occurred during registration",
      );
    }
  };
  const handleVerifyEmail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/verify-email", {
        email,
        otp: otp.join(""),
      });
      setStep("login");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setErr(
        error.response.data.error || "An error occurred while verifying email",
      );
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setErr("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Sign-in result:", result);

      if (result?.error) {
        const errorMsg = result.error || "Invalid email or password";
        setErr(errorMsg);
        console.error("Sign-in error:", errorMsg);
      } else if (result?.ok) {
        console.log("Login successful:", result);
        setErr("");
        //onClose();
      } else {
        setErr("Invalid email or password");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErr(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    await signIn("google");
  };
  const handleOTPChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-90 bg-black/50 backdrop-blur"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="fixed inset-0 z-100 flex items-center justify-center px-4"
            >
              <div className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 text-black shadow-[0_40px_100px_rgba(0,0,0,0.35)] sm:p-8">
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-500 transition hover:text-black"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-extrabold tracking-widest">
                    ECHO-DISPATCH
                  </h1>
                  <p className="text-xs mt-1 text-gray-600">
                    Premium waste truck booking
                  </p>
                </div>
                <button
                  className="flex h-11 w-full rounded-xl border border-black items-center justify-center gap-3 text-sm font-semibold hover:bg-black hover:text-white transition-colors"
                  onClick={handleGoogleLogin}
                >
                  <Image
                    src={"/google.png"}
                    alt="Google Logo"
                    width={18}
                    height={18}
                  />
                  Sign in with Google
                </button>
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/80" />
                  <div className="text-sm text-gray-500">OR</div>
                  <div className="h-px flex-1 bg-black/80" />
                </div>
                <div>
                  {step === "login" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <h1 className="text-xl font-semibold">Welcome Back!</h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-500" />
                          <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-500" />
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          />
                        </div>
                        {err && <p className="text-red-500 text-sm">*{err}</p>}
                        <button
                          className="flex h-11 w-full items-center justify-center rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                          onClick={handleLogin}
                          disabled={loading}
                        >
                          {!loading ? (
                            "Login"
                          ) : (
                            <CircleDashed
                              size={20}
                              color="white"
                              className="animate-spin"
                            />
                          )}
                        </button>
                      </div>
                      <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setStep("signup")}
                          className="text-black font-medium hover:underline cursor-pointer bg-transparent border-0 p-0"
                        >
                          Sign up
                        </button>
                      </p>
                    </motion.div>
                  )}
                  {step === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <h1 className="text-xl font-semibold">
                        Create an Account
                      </h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <User size={18} className="text-gray-500" />
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                          />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-500" />
                          <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-500" />
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          />
                        </div>
                        {err && <p className="text-red-500 text-sm">*{err}</p>}
                        <button
                          className="flex h-11 w-full items-center justify-center rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                          disabled={loading}
                          onClick={handleSignup}
                        >
                          {!loading ? (
                            "Send OTP"
                          ) : (
                            <CircleDashed
                              size={20}
                              color="white"
                              className="animate-spin"
                            />
                          )}
                        </button>
                      </div>
                      <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setStep("login")}
                          className="text-black font-medium hover:underline cursor-pointer bg-transparent border-0 p-0"
                        >
                          Log in
                        </button>
                      </p>
                    </motion.div>
                  )}
                  {step === "otp" && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-xl font-semibold">
                        Verify Your Email
                      </h2>
                      <div className="mt-6 flex justify-between gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            id={`otp-${index}`}
                            value={digit}
                            maxLength={1}
                            className="w-10 h-12 sm:w-12 sm:h-12 text-center text-lg border border-black/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={(e) =>
                              handleOTPChange(index, e.target.value)
                            }
                          />
                        ))}
                      </div>
                      {err && <p className="text-red-500 text-sm">*{err}</p>}

                      <button
                        className="mt-6 w-full h-11 flex justify-center items-center rounded-xl bg-black text-white font-semibold hover:bg-gray-500 transition"
                        onClick={handleVerifyEmail}
                      >
                        {!loading ? (
                          "Verify and Create Account"
                        ) : (
                          <CircleDashed
                            size={20}
                            color="white"
                            className="animate-spin"
                          />
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Authentication;
