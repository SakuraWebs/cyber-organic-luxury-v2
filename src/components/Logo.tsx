import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  loading?: boolean;
}

export default function Logo({ className, loading = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-4 group cursor-pointer", className)}>
      <div className="relative w-10 h-10 md:w-12 md:h-12">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Scan Line Effect - Only during loading */}
          {loading && (
            <motion.rect
              initial={{ y: 0, opacity: 0 }}
              animate={{ 
                y: [0, 100, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              x="5"
              width="90"
              height="1"
              fill="url(#scanGradient)"
              className="z-10"
            />
          )}

          <defs>
            <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="var(--color-brand-cyan)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Outer Hexagon - Digital Precision */}
          <motion.path
            initial={loading ? { pathLength: 0, opacity: 0 } : false}
            animate={loading ? { 
              pathLength: [0, 1, 1],
              opacity: [0, 0.2, 0.1],
              scale: [0.95, 1.05, 1]
            } : { opacity: 0.2 }}
            transition={loading ? { 
              duration: 3,
              repeat: Infinity,
              times: [0, 0.5, 1]
            } : { duration: 0.7 }}
            d="M50 5L89.3 27.5V72.5L50 95L10.7 72.5V27.5L50 5Z"
            stroke="currentColor"
            strokeWidth="2"
            className="text-brand-gold"
          />
          
          {/* Inner Geometric Structure */}
          <motion.path
            initial={loading ? { opacity: 0, scale: 0.8 } : false}
            animate={loading ? { 
              opacity: [0, 0.6, 0.3],
              scale: [0.8, 1.1, 1],
              rotate: [0, 10, 0]
            } : { opacity: 0.3 }}
            transition={loading ? { 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            } : { duration: 0.7 }}
            d="M50 20L76 35V65L50 80L24 65V35L50 20Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="text-brand-cyan"
          />

          {/* Organic "S" / Vine - The "Organic" part */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: loading ? 1.5 : 2, 
              ease: "easeInOut",
              repeat: loading ? Infinity : 0,
              repeatDelay: loading ? 1 : 0
            }}
            d="M35 70C35 70 45 75 60 60C75 45 70 30 70 30C70 30 65 25 50 40C35 55 40 70 40 70"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-brand-cyan"
          />

          {/* Central Pulse - The "Cyber" part */}
          <motion.circle
            animate={loading ? {
              r: [4, 8, 4],
              opacity: [1, 0.5, 1],
              fill: ["#D4AF37", "#00FFFF", "#D4AF37"]
            } : {}}
            transition={loading ? {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
            cx="50"
            cy="50"
            r="4"
            fill="currentColor"
            className={cn("text-brand-gold", !loading && "animate-pulse")}
          />
          
          {/* Digital Accents / Data Bits */}
          <motion.g animate={loading ? { opacity: [0.2, 1, 0.2] } : {}} transition={{ duration: 0.5, repeat: Infinity }}>
            <rect x="48" y="10" width="4" height="2" fill="currentColor" className="text-brand-gold opacity-60" />
            <rect x="48" y="88" width="4" height="2" fill="currentColor" className="text-brand-gold opacity-60" />
            <rect x="15" y="30" width="2" height="4" fill="currentColor" className="text-brand-cyan opacity-60" />
            <rect x="83" y="66" width="2" height="4" fill="currentColor" className="text-brand-cyan opacity-60" />
          </motion.g>
        </svg>
      </div>
      
      <div className="flex flex-col leading-none">
        <motion.span 
          animate={loading ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm md:text-base font-serif tracking-[0.4em] text-brand-gold uppercase group-hover:text-white transition-colors duration-700"
        >
          Cyber Organic
        </motion.span>
        <motion.span 
          animate={loading ? { opacity: [0.2, 0.8, 0.2] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="text-[8px] md:text-[10px] font-sans tracking-[0.6em] text-brand-cyan uppercase opacity-50 group-hover:opacity-100 transition-opacity duration-700"
        >
          Agency
        </motion.span>
      </div>
    </div>
  );
}
