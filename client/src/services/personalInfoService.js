import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const updatePersonalInfo = async (data) => {
  try {
    const personalInfoRef = doc(db, 'personalInfo', 'main');
    await updateDoc(personalInfoRef, data);
    
    // Update local storage to reflect changes immediately
    localStorage.setItem('personalInfo', JSON.stringify(data));
    
    return { success: true };
  } catch (error) {
    console.error('Error updating personal info:', error);
    return { success: false, error: error.message };
  }
};

export const getPersonalInfo = () => {
  // First try to get from local storage for immediate display
  const cached = localStorage.getItem('personalInfo');
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fallback to default data
  return null;
};
