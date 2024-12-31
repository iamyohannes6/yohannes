import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const PinterestBoardCarousel = ({ images, aspectRatio = '1/1', autoSlideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const itemsPerPage = 3;

  if (!images || images.length === 0) return null;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= images.length - (itemsPerPage - 1) ? 0 : nextIndex;
    });
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? images.length - itemsPerPage : nextIndex;
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

  const visibleImages = images.slice(currentIndex, currentIndex + itemsPerPage);
  if (visibleImages.length < itemsPerPage) {
    const remaining = itemsPerPage - visibleImages.length;
    visibleImages.push(...images.slice(0, remaining));
  }

  // Simplified animation variants
  const slideVariants = shouldReduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, x: 50 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
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
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex-1 min-w-0"
                style={{
                  willChange: 'transform, opacity'
                }}
              >
                <motion.div 
                  className="relative bg-[#0a0a0a] rounded-xl overflow-hidden cursor-pointer"
                  style={{ aspectRatio }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
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
          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
          onClick={prevSlide}
          className="bg-[#1a1a1a]/80 text-white p-2 rounded-full backdrop-blur-sm hover:bg-[#1a1a1a] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
          onClick={nextSlide}
          className="bg-[#1a1a1a]/80 text-white p-2 rounded-full backdrop-blur-sm hover:bg-[#1a1a1a] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        {Array.from({ length: Math.ceil(images.length / itemsPerPage) }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index * itemsPerPage)}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / itemsPerPage) === index
                ? 'bg-[#646cff]'
                : 'bg-[#ffffff4d] hover:bg-[#ffffff8d]'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default PinterestBoardCarousel; 