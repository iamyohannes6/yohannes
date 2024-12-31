import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const skillsCollection = collection(db, 'skills');
      const skillsSnapshot = await getDocs(skillsCollection);
      const skillsList = skillsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSkills(skillsList);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to fetch skills');
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const skillsCollection = collection(db, 'skills');
      await addDoc(skillsCollection, newSkill);
      setNewSkill({ name: '', proficiency: 0 });
      await fetchSkills();
    } catch (err) {
      console.error('Error adding skill:', err);
      setError('Failed to add skill');
    }
  };

  const handleUpdateSkill = async (id, updatedSkill) => {
    try {
      const skillDoc = doc(db, 'skills', id);
      await updateDoc(skillDoc, updatedSkill);
      await fetchSkills();
    } catch (err) {
      console.error('Error updating skill:', err);
      setError('Failed to update skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      const skillDoc = doc(db, 'skills', id);
      await deleteDoc(skillDoc);
      await fetchSkills();
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError('Failed to delete skill');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Skills Manager</h2>
      
      {/* Add new skill form */}
      <form onSubmit={handleAddSkill} className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            value={newSkill.proficiency}
            onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
            placeholder="Proficiency (0-100)"
            className="px-4 py-2 border rounded"
            min="0"
            max="100"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Skill
          </button>
        </div>
      </form>

      {/* Skills list */}
      <div className="grid gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-4 p-4 border rounded">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => handleUpdateSkill(skill.id, { ...skill, name: e.target.value })}
              className="px-4 py-2 border rounded"
            />
            <input
              type="number"
              value={skill.proficiency}
              onChange={(e) => handleUpdateSkill(skill.id, { ...skill, proficiency: parseInt(e.target.value) })}
              className="px-4 py-2 border rounded"
              min="0"
              max="100"
            />
            <button
              onClick={() => handleDeleteSkill(skill.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
