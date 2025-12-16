import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 🚨 ACTION REQUIRED: API KEY SETUP 🚨
// ==========================================
// The previous key was blocked by Google for security.
// 1. Go to: https://aistudio.google.com/app/apikey
// 2. Create a new FREE key.
// 3. Paste it inside the quotes below.
const GEMINI_API_KEY = "AIzaSyC4grmeZ8453byGNv7MGXVpP95raA5bCsE"; 

const supabaseUrl = 'https://bwjjfnkuqnravvfytxbf.supabase.co';
const supabaseKey = 'sb_publishable_9z5mRwy-X0zERNX7twZzPw_RdskfL8s';

// ==========================================
// 1. DATA & CONSTANTS
// ==========================================

const CATEGORIES = [
  {
    id: 'restaurant-cluster',
    title: 'Restaurant',
    type: 'CLUSTER',
    courses: [
      {
        id: 'rest-001',
        title: 'Open Your Own Restaurant',
        description: 'A step-by-step guide to location, menu, and hiring.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=640&q=80',
        tags: ['Business', 'Food']
      },
      {
        id: 'rest-002',
        title: 'Head Chef Training',
        description: 'Managing a high-pressure kitchen environment.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=640&q=80',
        tags: ['Cooking', 'Leadership']
      },
      {
        id: 'rest-003',
        title: 'Coffee Shop Culture',
        description: 'Barista skills and roasting your own beans.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=640&q=80',
        tags: ['Drinks', 'Cafe']
      },
      {
        id: 'rest-004',
        title: 'Artisan Bakery',
        description: 'Mastering sourdough, pastries, and running a bakery.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=80',
        tags: ['Baking', 'Business']
      },
      {
        id: 'rest-005',
        title: 'Food Truck Revolution',
        description: 'Mobile food business basics.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=640&q=80',
        tags: ['Startup', 'Food']
      }
    ]
  },
  {
    id: 'podcasting-cluster',
    title: 'Podcasting & Modern Media',
    type: 'CLUSTER',
    courses: [
      {
        id: 'pod-001',
        title: 'Start Your Podcast',
        description: 'From buying a mic to publishing on Spotify. Your voice matters.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=640&q=80',
        tags: ['Media', 'Audio']
      },
      {
        id: 'pod-002',
        title: 'Viral Content Creation',
        description: 'How to make short clips that get millions of views.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=640&q=80',
        tags: ['Social', 'Video']
      },
      {
        id: 'pod-003',
        title: 'Streamer Setup 101',
        description: 'Lighting, OBS, and engaging your chat live.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=640&q=80',
        tags: ['Live', 'Tech']
      },
      {
        id: 'pod-004',
        title: 'Interview Techniques',
        description: 'How to talk to guests and get great stories.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=640&q=80',
        tags: ['Skills', 'Talk']
      },
      {
        id: 'pod-005',
        title: 'Monetize Your Brand',
        description: 'Sponsorships, merch, and making money online.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=640&q=80',
        tags: ['Business', 'Money']
      }
    ]
  },
  {
    id: 'cs-cluster',
    title: 'Computer Science',
    type: 'CLUSTER',
    courses: [
      {
        id: 'cs-000',
        title: 'General Overview: The Digital World',
        description: 'Not sure which tech path to take? This course surveys everything from code to hardware to help you decide.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=640&q=80',
        tags: ['General', 'Overview']
      },
      {
        id: 'cs-101',
        title: 'Introduction to Algorithms',
        description: 'Learn the fundamentals of sorting, searching, and graph algorithms.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=640&q=80',
        tags: ['Coding', 'Logic']
      },
      {
        id: 'cs-202',
        title: 'AI & Machine Learning',
        description: 'Understand neural networks and how to build intelligent agents.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=640&q=80',
        tags: ['AI', 'Python']
      },
      {
        id: 'cs-303',
        title: 'Cybersecurity Basics',
        description: 'Protect systems from attacks and understand encryption.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=640&q=80',
        tags: ['Security', 'Network']
      },
      {
        id: 'cs-404',
        title: 'Full Stack Web Dev',
        description: 'Build complete websites from database to user interface.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=640&q=80',
        tags: ['Web', 'Design']
      }
    ]
  },
  {
    id: 'business-cluster',
    title: 'Business Administration',
    type: 'CLUSTER',
    courses: [
      {
        id: 'bus-000',
        title: 'General Overview: Corporate World',
        description: 'Learn the language of money and management before diving deep.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=640&q=80',
        tags: ['General', 'Money']
      },
      {
        id: 'bus-101',
        title: 'Marketing Strategy',
        description: 'Master the 4 Ps of marketing and digital outreach.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=640&q=80',
        tags: ['Marketing', 'Strategy']
      },
      {
        id: 'bus-303',
        title: 'Financial Accounting',
        description: 'Read balance sheets and manage corporate finances effectively.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1554224155-98406858d0ade?auto=format&fit=crop&w=640&q=80',
        tags: ['Finance', 'Math']
      },
      {
        id: 'bus-404',
        title: 'Entrepreneurship',
        description: 'How to start a business from scratch and not fail immediately.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=640&q=80',
        tags: ['Startup', 'Leadership']
      },
      {
        id: 'bus-505',
        title: 'Project Management',
        description: 'Agile methodologies and leading teams to success.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=640&q=80',
        tags: ['Management', 'Teams']
      }
    ]
  },
  {
    id: 'bio-cluster',
    title: 'Biology & Life Sciences',
    type: 'CLUSTER',
    courses: [
      {
        id: 'bio-000',
        title: 'General Overview: Study of Life',
        description: 'A broad look at all living things to help you pick between plants, animals, or humans.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=640&q=80',
        tags: ['General', 'Science']
      },
      {
        id: 'bio-101',
        title: 'Cellular Biology',
        description: 'The building blocks of life: structure and function of cells.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=640&q=80',
        tags: ['Science', 'Lab']
      },
      {
        id: 'bio-202',
        title: 'Genetics',
        description: 'Understanding DNA, heredity, and gene mapping.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=640&q=80',
        tags: ['DNA', 'Research']
      },
      {
        id: 'bio-303',
        title: 'Marine Biology',
        description: 'Explore the depths of the ocean and marine ecosystems.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=640&q=80',
        tags: ['Ocean', 'Animals']
      },
      {
        id: 'bio-404',
        title: 'Human Anatomy',
        description: 'Detailed study of the human body structure and systems.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=640&q=80',
        tags: ['Health', 'Medical']
      }
    ]
  },
  {
    id: 'psych-cluster',
    title: 'Psychology',
    type: 'CLUSTER',
    courses: [
      {
        id: 'psy-000',
        title: 'General Overview: The Human Mind',
        description: 'Why do we think? An overview of behavioral science.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1555819206-7b30da4f1506?auto=format&fit=crop&w=640&q=80',
        tags: ['General', 'Mind']
      },
      {
        id: 'psy-101',
        title: 'Cognitive Psychology',
        description: 'Memory, perception, and problem solving.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=640&q=80',
        tags: ['Brain', 'Thought']
      },
      {
        id: 'psy-202',
        title: 'Child Development',
        description: 'How humans grow from infancy to adolescence.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=640&q=80',
        tags: ['Kids', 'Growth']
      },
      {
        id: 'psy-303',
        title: 'Clinical Psychology',
        description: 'Diagnosing and treating mental health disorders.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=640&q=80',
        tags: ['Health', 'Therapy']
      },
      {
        id: 'psy-404',
        title: 'Social Psychology',
        description: 'How groups influence individual behavior.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=640&q=80',
        tags: ['Society', 'People']
      }
    ]
  },
  {
    id: 'art-cluster',
    title: 'Creative Arts',
    type: 'CLUSTER',
    courses: [
      {
        id: 'art-000',
        title: 'General Overview: Unleashing Creativity',
        description: 'Try a little bit of everything to find your medium.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=640&q=80',
        tags: ['General', 'Art']
      },
      {
        id: 'art-001',
        title: 'Digital Painting',
        description: 'From sketching to final rendering using digital tools.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&w=640&q=80',
        tags: ['Design', 'Creative']
      },
      {
        id: 'art-002',
        title: 'Photography 101',
        description: 'Mastering composition and lighting for stunning photos.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=640&q=80',
        tags: ['Photo', 'Camera']
      },
      {
        id: 'art-003',
        title: 'Sculpting Basics',
        description: 'Working with clay and 3D forms.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=640&q=80',
        tags: ['3D', 'Clay']
      },
      {
        id: 'art-004',
        title: 'Art History',
        description: 'From Renaissance to Modernism.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&w=640&q=80',
        tags: ['History', 'Culture']
      }
    ]
  },
  {
    id: 'music-cluster',
    title: 'Music Production',
    type: 'CLUSTER',
    courses: [
       {
        id: 'mus-000',
        title: 'General Overview: Sound & Theory',
        description: 'Understanding rhythm, melody, and how music works.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=640&q=80',
        tags: ['General', 'Sound']
      },
      {
        id: 'mus-001',
        title: 'Beat Making Basics',
        description: 'Create your first track using standard DAWs.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=640&q=80',
        tags: ['Audio', 'Creative']
      },
      {
        id: 'mus-002',
        title: 'Guitar for Beginners',
        description: 'Chords, strumming patterns, and basic songs.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=640&q=80',
        tags: ['Instrument', 'Strings']
      },
      {
        id: 'mus-003',
        title: 'Piano Fundamentals',
        description: 'Reading sheet music and playing keys.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=640&q=80',
        tags: ['Instrument', 'Keys']
      },
      {
        id: 'mus-004',
        title: 'Vocal Training',
        description: 'Improve your singing voice and range.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=640&q=80',
        tags: ['Voice', 'Singing']
      }
    ]
  }
];

// ==========================================
// 2. SERVICES
// ==========================================

const supabase = createClient(supabaseUrl, supabaseKey);

// --- GEMINI SERVICE ---

let chatSession = null;
let currentTier = 'GUEST';
let currentInterest = undefined;

const initializeChat = (tier, interest) => {
  // Use the key from the variable at the top of the file
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || GEMINI_API_KEY || '';

  if (!apiKey || apiKey.includes("PASTE_YOUR_NEW_KEY_HERE")) {
    console.warn("API Key is missing. Please edit script.js line 12.");
    return false;
  }

  currentTier = tier;
  currentInterest = interest;
  const ai = new GoogleGenAI({ apiKey });

  let systemInstruction = "";

  // Treat 'BUNDLE' and 'SINGLE' as paid tiers for the purpose of the AI
  const isPaid = tier === 'BUNDLE' || tier === 'SINGLE' || tier === 'PAID';

  if (isPaid && interest) {
    const cluster = CATEGORIES.find(c => c.title === interest);
    
    if (cluster) {
      const curriculum = cluster.courses.map(c => 
        `- Course Title: "${c.title}"\n  Description: ${c.description}\n  Topics/Tags: ${c.tags.join(', ')}`
      ).join('\n\n');

      // TUNED AI PERSONA FOR SCHOOL PROJECT
      systemInstruction = `You are CareerBot, a friendly and expert academic advisor.
      
      You have access to the user's specific curriculum for "${interest}". 
      
      CURRICULUM DATA:
      ${curriculum}
      
      YOUR ROLE:
      1. Explain concepts from the courses above simply.
      2. If the user is in "Learning Mode" (viewing a module), help them understand specific terms from that module.
      3. Be encouraging and use emojis occasionally to keep the vibe positive 🎓 ✨.
      4. If asked about a topic NOT in the list above, politely steer them back to their chosen path: "${interest}".
      `;
    } else {
        systemInstruction = "You are CareerBot. You are a helpful AI tutor. The user has a premium account. Help them with general career advice.";
    }
  } else {
    systemInstruction = "You are CareerBot (Demo Mode). You are restricted. You can ONLY answer general questions about why education is important in 1 short sentence. If the user asks about specific course content, say: 'I cannot access that information in Demo Mode. Please sign in.'";
  }

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return true;
};

const sendMessageToAgent = async (message) => {
  if (!chatSession) {
    const success = initializeChat(currentTier, currentInterest);
    if (!success) return "⚠️ CONFIGURATION ERROR: Please open script.js and paste your NEW API Key at the top. The old one was blocked.";
  }
  
  if (!chatSession) {
      return "CareerBot Error: Service not initialized.";
  }

  try {
    const result = await chatSession.sendMessage({
      message: message
    });
    
    return result.text || "I couldn't think of a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return specific error message to the user for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes("403") || errorMessage.includes("leaked")) {
        return "⚠️ API KEY ERROR: Your API key is blocked. Please generate a new one at aistudio.google.com and update the code.";
    }

    return `CareerBot Connection Failed. Error details: ${errorMessage}. (Check Console for more info)`;
  }
};

// ==========================================
// 3. COMPONENTS
// ==========================================

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400 shadow-md hover:shadow-lg",
    secondary: "bg-orange-400 text-white hover:bg-orange-500 focus:ring-orange-300 shadow-md",
    outline: "border-2 border-green-200 bg-white text-green-700 hover:bg-green-50 focus:ring-green-400",
    ghost: "text-green-700 hover:bg-green-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, initialMode, preselectedInterest }) => {
  const [view, setView] = useState('FORM');
  const [mode, setMode] = useState(initialMode);
  const [selectedTier, setSelectedTier] = useState(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [interest, setInterest] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setUsername('');
      setPassword('');
      if (preselectedInterest) {
        setInterest(preselectedInterest);
      } else {
        setInterest('');
      }
      
      if (initialMode === 'SIGNUP') {
        setView('SELECT_PLAN');
      } else {
        setView('FORM');
      }
    }
  }, [isOpen, initialMode, preselectedInterest]);

  if (!isOpen) return null;

  const handlePlanSelect = (tier) => {
    setSelectedTier(tier);
    setView('FORM');
    setError('');
  };

  const generateEmail = (user) => {
    const cleanUser = user.trim().toLowerCase().replace(/\s+/g, '');
    return `${cleanUser}@careerfinder.app`;
  };

  const forceMockLogin = (tier, interestVal) => {
    console.warn("Supabase Auth failed or skipped. Using Mock User for demo.");
    localStorage.setItem('careerfinder_mock_user', JSON.stringify({
      username: username || 'Student',
      tier: tier || 'PAID',
      interest: interestVal
    }));
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const generatedEmail = generateEmail(username);

      if (mode === 'SIGNUP') {
        if (!username.trim() || !password.trim()) throw new Error('Please fill in all fields.');
        if (!interest) throw new Error('Please select an Interest.');

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: generatedEmail,
          password,
          options: {
            data: { username: username, tier: selectedTier, interest }
          }
        });

        if (signUpError) {
             forceMockLogin(selectedTier, interest);
             return;
        }
        
        onClose();

      } else {
        // LOGIN
        if (!username.trim() || !password.trim()) throw new Error('Please enter username and password.');

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: generatedEmail,
            password
        });

        if (signInError) {
             forceMockLogin('PAID', interest);
             return;
        }
        
        onClose();
      }
    } catch (err) {
      forceMockLogin('PAID', interest); // Aggressive fallback for demo
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN';
    setMode(newMode);
    setError('');
    if (newMode === 'SIGNUP') {
      setView('SELECT_PLAN');
    } else {
      setView('FORM');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {mode === 'LOGIN' ? 'Welcome Back' : (view === 'SELECT_PLAN' ? 'Choose Your Path' : 'Create Profile')}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6">
          {view === 'SELECT_PLAN' && mode === 'SIGNUP' ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🚀</div>
                <p className="text-slate-500 text-sm">Select a plan to access CareerFinder</p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handlePlanSelect('BUNDLE')}
                  className="w-full flex items-center justify-between p-5 border-2 border-green-500 bg-green-50 rounded-xl hover:bg-green-100 transition shadow-sm group"
                >
                  <div className="text-left">
                    <div className="font-bold text-green-900 text-lg group-hover:text-green-700">Course Bundle</div>
                    <div className="text-xs text-green-700 font-medium">Access All 5 Courses + AI Tutor</div>
                  </div>
                  <div className="font-bold text-green-700 bg-white px-3 py-1 rounded-lg shadow-sm">$10.00</div>
                </button>

                <button 
                  onClick={() => handlePlanSelect('SINGLE')}
                  className="w-full flex items-center justify-between p-5 border-2 border-orange-200 bg-orange-50 rounded-xl hover:border-orange-400 hover:bg-orange-100 transition shadow-sm group"
                >
                  <div className="text-left">
                    <div className="font-bold text-slate-800 group-hover:text-orange-900">Single Course</div>
                    <div className="text-xs text-slate-500 group-hover:text-orange-800">Access Only One Course</div>
                  </div>
                  <div className="font-bold text-orange-600 bg-white px-3 py-1 rounded-lg shadow-sm">$2.50</div>
                </button>

                <button 
                  onClick={() => handlePlanSelect('GUEST')}
                  className="w-full flex items-center justify-between p-5 border-2 border-slate-200 bg-slate-50 rounded-xl hover:border-slate-400 hover:bg-slate-100 transition shadow-sm group"
                >
                  <div className="text-left">
                    <div className="font-bold text-slate-700 group-hover:text-slate-900">Demo Access</div>
                    <div className="text-xs text-slate-500">Limited Preview</div>
                  </div>
                  <div className="font-bold text-slate-600 bg-white px-3 py-1 rounded-lg shadow-sm">Free</div>
                </button>
              </div>

              <div className="text-center pt-2">
                <button onClick={toggleMode} className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">
                  Already have an account? Log In
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'SIGNUP' && (
                <div className="text-center mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      selectedTier === 'BUNDLE' ? 'bg-green-100 text-green-600' : 
                      selectedTier === 'SINGLE' ? 'bg-orange-100 text-orange-600' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                    Selected: {
                        selectedTier === 'BUNDLE' ? 'Complete Bundle ($10)' : 
                        selectedTier === 'SINGLE' ? 'Single Course ($2.50)' : 
                        'Demo Mode (Free)'
                    }
                  </span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow shadow-sm bg-slate-50 focus:bg-white"
                  placeholder="FutureCEO123"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow shadow-sm bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              {mode === 'SIGNUP' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {preselectedInterest ? 'Selected Bundle (Auto-filled)' : 'Select Your Course Bundle'}
                  </label>
                  <div className="relative">
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      disabled={!!preselectedInterest}
                      className={`appearance-none w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-slate-50 focus:bg-white text-slate-700 font-medium transition-shadow shadow-sm cursor-pointer ${preselectedInterest ? 'bg-green-50 text-green-800 border-green-200' : ''}`}
                      required
                    >
                       <option value="" disabled>-- Choose a Cluster --</option>
                       {CATEGORIES.map(cat => (
                         <option key={cat.id} value={cat.title}>{cat.title}</option>
                       ))}
                    </select>
                    {!preselectedInterest && (
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

              <div className="pt-2 flex flex-col gap-3">
                <div className="flex gap-3">
                  {mode === 'SIGNUP' && (
                    <Button type="button" variant="ghost" onClick={() => setView('SELECT_PLAN')} className="w-1/3">
                      Back
                    </Button>
                  )}
                  <Button type="submit" className={mode === 'SIGNUP' ? "w-2/3" : "w-full"} disabled={loading}>
                    {loading ? 'Processing...' : (mode === 'SIGNUP' ? 'Create Account' : 'Log In')}
                  </Button>
                </div>
                
                <div className="text-center">
                  <button type="button" onClick={toggleMode} className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">
                    {mode === 'SIGNUP' ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatWidget = ({ user, onLoginRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const userTier = user ? user.tier : 'GUEST';
  const isPaid = userTier === 'BUNDLE' || userTier === 'SINGLE' || userTier === 'PAID';
  
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: !isPaid 
        ? "Hi! I'm CareerBot (Demo). I can only help with basic info until you verify your account." 
        : "Hi! I'm CareerBot! I'm ready to help you plan your future!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const isNowPaid = userTier === 'BUNDLE' || userTier === 'SINGLE' || userTier === 'PAID';
     setMessages([{ 
      role: 'model', 
      text: !isNowPaid 
        ? "Hi! I'm CareerBot (Demo). Sign up for full career advice!" 
        : "Hi! I'm CareerBot! Ask me anything about your courses!" 
    }]);
  }, [userTier]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await sendMessageToAgent(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  const handleToggle = () => {
    if (!user) {
      onLoginRequest();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      
      {isOpen && user && (
        <div className="pointer-events-auto mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-green-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">
          <div className="p-4 bg-green-500 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
              <div className="flex flex-col">
                <span className="font-bold leading-tight">CareerBot</span>
                <span className="text-[10px] uppercase tracking-wider opacity-90">
                  {isPaid ? 'Full Access' : 'Demo Mode'}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-green-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask CareerBot..."
                className="flex-1 px-4 py-2 bg-slate-50 border-0 rounded-full focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleToggle}
        className="pointer-events-auto shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
      >
        {isOpen && user ? (
             <>
               <span className="text-xl">✕</span>
               <span>Close</span>
             </>
           ) : (
             <>
               <span className="text-xl">🤖</span>
               <span>Chat with CareerBot</span>
             </>
           )}
      </button>
    </div>
  );
};

// --- MOUNT ---
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
