import { motion } from "framer-motion";  
import { FileWarning } from "lucide-react";  
import { useEffect, useState } from "react";  

// Helper: Slice text into array of slices (pseudo lines)  
const glitchSlices = [  
  { translate: -8, color: "text-cyan-400", blur: "blur-[2px]" },  
  { translate: 8, color: "text-fuchsia-500", blur: "" },  
  { translate: -3, color: "text-blue-500", blur: "blur-sm" },  
];  

export default function NotFoundPage() {  
  const [showGlitch, setShowGlitch] = useState(false);  

  useEffect(() => {  
    const interval = setInterval(() => {  
      setShowGlitch((prev) => !prev);  
    }, 900);  
    return () => clearInterval(interval);  
  }, []);  

  return (  
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 text-neutral-100">  
      {/* Animated background gradient */}  
      <motion.div  
        initial={{ opacity: 0 }}  
        animate={{ opacity: 0.3 }}  
        transition={{ duration: 2 }}  
        className="absolute inset-0 -z-20 bg-gradient-to-br from-fuchsia-900/40 via-black to-cyan-900/40 blur-3xl"  
      />  
      {/* Scanning lines effect */}  
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_2px] animate-pulse" />  
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:22px_22px]" />  

      {/* Content */}  
      <motion.div  
        initial={{ opacity: 0, y: -40 }}  
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.7 }}  
        className="flex flex-col items-center text-center space-y-8 px-4"  
      >  
        {/* Warning Icon */}  
        <motion.div
          animate={{
            y: [0, -15, 0], // subtle bounce
            rotate: [0, -5, 5, 0], // small rotate for dynamic effect
            scale: [1, 1.15, 0.95, 1], // slight pulsate
          }}
          transition={{
            duration: 2.5,
            repeat: 0,
            repeatType: "loop",
          }}
        >
          <FileWarning className="w-20 h-20 text-rose-500 drop-shadow-[0_0_18px_rgba(244,63,94,0.8)]" />
        </motion.div>

        {/* Multi-layered glitch text */}  
        <div className="relative font-extrabold tracking-widest text-7xl md:text-8xl select-none">  
          {glitchSlices.map((slice, idx) => (  
            <motion.span  
              key={idx}  
              initial={false}  
              animate={showGlitch  
                ? { x: slice.translate, opacity: 0.8 }  
                : { x: 0, opacity: 0.4 }}  
              transition={{  
                type: "spring",  
                stiffness: 120,  
                damping: 8,  
                repeat: Infinity,  
                repeatType: "reverse",  
                duration: 0.9,  
                delay: idx * 0.15  
              }}  
              className={`absolute top-0 left-0 w-full ${slice.color} ${slice.blur} pointer-events-none`}  
              aria-hidden="true"  
            >  
              404  
            </motion.span>  
          ))}  
          <motion.span  
            animate={showGlitch ? { color: "#06b6d4" } : { color: "#a21caf" }}  
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}  
            className="relative"  
            style={{  
              textShadow: showGlitch  
                ? "0 0 20px #06b6d4"  
                : "0 0 16px #a21caf"  
            }}  
          >  
            404  
          </motion.span>  
        </div>  

        {/* Message */}  
        <p className="max-w-md text-lg text-neutral-400 leading-relaxed">  
          The page you’re searching for doesn’t exist.    
          You might have mistyped the address.  
        </p>  

        {/* Return button */}  
        <a href="/">  
          <motion.button  
            whileHover={{  
              scale: 1.08,  
              rotate: "-2deg",  
              boxShadow: "0 0 35px rgba(34,211,238,0.7)",  
            }}  
            whileTap={{ scale: 0.94 }}  
            className="rounded-2xl backdrop-blur-md bg-white/10 border border-white/10   
                       px-10 py-3 text-lg font-semibold   
                       text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]   
                       transition duration-300 hover:bg-gradient-to-r   
                       from-fuchsia-600 via-purple-600 to-cyan-500"  
          >  
            Return Home  
          </motion.button>  
        </a>  
      </motion.div>  
    </div>  
  );  
}