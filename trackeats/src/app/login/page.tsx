// "use client";
// import { motion } from "motion/react";
// import {
//   Leaf,
//   Mail,
//   Lock,
//   EyeIcon,
//   EyeOff,
//   Loader2,
//   LogIn,
// } from "lucide-react";
// import React, { useState } from "react";
// import Image from "next/image";
// import googleImage from "@/assets/google.png";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       });

//       if (res?.ok) {
//         router.push("/");
//       }
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
//       <motion.h1
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-4xl font-extrabold text-green-700 mb-2"
//       >
//         Welcome back!
//       </motion.h1>
//       <p className="text-gray-600 mb-8 flex items-center">
//         Login to TrackEats <Leaf className="w-5 h-5 text-green-600" />
//       </p>

//       <motion.form
//         onSubmit={handleLogin}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="flex flex-col gap-5 w-full max-w-sm"
//       >
//         <div className="relative">
//           <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Your Email"
//             className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//           />
//         </div>

//         <div className="relative">
//           <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Your Password"
//             className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//           />
//           {showPassword ? (
//             <EyeOff
//               className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
//               onClick={() => setShowPassword(false)}
//             />
//           ) : (
//             <EyeIcon
//               className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
//               onClick={() => setShowPassword(true)}
//             />
//           )}
//         </div>

//         {(() => {
//           const formValidation = email !== "" && password !== "";
//           return (
//             <button
//               disabled={!formValidation || loading}
//               className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
//                 formValidation
//                   ? "bg-green-600 hover:bg-green-700 text-white"
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
//             </button>
//           );
//         })()}

//         <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
//           <span className="flex-1 h-px bg-gray-200"></span>
//           OR
//           <span className="flex-1 h-px bg-gray-200"></span>
//         </div>

//         <button
//           type="button"
//           className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200"
//           onClick={() => signIn("google", { callbackUrl: "/" })}
//         >
//           <Image src={googleImage} width={20} height={20} alt="google" />
//           Continue with Google
//         </button>
//       </motion.form>
//       <p
//         className="cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1"
//         onClick={() => router.push("/register")}
//       >
//         Want to create an account ? <LogIn className="w-4 h-4" />{" "}
//         <span className="text-green-600"> Sign up</span>
//       </p>
//     </div>
//   );
// };

// export default Login;

"use client";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import {
  Leaf,
  Mail,
  Lock,
  EyeIcon,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import googleImage from "@/assets/google.png";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

/* ─── Floating Orb ─── */
const Orb = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`}
    animate={{
      scale: [1, 1.18, 1],
      x: [0, 18, -10, 0],
      y: [0, -14, 10, 0],
    }}
    transition={{
      duration: 9,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

/* ─── Animated grid lines ─── */
const GridLines = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path
          d="M 48 0 L 0 0 0 48"
          fill="none"
          stroke="#4ade80"
          strokeWidth="0.8"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

/* ─── Tilt card wrapper ─── */
const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useTransform(rx, (v) => `${v}deg`);
  const rotateY = useTransform(ry, (v) => `${v}deg`);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    animate(ry, x * 8, { duration: 0.15 });
    animate(rx, -y * 8, { duration: 0.15 });
  };

  const handleLeave = () => {
    animate(rx, 0, { duration: 0.5, ease: "easeOut" });
    animate(ry, 0, { duration: 0.5, ease: "easeOut" });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="w-full max-w-sm"
    >
      {children}
    </motion.div>
  );
};

/* ─── Main Component ─── */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.ok) {
        router.push("/");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const formValidation = email !== "" && password !== "";

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#060d0a]">
      {/* ── Background layer ── */}
      <GridLines />
      <Orb className="w-130 h-130 bg-green-500 -top-32 -left-32" delay={0} />
      <Orb
        className="w-100 h-100px bg-emerald-400 -bottom-24 -right-24"
        delay={2.5}
      />
      <Orb className="w-65 h-65 bg-teal-300 top-1/3 right-1/4" delay={5} />

      {/* ── Radial spotlight ── */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(74,222,128,0.15),transparent)]" />

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center w-full px-6"
      >
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-green-400 to-emerald-600 shadow-[0_0_40px_rgba(74,222,128,0.45)]"
        >
          <Leaf className="w-7 h-7 text-white drop-shadow" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-black tracking-tight text-white mb-1"
          style={{ fontFamily: "'Sora', 'Inter', sans-serif" }}
        >
          Welcome{" "}
          <span className="bg-linear-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
            back
          </span>
          .
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm text-zinc-400 mb-9 tracking-wide"
        >
          Sign in to continue to{" "}
          <span className="text-green-400 font-semibold">TrackEats</span>
        </motion.p>

        {/* Card */}
        <TiltCard>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_64px_rgba(0,0,0,0.6)] p-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Inner glow border */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-green-400/10 via-transparent to-teal-400/5" />

            <motion.form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Email */}
              <div className="relative group">
                <motion.div
                  animate={{ opacity: focused === "email" ? 1 : 0 }}
                  className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-green-500/40 to-emerald-500/40 blur-sm pointer-events-none"
                />
                <div className="relative flex items-center rounded-2xl bg-white/6 border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/20">
                  <Mail
                    className={`absolute left-4 w-4 h-4 transition-colors duration-200 ${
                      focused === "email" ? "text-green-400" : "text-zinc-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Email address"
                    className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none"
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative group">
                <motion.div
                  animate={{ opacity: focused === "password" ? 1 : 0 }}
                  className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-green-500/40 to-emerald-500/40 blur-sm pointer-events-none"
                />
                <div className="relative flex items-center rounded-2xl bg-white/6 border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/20">
                  <Lock
                    className={`absolute left-4 w-4 h-4 transition-colors duration-200 ${
                      focused === "password"
                        ? "text-green-400"
                        : "text-zinc-500"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full bg-transparent py-3.5 pl-11 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none"
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <button
                    type="button"
                    className="absolute right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              {(() => {
                return (
                  <motion.button
                    disabled={!formValidation || loading}
                    whileHover={
                      formValidation && !loading ? { scale: 1.02 } : {}
                    }
                    whileTap={formValidation && !loading ? { scale: 0.97 } : {}}
                    className={`relative mt-1 w-full font-bold py-3.5 rounded-2xl text-sm transition-all duration-300 inline-flex items-center justify-center gap-2 overflow-hidden ${
                      formValidation
                        ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_32px_rgba(74,222,128,0.35)] hover:shadow-[0_0_48px_rgba(74,222,128,0.5)]"
                        : "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5"
                    }`}
                  >
                    {formValidation && (
                      <motion.span
                        className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -skew-x-12"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1,
                        }}
                      />
                    )}
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                );
              })()}

              {/* Divider */}
              <div className="flex items-center gap-3 text-zinc-600 text-xs my-1">
                <span className="flex-1 h-px bg-white/8" />
                OR
                <span className="flex-1 h-px bg-white/8" />
              </div>

              {/* Google */}
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-3 border border-white/10 bg-white/4 hover:border-white/20 py-3.5 rounded-2xl text-zinc-300 text-sm font-medium transition-all duration-200"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <Image src={googleImage} width={18} height={18} alt="google" />
                Continue with Google
              </motion.button>
            </motion.form>
          </motion.div>
        </TiltCard>

        {/* Footer link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="cursor-pointer text-zinc-500 mt-6 text-sm flex items-center gap-1.5 group"
          onClick={() => router.push("/register")}
        >
          Don&apos;t have an account?
          <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors flex items-center gap-1">
            Sign up <LogIn className="w-3.5 h-3.5" />
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
