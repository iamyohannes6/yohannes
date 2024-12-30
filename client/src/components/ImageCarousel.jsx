import { useState, useEffect } from 'react';
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
  // If we don't have enough images to fill the last page, take from the beginning
  if (visibleImages.length < itemsPerPage) {
    const remaining = itemsPerPage - visibleImages.length;
    visibleImages.push(...images.slice(0, remaining));
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="relative overflow-hidden">
        <div className="flex gap-4 p-4">
          {visibleImages.map((image, index) => (
            <motion.div
              key={`${currentIndex}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex-1 min-w-0"
            >
              <div 
                className="relative bg-[#0a0a0a] rounded-xl overflow-hidden" 
                style={{ aspectRatio: aspectRatio }}
              >
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-center text-sm font-medium">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/40 flex items-center justify-center backdrop-blur-sm transition-colors z-10"
        onClick={prevSlide}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/40 flex items-center justify-center backdrop-blur-sm transition-colors z-10"
        onClick={nextSlide}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {Array.from({ length: Math.ceil(images.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * itemsPerPage)}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / itemsPerPage) === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
