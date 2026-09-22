import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { ArrowUp, Sparkles } from 'lucide-react';

/**
 * Luxury Gold Top Scroll Progress Bar
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none bg-black/20">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-[#C5A880] via-[#F2D7B3] to-[#B89758] shadow-[0_0_12px_rgba(197,168,128,0.8)]"
        style={{ scaleX }}
      />
    </div>
  );
}

/**
 * Circular Floating Back-to-Top with Live Scroll Percentage Ring
 */
export function ScrollToTopButton() {
  const { scrollYProgress, scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setVisible(latest > 350);
    });
  }, [scrollY]);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const circumference = 2 * Math.PI * 18; // radius 18
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          title={`Scroll to top (${percent}%)`}
          className="fixed bottom-6 right-6 z-50 p-2.5 rounded-full bg-[#141518]/90 backdrop-blur-xl border border-[#C5A880]/40 text-[#FAF7F2] shadow-2xl shadow-black/80 hover:border-[#C5A880] hover:scale-110 active:scale-95 transition-transform duration-200 group cursor-pointer"
        >
          {/* Circular SVG Progress Ring */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                className="text-[#2D2822]"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                className="text-[#C5A880] transition-all duration-150"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <ArrowUp className="w-4 h-4 text-[#C5A880] group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * ScrollReveal Wrapper
 * Automatically animates child elements when scrolled into viewport
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  distance?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  distance = 20,
}: ScrollRevealProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  const initial = { opacity: 0, ...getInitialPosition() };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px', amount: 0.05 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
