import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PinAuth = ({ onSuccess }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // The correct PIN - in a real app, this should be stored securely
  const CORRECT_PIN = '0828'; // You should change this to your desired PIN

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        const nextEmptyIndex = pin.findIndex(digit => digit === '');
        if (nextEmptyIndex !== -1) {
          const newPin = [...pin];
          newPin[nextEmptyIndex] = e.key;
          setPin(newPin);
        }
      } else if (e.key === 'Backspace') {
        const lastFilledIndex = pin.map(digit => digit !== '').lastIndexOf(true);
        if (lastFilledIndex !== -1) {
          const newPin = [...pin];
          newPin[lastFilledIndex] = '';
          setPin(newPin);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  const handlePinInput = (index, value) => {
    if (value === '' || (value.length === 1 && /^[0-9]$/.test(value))) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[name="pin-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    
    if (enteredPin === CORRECT_PIN) {
      setError('');
      onSuccess();
      // Store auth state in session storage
      sessionStorage.setItem('adminAuthenticated', 'true');
    } else {
      setError('Incorrect PIN. Please try again.');
      setShake(true);
      setPin(['', '', '', '']);
      // Focus first input after clearing
      document.querySelector('input[name="pin-0"]')?.focus();
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#f5f5f5]">
            Enter Admin PIN
          </h2>
          <p className="mt-2 text-center text-sm text-[#ffffffb3]">
            Please enter your 4-digit PIN to access the admin dashboard
          </p>
        </div>

        <motion.form
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center space-x-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="text"
                name={`pin-${index}`}
                value={digit}
                onChange={(e) => handlePinInput(index, e.target.value)}
                className="w-12 h-12 text-center text-2xl font-bold rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] focus:border-[#646cff] focus:ring-1 focus:ring-[#646cff]"
                maxLength={1}
                pattern="[0-9]"
                inputMode="numeric"
                autoComplete="off"
                required
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#646cff] hover:bg-[#747bff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cff]"
            >
              Verify PIN
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default PinAuth;
