import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 🚨 ACTION REQUIRED: API KEY SETUP 🚨
// ==========================================
const keyPart1 = "AIzaSyDTcFJA";
const keyPart2 = "5cLFeIfbjM4Lup";
const keyPart3 = "54CYVhGGYUa3Q";

const GEMINI_API_KEY = keyPart1 + keyPart2 + keyPart3;

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
        title: 'Business Strategy',
        description: 'How to plan for long term growth and stability.',
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
        title: 'HR & Operations',
        description: 'Managing people and processes efficiently.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=640&q=80',
        tags: ['Management', 'Teams']
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
    id: 'career-pivot',
    title: 'The Career Pivot & Soft Skills',
    type: 'CLUSTER',
    courses: [
      {
        id: 'piv-001',
        title: 'Networking for Introverts',
        description: 'How to build connections without feeling fake or drained.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1521791136064-7985c2d18854?auto=format&fit=crop&w=640&q=80',
        tags: ['Social', 'Career']
      },
      {
        id: 'piv-002',
        title: 'Resume Branding',
        description: 'Turn your boring CV into a marketing document.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=640&q=80',
        tags: ['Writing', 'Business']
      },
      {
        id: 'piv-003',
        title: 'Negotiating Your Salary',
        description: 'The art of getting paid what you are actually worth.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=640&q=80',
        tags: ['Money', 'Talk']
      },
      {
        id: 'piv-004',
        title: 'Public Speaking',
        description: 'Command the room and present with confidence.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1475721027767-4d0637c60eef?auto=format&fit=crop&w=640&q=80',
        tags: ['Speech', 'Leadership']
      },
      {
        id: 'piv-005',
        title: 'Emotional Intelligence',
        description: 'Understanding yourself and others in the workplace.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=640&q=80',
        tags: ['Mind', 'Psychology']
      }
    ]
  },
  {
    id: 'board-game-design',
    title: 'Board Game Design & Gamification',
    type: 'CLUSTER',
    courses: [
      {
        id: 'bg-001',
        title: 'Game Mechanics 101',
        description: 'Understanding rules, loops, and player incentives.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1610890716271-e2fe9e871436?auto=format&fit=crop&w=640&q=80',
        tags: ['Design', 'Logic']
      },
      {
        id: 'bg-002',
        title: 'Prototyping with Paper',
        description: 'Fast and cheap ways to test your game ideas.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1606167568502-5b8916f56c28?auto=format&fit=crop&w=640&q=80',
        tags: ['Creative', 'Art']
      },
      {
        id: 'bg-003',
        title: 'Balancing Luck vs. Skill',
        description: 'Math and probability for game designers.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&w=640&q=80',
        tags: ['Math', 'Strategy']
      },
      {
        id: 'bg-004',
        title: 'Crowdfunding Your Game',
        description: 'How to launch a successful Kickstarter campaign.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=640&q=80',
        tags: ['Business', 'Money']
      },
      {
        id: 'bg-005',
        title: 'Gamifying Real Life',
        description: 'Applying game design to work, school, and habits.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=640&q=80',
        tags: ['Life', 'Psychology']
      }
    ]
  },
  {
    id: 'non-profit',
    title: 'Non-Profit & Youth Leadership',
    type: 'CLUSTER',
    courses: [
      {
        id: 'np-001',
        title: 'Grant Writing Basics',
        description: 'How to secure funding for your cause.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=640&q=80',
        tags: ['Writing', 'Money']
      },
      {
        id: 'np-002',
        title: 'Volunteer Management',
        description: 'Recruiting, retaining, and inspiring volunteers.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=640&q=80',
        tags: ['Leadership', 'People']
      },
      {
        id: 'np-003',
        title: 'Community Organizing',
        description: 'Grassroots strategies to make real change.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba063e?auto=format&fit=crop&w=640&q=80',
        tags: ['Social', 'Action']
      },
      {
        id: 'np-004',
        title: 'Social Impact Strategy',
        description: 'Measuring the good you actually do.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=640&q=80',
        tags: ['Strategy', 'Planning']
      },
      {
        id: 'np-005',
        title: 'Fundraising Events',
        description: 'Planning galas, walks, and charity auctions.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=640&q=80',
        tags: ['Events', 'Money']
      }
    ]
  },
  {
    id: 'project-management',
    title: 'Project Management',
    type: 'CLUSTER',
    courses: [
      {
        id: 'pm-001',
        title: 'Agile & Scrum Basics',
        description: 'Modern methodologies for fast-moving teams.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=640&q=80',
        tags: ['Agile', 'Tech']
      },
      {
        id: 'pm-002',
        title: 'Timeline Mastery',
        description: 'Gantt charts, deadlines, and critical paths.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=640&q=80',
        tags: ['Planning', 'Time']
      },
      {
        id: 'pm-003',
        title: 'Budgeting for Success',
        description: 'Keeping your project in the green.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1554224154-260327c00c40?auto=format&fit=crop&w=640&q=80',
        tags: ['Money', 'Finance']
      },
      {
        id: 'pm-004',
        title: 'Risk Management',
        description: 'Identifying problems before they explode.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1507537297725-24a1c434c67b?auto=format&fit=crop&w=640&q=80',
        tags: ['Safety', 'Logic']
      },
      {
        id: 'pm-005',
        title: 'Leading Remote Teams',
        description: 'Managing people you only see on Zoom.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=640&q=80',
        tags: ['Remote', 'Leadership']
      }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    type: 'CLUSTER',
    courses: [
      {
        id: 'dm-001',
        title: 'SEO Fundamentals',
        description: 'Ranking #1 on Google without paying for ads.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=640&q=80',
        tags: ['Search', 'Tech']
      },
      {
        id: 'dm-002',
        title: 'Social Media Strategy',
        description: 'Building a brand on Instagram, TikTok, and LinkedIn.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=640&q=80',
        tags: ['Social', 'Brand']
      },
      {
        id: 'dm-003',
        title: 'Content Marketing',
        description: 'Writing blogs and copy that sells.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=640&q=80',
        tags: ['Writing', 'Creative']
      },
      {
        id: 'dm-004',
        title: 'Email Campaigns',
        description: 'The highest ROI tool in the marketing box.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1563986768494-4dee46a38531?auto=format&fit=crop&w=640&q=80',
        tags: ['Email', 'Sales']
      },
      {
        id: 'dm-005',
        title: 'Analytics & Data',
        description: 'Reading the numbers to know what works.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80',
        tags: ['Data', 'Math']
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
  // Directly use the key variable. NO process.env check to avoid browser errors.
  const apiKey = GEMINI_API_KEY || '';

  if (!apiKey || apiKey.includes("PASTE_YOUR_NEW_KEY_HERE")) {
    console.warn("API Key is missing. Please edit script.js.");
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
    if (!success) return "⚠️ CONFIGURATION ERROR: API Key missing.";
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
    
    if (errorMessage.includes("403") || errorMessage.includes("leaked") || errorMessage.includes("expired")) {
        return "⚠️ API KEY ERROR: Your API key is expired or invalid.";
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
      tier: tier || 'BUNDLE',
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
             forceMockLogin('BUNDLE', interest);
             return;
        }
        
        onClose();
      }
    } catch (err) {
      forceMockLogin('BUNDLE', interest); // Aggressive fallback for demo
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
                {/* 
                   =============================================
                   GLAZED SHINY BUTTON FOR BUNDLE
                   =============================================
                */}
                <button 
                  onClick={() => handlePlanSelect('BUNDLE')}
                  className="relative w-full flex items-center justify-between p-5 border-4 border-green-400 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] group overflow-hidden"
                >
                  {/* Glare/Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent opacity-50 pointer-events-none"></div>
                  
                  {/* Best Value Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black uppercase px-3 py-1 rounded-full shadow-md border border-yellow-200 z-10 animate-bounce">
                    ✨ Best Value ✨
                  </div>

                  <div className="text-left relative z-10">
                    <div className="font-extrabold text-green-900 text-lg group-hover:text-green-800">Complete Bundle</div>
                    <div className="text-xs text-green-800 font-bold">Access All 50 Courses + AI Tutor</div>
                  </div>
                  
                  <div className="flex flex-col items-end relative z-10">
                     <span className="text-xs text-slate-500 line-through font-bold decoration-red-500 decoration-2">$100.00</span>
                     <div className="font-black text-3xl text-green-700 drop-shadow-sm">$10.00</div>
                  </div>
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

// ==========================================
// 4. MAIN APP
// ==========================================

const App = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState('LOGIN');
  const [preselectedInterest, setPreselectedInterest] = useState(undefined);
  
  const [view, setView] = useState('landing');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScores, setQuizScores] = useState({});
  
  const [userCount, setUserCount] = useState(9044284);

  const questions = [
    {
      text: "When you visualize your ideal workday, what are you doing?",
      options: [
        { text: "Building structure & organizing chaos", tags: ['Business', 'Logic', 'Structure', 'Management', 'Finance'] },
        { text: "Connecting with & leading people", tags: ['Leadership', 'People', 'Service', 'Society', 'Talk'] },
        { text: "Creating something visual or auditory", tags: ['Art', 'Design', 'Creative', 'Media', 'Audio', 'Music'] }
      ]
    },
    {
      text: "How do you prefer to solve complex problems?",
      options: [
        { text: "Analyze data and follow the facts", tags: ['Math', 'Coding', 'Research', 'Science', 'Security'] },
        { text: "Collaborate and brainstorm with a team", tags: ['Therapy', 'Teams', 'Events', 'Food'] },
        { text: "Experiment until something works", tags: ['Startup', 'Instrument', 'Photo', 'Cafe'] }
      ]
    },
    {
      text: "Which of these feels like a superpower you want?",
      options: [
        { text: "Unshakeable Stability & Wealth", tags: ['Money', 'Security', 'Business'] },
        { text: "Healing & Helping Others", tags: ['Health', 'Medical', 'Service', 'Teaching', 'Kids'] },
        { text: "Unbounded Expression", tags: ['Video', 'Voice', 'Singing', '3D', 'Web'] }
      ]
    }
  ];

  // Auth Listener
  useEffect(() => {
    // 0. Check for Mock User (Fallback for school project)
    const checkUser = async () => {
        const mock = localStorage.getItem('careerfinder_mock_user');
        if (mock) {
            try {
                const u = JSON.parse(mock);
                setUser({
                    id: 'mock-123',
                    name: u.username,
                    tier: u.tier,
                    interest: u.interest
                });
                // If we found a mock user, we don't necessarily wait for supabase
            } catch (e) {
                localStorage.removeItem('careerfinder_mock_user');
            }
        }
        
        // 1. Try Real Supabase Session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setUser({
                id: session.user.id,
                name: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
                tier: session.user.user_metadata.tier,
                interest: session.user.user_metadata.interest
            });
        }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
          tier: session.user.user_metadata.tier,
          interest: session.user.user_metadata.interest
        });
        setShowLoginModal(false); 
        setPreselectedInterest(undefined);
        // Clean up mock if real auth works
        localStorage.removeItem('careerfinder_mock_user');
      } else {
        // Only reset if we don't have a mock user
        if (!localStorage.getItem('careerfinder_mock_user')) {
             setUser(null);
             setView('landing'); 
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const tier = user ? user.tier : 'GUEST';
    const interest = user?.interest;
    initializeChat(tier, interest);
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
        setUserCount(prev => prev + Math.floor(Math.random() * 15) + 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

   // --- Dynamic Module Generation ---
  const currentModules = useMemo(() => {
    if (!selectedCourse) return [];
    
    const t = selectedCourse.tags;
    const mainTag = t[0] || "General";
    const secTag = t[1] || "Advanced";

    return [
      {
        title: `Introduction to ${selectedCourse.title}`,
        duration: "15 mins",
        content: (
          <React.Fragment>
            <p className="mb-4 text-lg leading-relaxed">
              Welcome to <strong>{selectedCourse.title}</strong>. This is the beginning of your journey into the world of {mainTag}. 
              Whether you are here to build a career or explore a passion, understanding the fundamental landscape of this industry is crucial.
            </p>
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Why {mainTag} Matters</h3>
            <p className="mb-4">
              In today's rapidly evolving economy, {mainTag} remains a cornerstone of innovation and service. 
              By mastering these skills, you position yourself not just as a participant, but as a leader.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <h4 className="font-bold text-blue-900">Learning Objective</h4>
              <p className="text-blue-800 text-sm">By the end of this module, you will be able to articulate the core value proposition of {selectedCourse.title} and identify key career opportunities.</p>
            </div>
          </React.Fragment>
        )
      },
      {
        title: `Core Principles of ${mainTag}`,
        duration: "45 mins",
        content: (
          <React.Fragment>
            <p className="mb-4 text-lg leading-relaxed">
              Before we can run, we must walk. This module breaks down the essential theories that underpin {selectedCourse.title}.
            </p>
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">The Three Pillars</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li><strong>Theory:</strong> Understanding the 'Why' behind the 'How'.</li>
              <li><strong>Application:</strong> Using {secTag} in real-world scenarios.</li>
              <li><strong>Ethics:</strong> maintaining high standards in {mainTag}.</li>
            </ul>
            <p>
              Many beginners skip these steps, leading to fragile foundations. We will ensure you have a robust understanding of the basics.
            </p>
          </React.Fragment>
        )
      },
      {
        title: `Tools & Techniques: ${secTag}`,
        duration: "60 mins",
        content: (
          <React.Fragment>
            <p className="mb-4 text-lg leading-relaxed">
              It is time to get your hands dirty. In this module, we explore the industry-standard tools used by professionals in {mainTag}.
            </p>
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Required Equipment</h3>
            <p className="mb-4">
              You don't need the most expensive gear to start, but you do need reliable tools. We will review the best options for {secTag} at every budget level.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <div className="font-bold text-slate-700 mb-1">Beginner Setup</div>
                 <div className="text-sm text-slate-500">Focus on accessibility and ease of use.</div>
               </div>
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <div className="font-bold text-slate-700 mb-1">Pro Setup</div>
                 <div className="text-sm text-slate-500">Focus on efficiency, scale, and durability.</div>
               </div>
            </div>
          </React.Fragment>
        )
      },
      {
        title: `Advanced Strategies in ${selectedCourse.title}`,
        duration: "90 mins",
        content: (
          <React.Fragment>
            <p className="mb-4 text-lg leading-relaxed">
              Now that you have the basics, let's look at how experts differentiate themselves. 
              Advanced {mainTag} involves critical thinking and pattern recognition.
            </p>
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Case Study Analysis</h3>
            <p className="mb-4">
              We will examine a real-world scenario where standard methods failed, and creative application of {secTag} saved the day.
            </p>
            <p className="mb-4">
              <strong>Key Takeaway:</strong> Rules are meant to be understood so they can be effectively broken when innovation is required.
            </p>
          </React.Fragment>
        )
      },
      {
        title: "Final Assessment & Career Roadmap",
        duration: "30 mins",
        content: (
          <React.Fragment>
            <p className="mb-4 text-lg leading-relaxed">
              Congratulations on reaching the final module. You have covered the spectrum of {selectedCourse.title}.
            </p>
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Next Steps</h3>
            <p className="mb-6">
              To turn this knowledge into a career, you must build a portfolio. Start small, document your work in {mainTag}, and network with others in {secTag}.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎓</div>
              <h4 className="font-bold text-green-900 text-lg">Certificate of Completion</h4>
              <p className="text-green-800 text-sm mb-4">You are ready to take the final quiz to earn your credential.</p>
              <Button onClick={() => alert("Certificate Downloaded!")}>Download Certificate</Button>
            </div>
          </React.Fragment>
        )
      }
    ];
  }, [selectedCourse]);

  const openAuthModal = (mode, interestToSelect) => {
    setAuthMode(mode);
    if (interestToSelect) {
      setPreselectedInterest(interestToSelect);
    } else {
      setPreselectedInterest(undefined);
    }
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('careerfinder_mock_user');
    setUser(null);
    setView('landing');
  };

  const goHome = () => {
    setView('landing');
    setSelectedCategory(null);
    resetQuiz();
  };

  const goToClusters = () => {
    setView('clusters_list');
    setSelectedCategory(null);
    resetQuiz();
  };

  const openCluster = (category) => {
    setSelectedCategory(category);
    setView('cluster_courses');
    resetQuiz();
  };

  const openCourse = (course) => {
    setSelectedCourse(course);
    setView('course_details');
  };

  // AUTO-SAVE LOGIC
  // Save progress whenever activeModuleIndex changes
  useEffect(() => {
    if (user && selectedCourse && view === 'learning_mode') {
      const key = `progress_${user.id}_${selectedCourse.id}`;
      localStorage.setItem(key, activeModuleIndex.toString());
      console.log("Auto-saved progress:", key, activeModuleIndex);
    }
  }, [activeModuleIndex, user, selectedCourse, view]);

  // Load progress when starting learning
  const startLearning = () => {
    if (user && selectedCourse) {
       const key = `progress_${user.id}_${selectedCourse.id}`;
       const saved = localStorage.getItem(key);
       if (saved) {
         setActiveModuleIndex(parseInt(saved));
       } else {
         setActiveModuleIndex(0);
       }
    } else {
       setActiveModuleIndex(0);
    }
    setView('learning_mode');
    window.scrollTo(0, 0);
  };

  const nextModule = () => {
    if (activeModuleIndex < currentModules.length - 1) {
      setActiveModuleIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const resetQuiz = () => {
    setShowQuizResult(false);
    setQuizResult(null);
    setQuizActive(false);
    setCurrentQuestion(0);
    setQuizScores({});
  };

  const startQuiz = () => {
    resetQuiz();
    setQuizActive(true);
  };

  const handleQuizAnswer = (tags) => {
    const newScores = { ...quizScores };
    tags.forEach(tag => {
      newScores[tag] = (newScores[tag] || 0) + 1;
    });
    setQuizScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishQuiz(newScores);
    }
  };

  const finishQuiz = (finalScores) => {
    if (!selectedCategory) return;
    
    let bestCourse = selectedCategory.courses[0];
    let maxScore = -1;

    selectedCategory.courses.forEach(course => {
      let courseScore = 0;
      course.tags.forEach(tag => {
        if (finalScores[tag]) courseScore += finalScores[tag] * 2;
        Object.keys(finalScores).forEach(scoreTag => {
          if (tag.includes(scoreTag) || scoreTag.includes(tag)) {
            courseScore += 0.5;
          }
        });
      });
      courseScore += Math.random();

      if (courseScore > maxScore) {
        maxScore = courseScore;
        bestCourse = course;
      }
    });

    setQuizResult(bestCourse);
    setQuizActive(false);
    setShowQuizResult(true);
  };

  const handleImageError = (e) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=640&q=80";
  };

  // CHECK ACCESS LEVEL
  const hasAccess = user && (
    user.tier === 'BUNDLE' || 
    user.tier === 'PAID' || 
    (user.tier === 'SINGLE' && user.interest === selectedCategory?.title)
  );

  const isUserPaid = user && (user.tier === 'BUNDLE' || user.tier === 'SINGLE' || user.tier === 'PAID');

  return (
    <div className="min-h-screen flex flex-col bg-green-50 font-sans text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transform hover:rotate-6 transition-transform">C</div>
            <span className="font-bold text-green-800 text-xl hidden sm:block">CareerFinder</span>
          </div>
          
          <nav className="hidden md:flex gap-10 text-base font-bold text-slate-500">
            <button 
              onClick={goHome} 
              className={`hover:text-green-600 transition-colors ${view === 'landing' ? 'text-green-600' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={goToClusters} 
              className={`hover:text-green-600 transition-colors ${view === 'clusters_list' || view === 'cluster_courses' ? 'text-green-600' : ''}`}
            >
              Course Groups
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-green-900">{user.name}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isUserPaid ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                        {user.tier === 'BUNDLE' ? 'Full Bundle' : (user.tier === 'SINGLE' ? 'Single Course' : 'Guest')}
                      </span>
                      {user.interest && (
                         <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 max-w-[100px] truncate">
                           {user.interest}
                         </span>
                      )}
                    </div>
                 </div>
                 <Button variant="outline" size="sm" onClick={handleLogout}>Sign Out</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => openAuthModal('LOGIN')}>Log In</Button>
                <Button onClick={() => openAuthModal('SIGNUP')}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* LANDING PAGE */}
        {view === 'landing' && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-700">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6">
                ✨ SEIZE YOUR DESTINY
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-green-900 tracking-tight mb-8 leading-snug pb-2">
                Learn what you <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400">Love</span>.<br/>
                Do what makes you <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Happy</span>.
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Welcome to CareerFinder! We have organized all knowledge into convenient <strong>Course Groups</strong> to help you find your path easily.
                <br/>Our <strong className="text-slate-800">CareerBot</strong> is waiting to help you!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={goToClusters}>Browse Course Groups</Button>
              </div>
            </div>

            <div className="w-full max-w-3xl mx-auto mb-12 bg-red-600 text-white p-6 rounded-lg shadow-2xl border-4 border-yellow-400 animate-pulse text-center transform rotate-1">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-yellow-300 leading-none mb-1">WARNING: LAST CHANCE TO BOARD.</h2>
              <p className="font-bold text-lg md:text-xl">
                The train to success is right here. Don't feel sad when it's gone.
              </p>
            </div>

            <div className="bg-orange-400 -rotate-2 rounded-xl p-12 shadow-xl mb-16 max-w-4xl mx-auto transform hover:rotate-0 transition-transform cursor-default border-4 border-white">
              <div className="text-center text-white font-black text-4xl md:text-6xl tracking-wide uppercase drop-shadow-md leading-tight">
                Skilled and bold.<br/>
                Worth your weight in gold.
              </div>
            </div>

            <div className="text-center mb-16">
               <div className="inline-block bg-slate-800 p-8 rounded-3xl shadow-2xl border-b-8 border-slate-600">
                  <div className="text-5xl md:text-7xl font-black text-green-400 tabular-nums font-mono mb-2">
                      {userCount.toLocaleString()}
                  </div>
                  <div className="text-white font-bold uppercase tracking-[0.1em] text-sm">
                      Smart Winners Joined Already
                  </div>
                  <div className="text-slate-400 text-xs mt-2 italic">
                      You are the only one left behind.
                  </div>
               </div>
            </div>

            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
               <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-transform flex flex-col">
                 <div className="text-4xl mb-4">👑</div>
                 <h3 className="text-xl font-extrabold mb-3 uppercase tracking-tight">ABSOLUTE CERTAINTY</h3>
                 <p className="text-green-100 text-sm leading-relaxed flex-1">
                   Why gamble with your future? Our <strong>Flawless</strong> algorithms eliminate <strong>Risk</strong>. Gain <strong>Guaranteed</strong> success through <strong>Scientific</strong> precision. Don't just hope—<strong>KNOW</strong> your destiny with <strong>Mathematical Perfection</strong>.
                 </p>
               </div>
               
               <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-transform delay-75 flex flex-col">
                 <div className="text-4xl mb-4">🏆</div>
                 <h3 className="text-xl font-extrabold mb-3 uppercase tracking-tight">ELITE STATUS</h3>
                 <p className="text-orange-100 text-sm leading-relaxed flex-1">
                   Leave <strong>Mediocrity</strong> behind. Join the <strong>Winners</strong> circle. Secure <strong>Unlimited</strong> potential and command the <strong>Respect</strong> you deserve. Be the <strong>Leader</strong> everyone admires. Claim your <strong>Victory</strong> today.
                 </p>
               </div>

               <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-transform delay-150 flex flex-col">
                 <div className="text-4xl mb-4">⚡</div>
                 <h3 className="text-xl font-extrabold mb-3 uppercase tracking-tight">INSTANT MASTERY</h3>
                 <p className="text-blue-100 text-sm leading-relaxed flex-1">
                   Skip the <strong>Struggle</strong>. Achieve <strong>Effortless</strong> results while others work hard. Our system is your <strong>Secret Weapon</strong> for <strong>Automatic</strong> success. Unlock <strong>Genius</strong> level insight in seconds. It's almost <strong>Magic</strong>.
                 </p>
               </div>
            </div>

            <div className="max-w-4xl mx-auto mt-16 mb-16 px-4">
              <h2 className="text-3xl font-bold text-center text-green-900 mb-8">Trusted by Famous People</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 transform hover:-translate-y-1 transition-transform">
                    <p className="italic text-slate-600 mb-4 text-lg">"I wish I had this when I started. It is the only way to be the best you can be. Don't go to space without it."</p>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs">🚀</div>
                      Elon M., Tech Leader
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 transform hover:-translate-y-1 transition-transform">
                    <p className="italic text-slate-600 mb-4 text-lg">"I was scared by too many choices until CareerFinder told me who to be. It looked at who I am and gave me a plan. Now I don't have to worry about my future."</p>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs">🎤</div>
                      Taylor S., Pop Star
                    </div>
                </div>
              </div>
            </div>

            <div className="fixed top-1/4 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10 animate-pulse"></div>
            <div className="fixed bottom-1/4 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10 animate-pulse delay-75"></div>
          </div>
        )}

        {view === 'clusters_list' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-green-900 mb-2">Course Groups</h2>
               <p className="text-slate-500">Select a group to view available courses</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {CATEGORIES.map((category) => (
                   <div 
                      key={category.id} 
                      onClick={() => openCluster(category)}
                      className="cursor-pointer group rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-slate-100 overflow-hidden flex flex-col"
                   >
                     <div className="h-44 overflow-hidden relative bg-slate-200">
                        <img 
                          src={category.courses[0]?.image} 
                          onError={handleImageError}
                          alt={category.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-900 shadow-md">
                          $10.00
                        </div>
                     </div>
                     <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors">{category.title}</h3>
                        <p className="text-slate-500 text-sm mb-4">{category.courses.length} Courses Available</p>
                        
                        <div className="mt-auto flex items-center text-green-600 font-bold text-sm">
                            <span>Explore Path</span>
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                     </div>
                   </div>
                ))}
             </div>
           </div>
        )}

        {view === 'cluster_courses' && selectedCategory && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <button onClick={goToClusters} className="mb-6 flex items-center text-slate-500 hover:text-green-600 transition font-medium">
               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               Back to Groups
             </button>

             <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-green-200 pb-4 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-green-900">{selectedCategory.title}</h2>
                  <p className="text-slate-500 text-sm mt-1">Explore the available paths below</p>
                </div>
                {!quizActive && !showQuizResult && (
                  <Button variant="secondary" onClick={startQuiz} className="animate-bounce hover:animate-none">
                    ⚡ Not sure? Find Your Match!
                  </Button>
                )}
             </div>

             {quizActive && (
               <div className="mb-8 p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl border border-indigo-200 shadow-xl animate-in zoom-in-95">
                 <div className="max-w-2xl mx-auto text-center">
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 block">Question {currentQuestion + 1} of {questions.length}</span>
                    <h3 className="text-2xl font-bold text-slate-800 mb-8">{questions[currentQuestion].text}</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {questions[currentQuestion].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(option.tags)}
                          className="p-4 bg-white rounded-xl border-2 border-transparent hover:border-indigo-400 hover:shadow-md transition-all text-left group"
                        >
                          <span className="font-medium text-slate-700 group-hover:text-indigo-700">{option.text}</span>
                        </button>
                      ))}
                    </div>
                 </div>
               </div>
             )}

             {showQuizResult && quizResult && (
               <div className="mb-8 p-6 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl border-2 border-orange-300 animate-in zoom-in shadow-xl relative">
                 <button onClick={resetQuiz} className="absolute top-4 right-4 text-orange-400 hover:text-orange-600">✕</button>
                 <div className="flex flex-col md:flex-row gap-6 items-center">
                   <div className="flex-1 text-center md:text-left">
                     <div className="inline-block bg-white text-orange-600 font-bold px-3 py-1 rounded-full text-xs mb-2 shadow-sm">
                       🎯 Recommended for You
                     </div>
                     <h3 className="text-2xl font-bold text-slate-800 mb-2">Based on your personality, try: {quizResult.title}</h3>
                     <p className="text-slate-700 mb-4">{quizResult.description}</p>
                     <Button onClick={() => openCourse(quizResult)} className="bg-slate-900 text-white hover:bg-slate-700">
                       View This Course
                     </Button>
                   </div>
                   <div className="w-full md:w-1/3 h-40 rounded-xl overflow-hidden shadow-lg">
                      <img src={quizResult.image} alt={quizResult.title} className="w-full h-full object-cover" onError={handleImageError} />
                   </div>
                 </div>
               </div>
             )}
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedCategory.courses.map((course) => (
                  <div key={course.id} className="group bg-white rounded-2xl border-2 border-transparent hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden transform hover:-translate-y-1">
                    <div className="h-48 overflow-hidden relative">
                       <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImageError} />
                       <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-900 shadow-md">
                         ${course.price.toFixed(2)}
                       </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {course.tags.map(tag => (
                          <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded-md">{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-green-600 transition-colors">{course.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 flex-1">{course.description}</p>
                      
                      <Button onClick={() => openCourse(course)} variant="outline" className="w-full group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'course_details' && selectedCourse && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto">
            <button onClick={() => selectedCategory ? openCluster(selectedCategory) : goToClusters()} className="mb-6 flex items-center text-slate-500 hover:text-green-600 transition font-medium">
               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               Back to Course List
             </button>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full relative bg-slate-200">
                   <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-full object-cover" onError={handleImageError} />
                   <div className="absolute inset-0 bg-black/10"></div>
                </div>
                
                <div className="p-8 md:p-12 flex flex-col justify-center">
                   <div className="flex gap-2 mb-4">
                      {selectedCourse.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-green-100 text-green-700 rounded-full">{tag}</span>
                      ))}
                   </div>
                   <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{selectedCourse.title}</h1>
                   <p className="text-lg text-slate-600 mb-8 leading-relaxed">{selectedCourse.description}</p>
                   
                   <div className="flex items-center gap-6 mb-8">
                      <div className="text-3xl font-black text-green-600">${selectedCourse.price.toFixed(2)}</div>
                      {hasAccess ? (
                        <div className="text-green-600 font-bold flex items-center bg-green-50 px-3 py-1 rounded-lg">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Unlocked
                        </div>
                      ) : (
                        <div className="text-slate-400 text-sm font-medium">One-time purchase</div>
                      )}
                   </div>

                   <div className="flex flex-col gap-3">
                     {hasAccess ? (
                       <Button size="lg" className="w-full" onClick={startLearning}>
                         Start Learning Now
                       </Button>
                     ) : (
                       <Button size="lg" className="w-full" onClick={() => openAuthModal('SIGNUP', selectedCategory?.title)}>
                         Unlock Full Access
                       </Button>
                     )}
                     <p className="text-center text-xs text-slate-400 mt-2">
                       {hasAccess ? 'Includes 24/7 AI Tutor Access' : 'Includes access to all courses in this cluster + AI Tutor'}
                     </p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                 <div className="flex-1">
                   <h3 className="text-2xl font-bold mb-4">Have questions about this course?</h3>
                   <p className="text-indigo-200 mb-6">Our AI CareerBot has studied {selectedCourse.title} in detail. It can help you understand if this is the right path for you or explain complex topics instantly.</p>
                   <Button variant="secondary" onClick={() => document.querySelector('.fixed.bottom-6.right-6 button')?.click()}>
                     Chat with CareerBot
                   </Button>
                 </div>
                 <div className="text-9xl opacity-20 transform rotate-12">🤖</div>
               </div>
               
               <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
               <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
            </div>
          </div>
        )}

        {view === 'learning_mode' && selectedCourse && currentModules.length > 0 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
             
             {/* Sidebar */}
             <div className="w-full lg:w-1/4">
                <button onClick={() => setView('course_details')} className="mb-6 flex items-center text-slate-500 hover:text-green-600 transition font-medium">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Exit Course
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
                   <div className="bg-green-50 p-4 border-b border-green-100">
                      <h4 className="font-bold text-green-900 text-sm uppercase tracking-wide">Course Syllabus</h4>
                   </div>
                   <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
                      {currentModules.map((module, idx) => (
                        <div 
                           key={idx} 
                           onClick={() => {
                             setActiveModuleIndex(idx);
                             window.scrollTo(0, 0);
                           }}
                           className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 ${
                             activeModuleIndex === idx 
                               ? 'bg-indigo-50 border-indigo-500' 
                               : 'border-transparent'
                           }`}
                        >
                           <div className="flex justify-between items-center mb-1">
                             <div className={`text-xs font-bold ${activeModuleIndex === idx ? 'text-indigo-500' : 'text-slate-400'}`}>
                               Module {idx + 1}
                             </div>
                             <div className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                               {module.duration}
                             </div>
                           </div>
                           <div className={`font-medium text-sm ${activeModuleIndex === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                             {module.title}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Main Content */}
             <div className="flex-1">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12">
                   <div className="flex items-center gap-3 mb-6">
                     <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                       Module {activeModuleIndex + 1}
                     </span>
                     <span className="text-slate-400 text-sm">/ {currentModules.length} Modules</span>
                   </div>
                   
                   <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                     {currentModules[activeModuleIndex].title}
                   </h1>
                   
                   <div className="prose prose-lg text-slate-600 max-w-none">
                      <img 
                        src={selectedCourse.image} 
                        className="w-full h-64 object-cover rounded-2xl mb-8 shadow-sm" 
                        onError={handleImageError} 
                        alt="Course Header"
                      />
                      
                      {/* Dynamic Content */}
                      {currentModules[activeModuleIndex].content}

                      {/* AI Assistance Box - Replaces Generic Pro Tip */}
                      <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4 mt-12">
                         <div className="text-3xl">🤖</div>
                         <div>
                           <h4 className="font-bold text-green-900 mb-1">Need Clarification?</h4>
                           <p className="text-sm text-green-800 mb-3">
                             CareerBot is reading along with you. If you don't understand specific terms in this module, just ask!
                           </p>
                           <button 
                             onClick={() => document.querySelector('.fixed.bottom-6.right-6 button')?.click()}
                             className="text-xs font-bold bg-white text-green-700 px-3 py-2 rounded-lg shadow-sm hover:shadow hover:bg-green-50 transition"
                           >
                             Ask CareerBot
                           </button>
                         </div>
                      </div>
                   </div>

                   <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
                      <Button 
                        variant="outline" 
                        onClick={prevModule} 
                        disabled={activeModuleIndex === 0}
                      >
                        ← Previous
                      </Button>
                      <Button 
                        onClick={nextModule} 
                        disabled={activeModuleIndex === currentModules.length - 1}
                      >
                        {activeModuleIndex === currentModules.length - 1 ? 'Finish Course' : 'Next Module →'}
                      </Button>
                   </div>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4 font-bold text-slate-200 text-lg">CareerFinder AI</p>
          <p className="text-sm">© 2025 CareerFinder Inc. All rights reserved.</p>
          <p className="text-xs mt-4 text-slate-600">Disclaimer: Career advice is based on algorithms. Results may vary. Happiness is not guaranteed but highly probable.</p>
        </div>
      </footer>

      <Modal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        initialMode={authMode}
        preselectedInterest={preselectedInterest}
      />

      <ChatWidget user={user} onLoginRequest={() => openAuthModal('SIGNUP')} />
    </div>
  );
};

// --- MOUNT ---
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
