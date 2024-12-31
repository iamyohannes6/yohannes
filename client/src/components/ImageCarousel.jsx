import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Add image validation function
const isValidImageUrl = (url) => {
  // Check if URL is empty or undefined
  if (!url) return false;

  // Check if URL has a valid image extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasValidExtension = validExtensions.some(ext => 
    url.toLowerCase().endsWith(ext)
  );

  // Check if URL is properly formatted
  try {
    new URL(url);
    return hasValidExtension;
  } catch {
    return false;
  }
};

const ImageCarousel = ({ images, aspectRatio = '1/1', autoSlideInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const itemsPerPage = 4;
  const slidePairs = 2; // Number of images to slide at once

  // Normalize and filter image data structure
  const normalizedImages = images
    .map(image => {
      if (typeof image === 'string') return { url: image, caption: '' };
      return {
        url: image.url,
        caption: image.caption || ''
      };
    })
    .filter(image => isValidImageUrl(image.url)); // Filter out invalid images

  if (!normalizedImages || normalizedImages.length === 0) return null;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + slidePairs;
      return nextIndex >= normalizedImages.length - (itemsPerPage - 1) ? 0 : nextIndex;
    });
  }, [normalizedImages.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - slidePairs;
      return nextIndex < 0 ? normalizedImages.length - itemsPerPage : nextIndex;
    });
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        nextSlide();
      }, autoSlideInterval);

      return () => clearInterval(timer);
    }
  }, [nextSlide, autoSlideInterval, isPaused]);

  // Get visible images and handle wrapping
  const getVisibleImages = () => {
    const visibleImages = normalizedImages.slice(currentIndex, currentIndex + itemsPerPage);
    if (visibleImages.length < itemsPerPage) {
      const remaining = itemsPerPage - visibleImages.length;
      visibleImages.push(...normalizedImages.slice(0, remaining));
    }
    return visibleImages;
  };

  const visibleImages = getVisibleImages();

  // Updated animation variants for pair sliding
  const slideVariants = shouldReduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (index) => ({
          opacity: 0,
          x: 100,
          transition: {
            x: { duration: 0.8, ease: "easeOut" },
            opacity: { duration: 0.5 }
          }
        }),
        center: (index) => ({
          opacity: 1,
          x: 0,
          transition: {
            x: { duration: 0.8, ease: "easeOut" },
            opacity: { duration: 0.5 },
            delay: Math.floor(index / 2) * 0.15 // Increased delay between pairs
          }
        }),
        exit: (index) => ({
          opacity: 0,
          x: -100,
          transition: {
            x: { duration: 0.8, ease: "easeIn" },
            opacity: { duration: 0.5 },
            delay: Math.floor(index / 2) * 0.15 // Increased delay between pairs
          }
        }),
      };

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden">
        <div className="flex gap-4 p-4">
          <AnimatePresence mode="wait" initial={false}>
            {visibleImages.map((image, index) => (
              <motion.div
                key={`${currentIndex}-${index}`}
                custom={index}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex-1 min-w-0"
                style={{
                  willChange: 'transform, opacity'
                }}
              >
                <motion.div 
                  className="relative bg-[#0a0a0a] rounded-xl overflow-hidden cursor-pointer group"
                  style={{ 
                    aspectRatio,
                    willChange: 'transform'
                  }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm"
                    loading="lazy"
                    onError={(e) => {
                      // Add gradient glow animation class
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('gradient-glow-animation');
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-center text-sm font-medium">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { 
            scale: 1.1,
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            boxShadow: '0 8px 32px rgba(100, 108, 255, 0.15)'
          }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={prevSlide}
          className="bg-[#1a1a1a]/60 text-white/90 p-3 rounded-xl m-2 backdrop-blur-md 
                     border border-white/10 shadow-lg transition-all duration-300
                     hover:border-[#646cff]/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { 
            scale: 1.1,
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            boxShadow: '0 8px 32px rgba(100, 108, 255, 0.15)'
          }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={nextSlide}
          className="bg-[#1a1a1a]/60 text-white/90 p-3 rounded-xl m-2 backdrop-blur-md 
                     border border-white/10 shadow-lg transition-all duration-300
                     hover:border-[#646cff]/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 
                      bg-[#1a1a1a]/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        {Array.from({ length: Math.ceil(normalizedImages.length / itemsPerPage) }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index * itemsPerPage)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / itemsPerPage) === index
                ? 'bg-[#646cff] shadow-[0_0_10px_rgba(100,108,255,0.5)]'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Add gradient glow animation styles */}
      <style jsx>{`
        .gradient-glow-animation {
          background: linear-gradient(
            45deg,
            #646cff33 0%,
            #646cff66 25%,
            #646cff33 50%,
            #646cff66 75%,
            #646cff33 100%
          );
          background-size: 400% 400%;
          animation: gradient 8s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageCarousel;
