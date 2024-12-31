import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageCarousel = ({ images, aspectRatio = '1/1' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= images.length - (itemsPerPage - 1) ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? images.length - itemsPerPage : nextIndex;
    });
  };

  const visibleImages = images.slice(currentIndex, currentIndex + itemsPerPage);
  if (visibleImages.length < itemsPerPage) {
    const remaining = itemsPerPage - visibleImages.length;
    visibleImages.push(...images.slice(0, remaining));
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="relative overflow-hidden">
        <div className="flex gap-4 p-4">
          <AnimatePresence mode="wait">
            {visibleImages.map((image, index) => (
              <motion.div
                key={`${currentIndex}-${index}`}
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                transition={{
                  duration: 0.5,
                  ease: [0.6, -0.05, 0.01, 0.99],
                  delay: index * 0.1,
                }}
                className="flex-1 min-w-0"
              >
                <motion.div 
                  className="relative bg-[#0a0a0a] rounded-xl overflow-hidden cursor-pointer"
                  style={{ aspectRatio }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <AnimatePresence>
                    {image.caption && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
                      >
                        <p className="text-white text-center text-sm font-medium">
                          {image.caption}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="absolute inset-y-0 left-0 flex items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="bg-[#1a1a1a]/80 text-white p-2 rounded-full backdrop-blur-sm hover:bg-[#1a1a1a] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default ImageCarousel;
