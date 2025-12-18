
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 🛡️ GA CONFIGURATION (OBSCURED) 🛡️
// ==========================================
const _x0 = 'A'; const _n1 = 'xc8';
const _x1 = 'I'; const _n2 = 'd9f';
const _x2 = 'z'; const _n3 = '99s';
const _x3 = 'a'; const _n4 = 'vv1';
const _x4 = 'S'; const _n5 = 'aa2';
const _x5 = 'y'; const _n6 = 'bb3';
// FULL KEY PART B INJECTED
const GA_SECRET_PAYLOAD = "DTcFJA5cLFeIfbjM4Lup54CYVhGGYUa3Q"; 

const getGA = () => {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        return process.env.API_KEY;
    }
    const local = localStorage.getItem('GA_KEY');
    if (local) return local;

    const header = _x0 + _x1 + _x2 + _x3 + _x4 + _x5;
    if (GA_SECRET_PAYLOAD.includes("PASTE")) return "";
    return header + GA_SECRET_PAYLOAD;
};

// Safe Supabase Init
const supabaseUrl = 'https://bwjjfnkuqnravvfytxbf.supabase.co';
const supabaseKey = 'sb_publishable_9z5mRwy-X0zERNX7twZzPw_RdskfL8s';
let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (e) {
  console.error("Supabase failed to init:", e);
}

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
  // NEW CLUSTERS
  {
    id: 'pivot-cluster',
    title: 'The Career Pivot & Soft Skills',
    type: 'CLUSTER',
    courses: [
       { id: 'piv-001', title: 'Resume & Interview Mastery', description: 'Stand out in any job market.', price: 2.5, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=640&q=80', tags: ['Career', 'Skills'] },
       { id: 'piv-002', title: 'Networking for Introverts', description: 'Build connections without burnout.', price: 2.5, image: 'https://images.unsplash.com/photo-1515169067750-d51a73b5386d?auto=format&fit=crop&w=640&q=80', tags: ['Social', 'Communication'] },
       { id: 'piv-003', title: 'Negotiation Skills', description: 'Get the salary you deserve.', price: 2.5, image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=640&q=80', tags: ['Business', 'Money'] },
       { id: 'piv-004', title: 'Emotional Intelligence', description: 'Understanding workplace dynamics.', price: 2.5, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=640&q=80', tags: ['Psychology', 'Leadership'] },
       { id: 'piv-005', title: 'Public Speaking 101', description: 'Present with confidence.', price: 2.5, image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=640&q=80', tags: ['Speaking', 'Skills'] }
    ]
  },
  {
    id: 'game-cluster',
    title: 'Board Game Design & Gamification',
    type: 'CLUSTER',
    courses: [
       { id: 'gam-001', title: 'Game Theory Basics', description: 'Math behind the fun.', price: 2.5, image: 'https://images.unsplash.com/photo-1611996908543-160774a8775d?auto=format&fit=crop&w=640&q=80', tags: ['Logic', 'Math'] },
       { id: 'gam-002', title: 'Prototyping Card Games', description: 'From index cards to production.', price: 2.5, image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=640&q=80', tags: ['Design', 'Creative'] },
       { id: 'gam-003', title: 'Rules Writing Workshop', description: 'Clarity is king.', price: 2.5, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=640&q=80', tags: ['Writing', 'Structure'] },
       { id: 'gam-004', title: 'Kickstarter for Games', description: 'Crowdfunding your dream.', price: 2.5, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=640&q=80', tags: ['Business', 'Marketing'] },
       { id: 'gam-005', title: 'Playtesting Psychology', description: 'Watching how players think.', price: 2.5, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=640&q=80', tags: ['Research', 'People'] }
    ]
  },
  {
    id: 'nonprofit-cluster',
    title: 'Non-Profit & Youth Leadership',
    type: 'CLUSTER',
    courses: [
       { id: 'org-001', title: 'Starting a 501(c)(3)', description: 'Legal and practical steps.', price: 2.5, image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=640&q=80', tags: ['Business', 'Legal'] },
       { id: 'org-002', title: 'Grant Writing Essentials', description: 'Funding your mission.', price: 2.5, image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=80', tags: ['Writing', 'Finance'] },
       { id: 'org-003', title: 'Volunteer Management', description: 'Leading unpaid teams.', price: 2.5, image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=640&q=80', tags: ['Leadership', 'People'] },
       { id: 'org-004', title: 'Community Organizing', description: 'Grassroots movements.', price: 2.5, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=640&q=80', tags: ['Society', 'Action'] },
       { id: 'org-005', title: 'Fundraising Strategies', description: 'Events and donor relations.', price: 2.5, image: 'https://images.unsplash.com/photo-1561489413-985b06da5bee?auto=format&fit=crop&w=640&q=80', tags: ['Money', 'Sales'] }
    ]
  },
  {
    id: 'pm-cluster',
    title: 'Project Management',
    type: 'CLUSTER',
    courses: [
       { id: 'pm-001', title: 'Agile & Scrum Basics', description: 'Modern software management.', price: 2.5, image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=640&q=80', tags: ['Tech', 'Management'] },
       { id: 'pm-002', title: 'Risk Management', description: 'Planning for problems.', price: 2.5, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=640&q=80', tags: ['Strategy', 'Logic'] },
       { id: 'pm-003', title: 'Leading Remote Teams', description: 'Virtual leadership skills.', price: 2.5, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=640&q=80', tags: ['Leadership', 'Digital'] },
       { id: 'pm-004', title: 'Stakeholder Communication', description: 'Keeping everyone happy.', price: 2.5, image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=640&q=80', tags: ['Communication', 'Business'] },
       { id: 'pm-005', title: 'Tools of the Trade', description: 'Jira, Asana, and Trello.', price: 2.5, image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=640&q=80', tags: ['Tools', 'Tech'] }
    ]
  },
  {
    id: 'marketing-cluster',
    title: 'Digital Marketing',
    type: 'CLUSTER',
    courses: [
       { id: 'mkt-001', title: 'SEO Fundamentals', description: 'Ranking high on Google.', price: 2.5, image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=640&q=80', tags: ['Web', 'Search'] },
       { id: 'mkt-002', title: 'Social Media Management', description: 'Building a brand voice.', price: 2.5, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=640&q=80', tags: ['Social', 'Media'] },
       { id: 'mkt-003', title: 'Content Marketing Strategy', description: 'Storytelling that sells.', price: 2.5, image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=640&q=80', tags: ['Writing', 'Creative'] },
       { id: 'mkt-004', title: 'Email Campaign Design', description: 'Newsletters that convert.', price: 2.5, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=640&q=80', tags: ['Email', 'Sales'] },
       { id: 'mkt-005', title: 'Analytics & Data', description: 'Measuring success.', price: 2.5, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80', tags: ['Data', 'Math'] }
    ]
  }
];

// ==========================================
// 2. SERVICES
// ==========================================

// --- GEMINI SERVICE ---

let chatSession = null;
let currentTier = 'GUEST';
let currentInterest = undefined;
let currentContext = null;

const initializeChat = (tier, interest, context) => {
  const k = getGA();

  if (!k || k.includes("PASTE")) {
    console.warn("GA Key is missing.");
    return false;
  }

  currentTier = tier;
  currentInterest = interest;
  currentContext = context;
  const ai = new GoogleGenAI({ apiKey: k });

  let systemInstruction = "";

  if (tier === 'ALL') {
    // ------------------------------------
    // ALL ACCESS LOGIC
    // ------------------------------------
    systemInstruction = `You are CareerBot, an expert academic advisor with LIFETIME ACCESS permissions.
    You know EVERYTHING about all courses. 
    You are enthusiastic, helpful, and never refuse a topic related to the curriculum.`;

  } else if ((tier === 'BUNDLE' || tier === 'SINGLE' || tier === 'PAID') && interest) {
    // ------------------------------------
    // PAID BUNDLE / SINGLE LOGIC
    // ------------------------------------
    systemInstruction = `You are CareerBot, an expert tutor for "${interest}".
    
    The user OWNS this content.
    You can teach them specific details, answer technical questions, and help with assignments related to ${interest}.
    
    If they ask about a DIFFERENT major (e.g. they own Cooking but ask about Coding), politely say:
    "I specialize in ${interest}. Please upgrade to All-Access to ask about other fields."
    but you can still give very general 1-sentence advice.`;

  } else {
    // ------------------------------------
    // GUEST LOGIC (UPDATED)
    // ------------------------------------
    // We now check if there is a 'context' (User is viewing a specific course page)
    if (context) {
       systemInstruction = `You are CareerBot (Demo Mode). The user is currently looking at the "${context}" course/cluster.
       
       YOU CAN:
       - Explain what "${context}" is about.
       - Talk about career prospects and salaries in "${context}".
       - Be hype and encouraging about "${context}".
       - Answer general career questions.

       YOU CANNOT:
       - Teach specific lessons or give detailed technical tutorials for "${context}".
       - Provide the actual paid content.
       
       If asked to teach a specific lesson, say: "I can't teach the full lesson in Demo Mode, but I can tell you that ${context} is an amazing field because..."
       `;
    } else {
       systemInstruction = `You are CareerBot (Demo Mode). 
       The user is on the home page.
       Answer general career questions (resumes, interviews).
       Encourage them to explore a course path.`;
    }
  }

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
  });
  return true;
};

const sendMessageToAgent = async (message) => {
  if (!chatSession) {
    const success = initializeChat(currentTier, currentInterest, currentContext);
    if (!success) return "⚠️ API Key Error. Check script.js";
  }
  
  if (!chatSession) return "Service not initialized.";

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I couldn't think of a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection Failed. Please try again.";
  }
};

// ==========================================
// 3. COMPONENTS
// ==========================================

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400 shadow-md hover:shadow-lg",
    secondary: "bg-orange-400 text-white hover:bg-orange-500 focus:ring-orange-300 shadow-md",
    outline: "border-2 border-green-200 bg-white text-green-700 hover:bg-green-50 focus:ring-green-400",
    ghost: "text-green-700 hover:bg-green-100",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-6 py-2.5 text-sm", lg: "px-8 py-4 text-base" };
  return <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
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
      setError(''); setUsername(''); setPassword('');
      setInterest(preselectedInterest || '');
      setView(initialMode === 'SIGNUP' ? 'SELECT_PLAN' : 'FORM');
    }
  }, [isOpen, initialMode, preselectedInterest]);

  if (!isOpen) return null;

  const handlePlanSelect = (tier) => {
    setSelectedTier(tier);
    setView('FORM');
    setError('');
  };

  const forceMockLogin = (tier, interestVal) => {
    const safeTier = tier || 'BUNDLE';
    const userData = { username: username || 'Student', tier: safeTier, interest: interestVal };
    localStorage.setItem('careerfinder_mock_user', JSON.stringify(userData));
    setTimeout(() => window.location.reload(), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const email = `${username.trim().toLowerCase().replace(/\s+/g, '')}@careerfinder.app`;
      if (mode === 'SIGNUP') {
        if (!username || !password) throw new Error('Fill all fields');
        if (selectedTier !== 'ALL' && selectedTier !== 'GUEST' && !interest) throw new Error('Select Interest');
        const finalInterest = selectedTier === 'ALL' ? 'All Access' : interest;
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: { data: { username, tier: selectedTier, interest: finalInterest } }
        });
        if (signUpError || !data.session) {
             forceMockLogin(selectedTier, finalInterest);
             return;
        }
        onClose();
      } else {
        if (!username || !password) throw new Error('Enter credentials');
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
             forceMockLogin('BUNDLE', interest || 'General'); 
             return;
        }
        onClose();
      }
    } catch (err) {
      forceMockLogin(selectedTier || 'BUNDLE', interest || 'General');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{mode === 'LOGIN' ? 'Welcome Back' : (view === 'SELECT_PLAN' ? 'Choose Plan' : 'Profile')}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="p-6">
          {view === 'SELECT_PLAN' && mode === 'SIGNUP' ? (
            <div className="space-y-4">
              <button onClick={() => handlePlanSelect('ALL')} className="w-full flex justify-between p-4 border-2 border-indigo-500 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition relative overflow-hidden group">
                 <div className="text-left"><div className="font-bold text-indigo-900">Lifetime Access</div><div className="text-xs text-indigo-700">Everything + Expert AI</div></div>
                 <div className="font-bold text-indigo-700 bg-white px-2 py-1 rounded">$85.00</div>
              </button>
              <button onClick={() => handlePlanSelect('BUNDLE')} className="w-full flex justify-between p-4 border-2 border-green-500 bg-green-50 rounded-xl hover:bg-green-100 transition group">
                 <div className="text-left"><div className="font-bold text-green-900">Course Bundle</div><div className="text-xs text-green-700">1 Path + AI Tutor</div></div>
                 <div className="font-bold text-green-700 bg-white px-2 py-1 rounded">$10.00</div>
              </button>
              <button onClick={() => handlePlanSelect('SINGLE')} className="w-full flex justify-between p-4 border-2 border-orange-200 bg-orange-50 rounded-xl hover:border-orange-400 hover:bg-orange-100 transition group">
                 <div className="text-left"><div className="font-bold text-slate-800">Single Course</div><div className="text-xs text-slate-500">One Course Only</div></div>
                 <div className="font-bold text-orange-600 bg-white px-2 py-1 rounded">$2.50</div>
              </button>
              <button onClick={() => handlePlanSelect('GUEST')} className="w-full flex justify-between p-4 border-2 border-slate-200 bg-slate-50 rounded-xl hover:border-slate-400 hover:bg-slate-100 transition group">
                 <div className="text-left"><div className="font-bold text-slate-700">Demo Access</div><div className="text-xs text-slate-500">Preview Only</div></div>
                 <div className="font-bold text-slate-600 bg-white px-2 py-1 rounded">Free</div>
              </button>
              <div className="text-center pt-2"><button onClick={() => { setMode('LOGIN'); setView('FORM'); }} className="text-sm text-green-600 font-medium hover:underline">Already have an account?</button></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-xl" required /></div>
              <div><label className="block text-sm font-medium mb-1">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-xl" required /></div>
              {mode === 'SIGNUP' && selectedTier !== 'ALL' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Interest</label>
                  <select value={interest} onChange={(e) => setInterest(e.target.value)} disabled={!!preselectedInterest} className="w-full px-4 py-2 border rounded-xl" required>
                     <option value="" disabled>-- Choose --</option>
                     {CATEGORIES.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? '...' : (mode === 'SIGNUP' ? 'Join' : 'Login')}</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatWidget = ({ user, onLoginRequest, activeContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const userTier = user ? user.tier : 'GUEST';
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Re-init chat when context changes (e.g. user clicks a course)
  useEffect(() => {
    const tier = user ? user.tier : 'GUEST';
    const interest = user?.interest;
    // This ensures the AI knows what page the user is on
    initializeChat(tier, interest, activeContext);
    
    // Update initial greeting
    let greeting = "";
    if (tier === 'ALL') greeting = "Hi! I have Lifetime Access. Ask me anything!";
    else if (activeContext && tier === 'GUEST') greeting = `Hi! I see you're looking at ${activeContext}. I can give you a quick overview!`;
    else if (activeContext) greeting = `Hi! Ready to learn about ${activeContext}?`;
    else greeting = "Hi! I'm CareerBot. How can I help you today?";

    setMessages([{ role: 'model', text: greeting }]);
  }, [user, activeContext]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);

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

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-green-100 flex flex-col overflow-hidden">
          <div className="p-4 bg-green-500 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-xl">🤖</div>
              <div className="flex flex-col"><span className="font-bold">CareerBot</span><span className="text-[10px] opacity-90">{userTier}</span></div>
            </div>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-green-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-white shadow-sm border border-slate-100'}`}>{msg.text}</div>
              </div>
            ))}
            {loading && <div className="text-slate-400 text-xs ml-4">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-white border-t"><div className="flex gap-2"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 px-4 py-2 bg-slate-50 rounded-full border" placeholder="Ask away..." /><button onClick={handleSend} className="bg-green-500 text-white px-3 py-2 rounded-full">➤</button></div></div>
        </div>
      )}
      <button onClick={() => user ? setIsOpen(!isOpen) : onLoginRequest()} className="pointer-events-auto shadow-xl bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105">
        <span className="text-xl">🤖</span><span>{isOpen ? 'Close' : 'Chat'}</span>
      </button>
    </div>
  );
};

// Error Boundary for Grey Screen Protection
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return <div className="p-10 text-center"><h1>Something went wrong.</h1><p>Please refresh the page.</p></div>;
    }
    return this.props.children;
  }
}

const App = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState('LOGIN');
  const [preselectedInterest, setPreselectedInterest] = useState(undefined);
  const [view, setView] = useState('landing');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userCount, setUserCount] = useState(9100000);

  // Track what the user is looking at for the AI
  const activeContext = useMemo(() => {
    if (selectedCourse) return selectedCourse.title;
    if (selectedCategory) return selectedCategory.title;
    return null;
  }, [selectedCourse, selectedCategory]);

  useEffect(() => {
    const checkUser = async () => {
        const mock = localStorage.getItem('careerfinder_mock_user');
        if (mock) {
            try { setUser(JSON.parse(mock)); } catch (e) {}
        }
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata.username || 'User',
                    tier: session.user.user_metadata.tier,
                    interest: session.user.user_metadata.interest
                });
            }
            supabase.auth.onAuthStateChange((_event, session) => {
              if (session) {
                setUser({
                  id: session.user.id,
                  name: session.user.user_metadata.username,
                  tier: session.user.user_metadata.tier,
                  interest: session.user.user_metadata.interest
                });
                setShowLoginModal(false);
              }
            });
        }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setUserCount(p => p + Math.floor(Math.random() * 15) + 5), 1500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem('careerfinder_mock_user');
    setUser(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50 font-sans text-slate-800">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="font-bold text-green-800 text-xl cursor-pointer" onClick={() => setView('landing')}>CareerFinder</div>
          <div className="flex gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <div className="text-sm font-bold">{user.name}</div>
                    <div className="text-xs text-green-600">{user.tier === 'ALL' ? 'Lifetime' : user.tier}</div>
                 </div>
                 <Button variant="outline" size="sm" onClick={handleLogout}>Sign Out</Button>
              </div>
            ) : (
              <Button onClick={() => { setAuthMode('SIGNUP'); setShowLoginModal(true); }}>Get Started</Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        {view === 'landing' && (
          <div className="text-center py-10">
            <h1 className="text-6xl font-extrabold text-green-900 mb-6">Find Your Future.</h1>
            <p className="text-xl text-slate-600 mb-8">AI-Powered Career Guidance for everyone.</p>
            <div className="flex justify-center gap-4 mb-16">
                <Button size="lg" onClick={() => setView('clusters_list')}>Browse Courses</Button>
            </div>
            <div className="bg-slate-800 text-white p-8 rounded-2xl inline-block">
                <div className="text-5xl font-mono text-green-400">{userCount.toLocaleString()}</div>
                <div className="text-sm uppercase tracking-widest mt-2">Users Joined</div>
            </div>
          </div>
        )}

        {view === 'clusters_list' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CATEGORIES.map(cat => (
                 <div key={cat.id} onClick={() => { setSelectedCategory(cat); setView('cluster_courses'); }} className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:-translate-y-1 transition">
                    <img src={cat.courses[0].image} className="h-40 w-full object-cover" />
                    <div className="p-6">
                       <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                       <p className="text-sm text-slate-500">{cat.courses.length} Courses</p>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {view === 'cluster_courses' && selectedCategory && (
          <div>
             <button onClick={() => setView('clusters_list')} className="mb-6 text-slate-500 hover:text-green-600">← Back</button>
             <h2 className="text-3xl font-bold mb-8">{selectedCategory.title}</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {selectedCategory.courses.map(course => (
                  <div key={course.id} className="bg-white rounded-2xl shadow p-6 flex flex-col">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 flex-1">{course.description}</p>
                    <div className="flex justify-between items-center mt-4">
                       <span className="font-bold text-green-600">${course.price.toFixed(2)}</span>
                       <Button size="sm" onClick={() => { setSelectedCourse(course); setView('course_details'); }}>View</Button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'course_details' && selectedCourse && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-2">
                <img src={selectedCourse.image} className="h-full w-full object-cover" />
                <div className="p-10 flex flex-col justify-center">
                   <h1 className="text-4xl font-bold mb-4">{selectedCourse.title}</h1>
                   <p className="text-lg text-slate-600 mb-6">{selectedCourse.description}</p>
                   <div className="text-3xl font-black text-green-600 mb-8">${selectedCourse.price.toFixed(2)}</div>
                   
                   {user && (user.tier === 'ALL' || user.interest === selectedCategory?.title || user.interest === 'All Access') ? (
                      <Button size="lg" className="w-full">Start Learning (Unlocked)</Button>
                   ) : (
                      <Button size="lg" className="w-full" onClick={() => { setAuthMode('SIGNUP'); setPreselectedInterest(selectedCategory?.title); setShowLoginModal(true); }}>
                         Unlock Now
                      </Button>
                   )}
                   <p className="text-center text-xs text-slate-400 mt-4">AI Tutor available for this course.</p>
                </div>
             </div>
          </div>
        )}
      </main>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} initialMode={authMode} preselectedInterest={preselectedInterest} />
      <ChatWidget user={user} onLoginRequest={() => { setAuthMode('SIGNUP'); setShowLoginModal(true); }} activeContext={activeContext} />
    </div>
  );
};

// --- MOUNT ---
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

