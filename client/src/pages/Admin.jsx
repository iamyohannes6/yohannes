import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';

// Add this after the imports
const ImageFilter = {
  MIN_WIDTH: 500,
  MIN_HEIGHT: 500,

  FILTER_PATTERNS: [
    'avatar', 'profile_', '/user/', 'userpic', 
    'profile-pic', 'user-image', 'user_photo',
    '/30x', '/50x', '/60x', '/75x', '/100x', 
    '/140x', '/150x', '/200x', '/250x',
    'small_', 'thumb_', 'thumbnail_', 'preview_', 
    'mini_', 'tiny_', 'micro_'
  ],

  isValidImage(url) {
    const lowercaseUrl = url.toLowerCase();
    return !this.FILTER_PATTERNS.some(pattern => lowercaseUrl.includes(pattern)) &&
           !/\/pin\/\d+\/avatar/.test(lowercaseUrl) &&
           !lowercaseUrl.includes('/avatars/') &&
           !lowercaseUrl.includes('/profile/') &&
           !lowercaseUrl.includes('/users/') &&
           !lowercaseUrl.includes('/user_');
  },

  filterImages(images) {
    const validImages = images.filter(url => this.isValidImage(url));
    return validImages.sort((a, b) => {
      const highResIndicators = ['/originals/', '/full/', '/large/', '/max/'];
      const aScore = highResIndicators.reduce((score, indicator) => 
        a.includes(indicator) ? score + 100 : score, 0);
      const bScore = highResIndicators.reduce((score, indicator) => 
        b.includes(indicator) ? score + 100 : score, 0);
      return bScore - aScore;
    });
  }
};

// Replace the extractPinterestImages function with this simpler utility
const processImageLinks = (text) => {
  return text.split('\n')
    .map(url => url.trim())
    .filter(url => url && (
      url.includes('pinimg.com') || 
      url.includes('pinterest.com') ||
      url.includes('pin.it')
    ))
    .map(url => ({
      url: url.replace(/\d+x\d+/, 'originals'),
      caption: ''
    }));
};

const AdminDashboard = () => {
  const { personalInfo, updatePersonalInfo, loading: contextLoading, error: contextError } = usePersonalInfo();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profilePhoto: '',
    social: {},
    experience: [],
    education: [],
    services: [],
    skills: {},
    pinterestBoards: []
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collapsedBoards, setCollapsedBoards] = useState(() => {
    // Initialize all boards as collapsed by default
    const collapsed = {};
    if (personalInfo?.pinterestBoards) {
      personalInfo.pinterestBoards.forEach((_, index) => {
        collapsed[index] = true;
      });
    }
    return collapsed;
  });

  useEffect(() => {
    if (personalInfo) {
      setFormData(prev => ({
        ...personalInfo,
        skills: personalInfo.skills || {}
      }));
    }
  }, [personalInfo]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...(prev.social || {}),
        [platform]: value
      }
    }));
  };

  const handleSkillChange = (category, index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((skill, i) => 
          i === index ? value : skill
        )
      }
    }));
  };

  const addSkill = (category) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...(prev.skills[category] || []), '']
      }
    }));
  };

  const removeSkill = (category, index) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addProject = () => {
    const newProject = {
      title: '',
      description: '',
      image: '',
      technologies: [],
      liveUrl: '',
      githubUrl: ''
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleCustomLinkAdd = () => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...(prev.social || {}),
        customLinks: [...(prev.social?.customLinks || []), { title: '', url: '' }]
      }
    }));
  };

  const handleCustomLinkChange = (index, field, value) => {
    setFormData(prev => {
      const customLinks = [...(prev.social?.customLinks || [])];
      customLinks[index] = { ...customLinks[index], [field]: value };
      return {
        ...prev,
        social: {
          ...(prev.social || {}),
          customLinks
        }
      };
    });
  };

  const handleCustomLinkRemove = (index) => {
    setFormData(prev => {
      const customLinks = [...(prev.social?.customLinks || [])];
      customLinks.splice(index, 1);
      return {
        ...prev,
        social: {
          ...(prev.social || {}),
          customLinks
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      // Prepare the data to be saved
      const dataToSave = {
        ...formData,
        pinterestBoards: formData.pinterestBoards?.map(board => ({
          name: board.name,
          boardUrl: board.boardUrl,
          images: board.images || [],
          aspectRatio: board.aspectRatio || '16/9' // Ensure aspectRatio is saved
        })) || []
      };

      console.log('Saving data to Firebase:', dataToSave);
      const result = await updatePersonalInfo(dataToSave);
      
      if (result.success) {
        setMessage({ type: 'success', content: 'Information updated successfully!' });
      } else {
        throw new Error(result.error || 'Failed to update information');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage({ type: 'error', content: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCategory = () => {
    const categoryName = '';
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [categoryName]: []
      }
    }));
  };

  const renameCategory = (oldName, newName) => {
    if (newName && newName !== oldName) {
      setFormData(prev => {
        const { [oldName]: categorySkills, ...otherCategories } = prev.skills;
        return {
          ...prev,
          skills: {
            ...otherCategories,
            [newName]: categorySkills || []
          }
        };
      });
    }
  };

  const removeCategory = (categoryName) => {
    setFormData(prev => {
      const { [categoryName]: _, ...remainingCategories } = prev.skills;
      return {
        ...prev,
        skills: remainingCategories
      };
    });
  };

  // Update the handleBulkImagePaste function
  const handleBulkImagePaste = (boardIndex) => {
    try {
      navigator.clipboard.readText().then(text => {
        const newImages = processImageLinks(text);

        if (newImages.length > 0) {
          const newBoards = [...(formData.pinterestBoards || [])];
          newBoards[boardIndex] = {
            ...newBoards[boardIndex],
            images: [...(newBoards[boardIndex].images || []), ...newImages]
          };
          
          setFormData(prev => ({ ...prev, pinterestBoards: newBoards }));
          setMessage({ type: 'success', content: `Added ${newImages.length} image links!` });
        } else {
          setMessage({ type: 'error', content: 'No valid Pinterest image links found in clipboard' });
        }
      });
    } catch (error) {
      console.error('Error pasting images:', error);
      setMessage({ 
        type: 'error', 
        content: 'Could not paste image links. Make sure you have copied the URLs.' 
      });
    }
  };

  // Add this function to handle adding a new Pinterest board
  const addPinterestBoard = () => {
    setFormData(prev => ({
      ...prev,
      pinterestBoards: [
        ...(prev.pinterestBoards || []),
        { 
          name: '', 
          boardUrl: '', 
          images: [],
          aspectRatio: '16/9' // Initialize with landscape aspect ratio
        }
      ]
    }));
    
    // Set the new board as expanded by default
    const newIndex = formData.pinterestBoards?.length || 0;
    setCollapsedBoards(prev => ({
      ...prev,
      [newIndex]: false
    }));
  };

  // Move handleFileImport inside the component
  const handleFileImport = (boardIndex, file) => {
    console.log('Starting file import for board:', boardIndex, 'file:', file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        console.log('File content:', event.target.result);
        const jsonData = JSON.parse(event.target.result);
        console.log('Parsed JSON:', jsonData);
        
        let links = [];
        if (jsonData.links && Array.isArray(jsonData.links)) {
          links = jsonData.links;
        } else if (Array.isArray(jsonData)) {
          links = jsonData;
        } else {
          links = jsonData.links || [];
        }
        
        console.log('Extracted links:', links);

        const newImages = links.map(link => ({
          url: link.replace(/\/(\d+x|originals)\//, '/originals/'),
          caption: ''
        }));
        
        console.log('Processed images:', newImages);

        if (newImages.length > 0) {
          setFormData(prev => {
            console.log('Previous formData:', prev);
            const newBoards = [...(prev.pinterestBoards || [])];
            if (!newBoards[boardIndex]) {
              newBoards[boardIndex] = { name: '', boardUrl: '', images: [] };
            }
            newBoards[boardIndex] = {
              ...newBoards[boardIndex],
              images: [...(newBoards[boardIndex].images || []), ...newImages]
            };
            const newState = {
              ...prev,
              pinterestBoards: newBoards
            };
            console.log('New formData:', newState);
            return newState;
          });
          
          setMessage({ 
            type: 'success', 
            content: `Imported ${newImages.length} image links from ${file.name}!` 
          });
        } else {
          setMessage({ 
            type: 'error', 
            content: 'No valid Pinterest image links found in the JSON file' 
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setMessage({ 
          type: 'error', 
          content: 'Could not process file. Make sure it contains valid Pinterest image links.' 
        });
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setMessage({
        type: 'error',
        content: 'Error reading the file. Please try again.'
      });
    };

    reader.readAsText(file);
  };

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#646cff]"></div>
      </div>
    );
  }

  if (contextError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-md">
          Error loading data: {contextError}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'social', label: 'Social Links' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'pinterest', label: 'Pinterest Boards' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] rounded-2xl shadow-xl p-8 border border-[#ffffff1a] backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]"
            >
              Admin Dashboard
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sessionStorage.removeItem('adminAuth');
                window.location.reload();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </motion.button>
          </div>

          {/* Message Display with Animation */}
          <AnimatePresence mode="wait">
          {message.content && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`p-4 mb-6 rounded-lg backdrop-blur-sm ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
              {message.content}
            </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs with Animation */}
          <div className="border-b border-[#ffffff1a] mb-8">
            <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative py-4 px-1 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-[#646cff]'
                      : 'text-[#ffffffb3] hover:text-[#f5f5f5]'
                    }
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#646cff] to-[#747bff]"
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            {activeTab === 'personal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Name</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleBasicInfoChange}
                      className="mt-1 block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                  />
                </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Title</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleBasicInfoChange}
                      className="mt-1 block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                  />
                </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Bio</label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                    name="bio"
                    value={formData.bio}
                    onChange={handleBasicInfoChange}
                    rows={4}
                      className="mt-1 block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                  />
                </div>
                  <div className="col-span-2">
                    <label htmlFor="profilePhoto" className="block text-sm font-medium text-[#f5f5f5] mb-2">
                    Profile Photo URL
                  </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      name="profilePhoto"
                      id="profilePhoto"
                      value={formData.profilePhoto || ''}
                      onChange={handleBasicInfoChange}
                      className="mt-1 block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Media Links */}
            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                  <div>
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5] mb-6">Social Media Links</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-[#f5f5f5]">
                          Email
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="email"
                          name="email"
                          id="email"
                          value={formData.social?.email || ''}
                          onChange={(e) => handleSocialChange('email', e.target.value)}
                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative space-y-2">
                        <label htmlFor="github" className="block text-sm font-medium text-[#f5f5f5]">
                          GitHub URL
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="url"
                          name="github"
                          id="github"
                          value={formData.social?.github || ''}
                          onChange={(e) => handleSocialChange('github', e.target.value)}
                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative space-y-2">
                        <label htmlFor="linkedin" className="block text-sm font-medium text-[#f5f5f5]">
                          LinkedIn URL
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="url"
                          name="linkedin"
                          id="linkedin"
                          value={formData.social?.linkedin || ''}
                          onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative space-y-2">
                        <label htmlFor="twitter" className="block text-sm font-medium text-[#f5f5f5]">
                          Twitter URL
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="url"
                          name="twitter"
                          id="twitter"
                          value={formData.social?.twitter || ''}
                          onChange={(e) => handleSocialChange('twitter', e.target.value)}
                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative space-y-2">
                        <label htmlFor="instagram" className="block text-sm font-medium text-[#f5f5f5]">
                          Instagram URL
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="url"
                          name="instagram"
                          id="instagram"
                          value={formData.social?.instagram || ''}
                          onChange={(e) => handleSocialChange('instagram', e.target.value)}
                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative space-y-2">
                        <label htmlFor="pinterest" className="block text-sm font-medium text-[#f5f5f5]">
                          Pinterest URL
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="url"
                          name="pinterest"
                          id="pinterest"
                          value={formData.social?.pinterest || ''}
                          onChange={(e) => handleSocialChange('pinterest', e.target.value)}
                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          placeholder="https://pinterest.com/username"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Custom Links Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Additional Links</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCustomLinkAdd}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Link
                    </motion.button>
                  </div>
                  <motion.div layout className="space-y-4">
                    {formData.social?.customLinks?.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 items-start bg-[#ffffff0d] p-4 rounded-lg border border-[#ffffff1a] hover:border-[#646cff] transition-colors duration-300"
                      >
                        <div className="flex-1">
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={link.title}
                            onChange={(e) => handleCustomLinkChange(index, 'title', e.target.value)}
                            placeholder="Link Title"
                            className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="url"
                            value={link.url}
                            onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                            placeholder="https://example.com"
                            className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => handleCustomLinkRemove(index)}
                          className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                  </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {activeTab === 'experience' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Experience</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      experience: [...(prev.experience || []), { title: '', company: '', period: '', description: '' }]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Experience
                  </motion.button>
                </div>

                <motion.div layout className="space-y-6">
                {formData.experience?.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Position {index + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                              const newExperience = [...(formData.experience || [])];
                          newExperience.splice(index, 1);
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Title</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={exp.title}
                        onChange={e => {
                                const newExperience = [...(formData.experience || [])];
                          newExperience[index] = { ...exp, title: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Position Title"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Company</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={exp.company}
                        onChange={e => {
                                const newExperience = [...(formData.experience || [])];
                          newExperience[index] = { ...exp, company: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Company Name"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Period</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={exp.period}
                        onChange={e => {
                                const newExperience = [...(formData.experience || [])];
                          newExperience[index] = { ...exp, period: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="e.g., 2020 - Present"
                      />
                    </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Description</label>
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                        value={exp.description}
                        onChange={e => {
                                const newExperience = [...(formData.experience || [])];
                          newExperience[index] = { ...exp, description: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        rows={3}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
              </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Education Section */}
            {activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Education</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      education: [...(prev.education || []), { degree: '', institution: '', period: '', description: '' }]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Education
                  </motion.button>
                </div>

                <motion.div layout className="space-y-6">
                {formData.education?.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Education {index + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                              const newEducation = [...(formData.education || [])];
                          newEducation.splice(index, 1);
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Degree</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={edu.degree}
                        onChange={e => {
                                const newEducation = [...(formData.education || [])];
                          newEducation[index] = { ...edu, degree: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Degree or Certificate"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Institution</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={edu.institution}
                        onChange={e => {
                                const newEducation = [...(formData.education || [])];
                          newEducation[index] = { ...edu, institution: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Institution Name"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Period</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={edu.period}
                        onChange={e => {
                                const newEducation = [...(formData.education || [])];
                          newEducation[index] = { ...edu, period: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="e.g., 2018 - 2022"
                      />
                    </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Description</label>
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                        value={edu.description}
                        onChange={e => {
                                const newEducation = [...(formData.education || [])];
                          newEducation[index] = { ...edu, description: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        rows={3}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Describe your academic achievements and activities..."
                      />
                    </div>
                  </div>
              </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Services Section */}
            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Services</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      services: [...(prev.services || []), { title: '', description: '', icon: '' }]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Service
                  </motion.button>
                </div>

                <motion.div layout className="space-y-6">
                {formData.services?.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Service {index + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                              const newServices = [...(formData.services || [])];
                          newServices.splice(index, 1);
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Title</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={service.title}
                        onChange={e => {
                                const newServices = [...(formData.services || [])];
                          newServices[index] = { ...service, title: e.target.value };
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Service Title"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Icon</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={service.icon}
                              onChange={e => {
                                const newServices = [...(formData.services || [])];
                                newServices[index] = { ...service, icon: e.target.value };
                                setFormData(prev => ({ ...prev, services: newServices }));
                              }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Icon name or URL"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Description</label>
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                        value={service.description}
                        onChange={e => {
                                const newServices = [...(formData.services || [])];
                          newServices[index] = { ...service, description: e.target.value };
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                        rows={3}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Describe the service you offer..."
                      />
                    </div>
                  </div>
              </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Skills Section */}
            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Skills</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addCategory}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                  </motion.button>
                </div>

                <motion.div layout className="space-y-8">
                  {Object.entries(formData.skills || {}).map(([category, skills]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={category}
                          onChange={(e) => renameCategory(category, e.target.value)}
                          className="text-base font-medium text-[#f5f5f5] bg-transparent border-b border-transparent hover:border-[#ffffff1a] focus:border-[#646cff] focus:outline-none px-2 py-1 transition-all duration-300"
                        placeholder="Category Name"
                      />
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        type="button"
                            onClick={() => addSkill(category)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Skill
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-4 rounded-lg border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex items-center gap-3">
                              <motion.input
                                whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={skill}
                                onChange={e => handleSkillChange(category, index, e.target.value)}
                                className="flex-1 rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                                placeholder={`${category} skill`}
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            type="button"
                                onClick={() => removeSkill(category, index)}
                                className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 self-end"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Projects Section */}
            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Projects</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addProject}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project
                  </motion.button>
                </div>

                <motion.div layout className="space-y-6">
                  {formData.projects?.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Project {index + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeProject(index)}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Title</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.title}
                              onChange={e => handleProjectChange(index, 'title', e.target.value)}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Project Title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Image URL</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.image}
                              onChange={e => handleProjectChange(index, 'image', e.target.value)}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Live URL</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.liveUrl}
                              onChange={e => handleProjectChange(index, 'liveUrl', e.target.value)}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="https://example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">GitHub URL</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.githubUrl}
                              onChange={e => handleProjectChange(index, 'githubUrl', e.target.value)}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="https://github.com/username/repo"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Description</label>
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                              value={project.description}
                              onChange={e => handleProjectChange(index, 'description', e.target.value)}
                              rows={3}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Describe your project..."
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Technologies</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.technologies.join(', ')}
                              onChange={e => handleProjectChange(index, 'technologies', e.target.value.split(',').map(tech => tech.trim()))}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="React, Node.js, MongoDB, etc."
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Pinterest Boards Section */}
            {activeTab === 'pinterest' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-[#f5f5f5]">Pinterest Boards</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addPinterestBoard}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Board
                  </motion.button>
                </div>

                <AnimatePresence>
                  {formData.pinterestBoards?.map((board, boardIndex) => (
                    <motion.div
                      key={boardIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a]"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCollapsedBoards(prev => ({
                                  ...prev,
                                  [boardIndex]: !prev[boardIndex]
                                }));
                              }}
                              className="p-2 rounded-lg bg-[#ffffff1a] text-[#f5f5f5] hover:bg-[#ffffff2a] transition-all duration-300"
                            >
                              <svg 
                                className={`w-5 h-5 transform transition-transform duration-200 ${
                                  collapsedBoards[boardIndex] ? 'rotate-180' : ''
                                }`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </motion.button>
                            <h4 className="text-base font-medium text-[#f5f5f5]">
                              {board.name || `Board ${boardIndex + 1}`}
                              <span className="ml-2 text-sm text-[#f5f5f5]/60">
                                ({board.images?.length || 0} images)
                              </span>
                            </h4>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => {
                              const newBoards = [...(formData.pinterestBoards || [])];
                              newBoards.splice(boardIndex, 1);
                              setFormData(prev => ({ ...prev, pinterestBoards: newBoards }));
                            }}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                        </div>

                        <AnimatePresence mode="wait">
                          {!collapsedBoards[boardIndex] && (
                            <motion.div
                              key={`board-content-${boardIndex}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ 
                                duration: 0.2,
                                ease: "easeInOut",
                                opacity: { duration: 0.1 }
                              }}
                              className="overflow-hidden"
                              style={{ willChange: 'height, opacity' }}
                            >
                              <div className="space-y-4 pt-4">
                                <div>
                                  <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Board Name</label>
                                  <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="text"
                                    value={board.name}
                                    onChange={e => {
                                      const newBoards = [...(formData.pinterestBoards || [])];
                                      newBoards[boardIndex] = { ...board, name: e.target.value };
                                      setFormData(prev => ({ ...prev, pinterestBoards: newBoards }));
                                    }}
                                    className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                                    placeholder="My Pinterest Board"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Card Size</label>
                                  <div className="grid grid-cols-3 gap-4">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      type="button"
                                      onClick={() => {
                                        const newBoards = [...(formData.pinterestBoards || [])];
                                        newBoards[boardIndex] = { ...board, aspectRatio: '1/1' };
                                        setFormData(prev => ({ ...prev, pinterestBoards: newBoards }));
                                      }}
                                      className={`p-3 rounded-lg border ${
                                        board.aspectRatio === '1/1' ? 'bg-[#646cff] border-[#646cff]' : 'bg-[#ffffff0d] border-[#ffffff1a]'
                                      } text-[#f5f5f5] transition-all duration-300`}
                                    >
                                      Square
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      type="button"
                                      onClick={() => {
                                        const newBoards = [...(formData.pinterestBoards || [])];
                                        newBoards[boardIndex] = { ...board, aspectRatio: '16/9' };
                                        setFormData(prev => ({ ...prev, pinterestBoards: newBoards }));
                                      }}
                                      className={`p-3 rounded-lg border ${
                                        board.aspectRatio === '16/9' ? 'bg-[#646cff] border-[#646cff]' : 'bg-[#ffffff0d] border-[#ffffff1a]'
                                      } text-[#f5f5f5] transition-all duration-300`}
                                    >
                                      Landscape
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      type="button"
                                      onClick={() => {
                                        const newBoards = [...(formData.pinterestBoards || [])];
                                        newBoards[boardIndex] = { ...board, aspectRatio: '9/16' };
                                        setFormData(prev => ({ ...prev, pinterestBoards: newBoards }));
                                      }}
                                      className={`p-3 rounded-lg border ${
                                        board.aspectRatio === '9/16' ? 'bg-[#646cff] border-[#646cff]' : 'bg-[#ffffff0d] border-[#ffffff1a]'
                                      } text-[#f5f5f5] transition-all duration-300`}
                                    >
                                      Portrait
                                    </motion.button>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Board URL (for reference only)</label>
                                  <div className="flex gap-2">
                                    <motion.input
                                      whileFocus={{ scale: 1.01 }}
                                      type="url"
                                      value={board.boardUrl}
                                      onChange={e => {
                                        const newBoards = [...(formData.pinterestBoards || [])];
                                        newBoards[boardIndex] = { ...board, boardUrl: e.target.value };
                                        setFormData(prev => ({ ...prev, pinterestBoards: newBoards }));
                                      }}
                                      className="block flex-1 rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                                      placeholder="https://pinterest.com/username/board-name"
                                    />
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      type="button"
                                      onClick={() => handleBulkImagePaste(boardIndex)}
                                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                                    >
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                      </svg>
                                      Paste Links
                                    </motion.button>
                                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#646cff] text-white hover:bg-[#747bff] cursor-pointer transition-all duration-300">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                      </svg>
                                      <span>Import File</span>
                                      <input
                                        type="file"
                                        accept=".json,.txt"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            handleFileImport(boardIndex, file);
                                            e.target.value = ''; // Reset input
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                  <p className="mt-2 text-sm text-[#f5f5f5]/60">
                                    Import a JSON or TXT file containing Pinterest image links from the Pinterest Downloader extension
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-medium text-[#f5f5f5]">Image Links ({board.images?.length || 0})</label>
                                  </div>
                                  <div className="space-y-4">
                                    {board.images?.map((image, imageIndex) => (
                                      <div key={imageIndex} className="flex items-center gap-4 bg-[#ffffff0d] p-4 rounded-lg">
                                        <div className="flex-1 truncate">{image.url}</div>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          type="button"
                                          onClick={() => {
                                            const newBoards = [...(formData.pinterestBoards || [])];
                                            newBoards[boardIndex].images.splice(imageIndex, 1);
                                            setFormData(prev => ({ ...prev, pinterestBoards: newBoards }));
                                          }}
                                          className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                                        >
                                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </motion.button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Save Button */}
            <motion.div 
              className="flex justify-end pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`
                  relative overflow-hidden px-6 py-2.5 rounded-full font-semibold text-white
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-[#646cff]/50'}
                  bg-gradient-to-r from-[#646cff] to-[#747bff] transition-all duration-300
                `}
              >
                <motion.span
                  initial={{ y: 0 }}
                  animate={{ y: isSubmitting ? 30 : 0 }}
                  className="block"
                >
                  Save Changes
                </motion.span>
                {isSubmitting && (
                  <motion.div 
                    initial={{ y: -30 }}
                    animate={{ y: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
