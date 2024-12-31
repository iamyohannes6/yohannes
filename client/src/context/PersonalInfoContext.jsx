import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const PersonalInfoContext = createContext();

export const usePersonalInfo = () => {
  const context = useContext(PersonalInfoContext);
  if (!context) {
    throw new Error('usePersonalInfo must be used within a PersonalInfoProvider');
  }
  return context;
};

export const PersonalInfoProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    title: '',
    bio: '',
    profilePhoto: '',
    social: {},
    experience: [],
    education: [],
    services: [],
    skills: {},
    galleries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time updates
  useEffect(() => {
    let unsubscribe;
    
    try {
      const docRef = doc(db, 'personalInfo', 'main');
      
      unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setPersonalInfo(snapshot.data());
          }
          setLoading(false);
        },
        (err) => {
          console.error('Error getting real-time updates:', err);
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Error setting up real-time listener:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Update personal info
  const updatePersonalInfo = async (newInfo) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'personalInfo', 'main');
      await setDoc(docRef, newInfo, { merge: true });
      return { success: true };
    } catch (err) {
      console.error('Error updating personal info:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <PersonalInfoContext.Provider
      value={{
        personalInfo,
        updatePersonalInfo,
        loading,
        error,
      }}
    >
      {children}
    </PersonalInfoContext.Provider>
  );
};
