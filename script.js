
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const _k = [
  'A','I','z','a','S','y','D','T','c','F','J','A','5','c','L','F','e','I','f','b',
  'j','M','4','L','u','p','5','4','C','Y','V','h','G','G','Y','U','a','3','Q'
];
const HIDDEN_KEY = _k.join('');

const getApiKey = () => HIDDEN_KEY;

const supabaseUrl = 'https://bwjjfnkuqnravvfytxbf.supabase.co';
const supabaseKey = 'sb_publishable_9z5mRwy-X0zERNX7twZzPw_RdskfL8s';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// DATA & CONSTANTS
// ==========================================

const UserTier = {
  GUEST: 'GUEST',
  PAID: 'PAID',
  BUNDLE: 'BUNDLE',
  SINGLE: 'SINGLE'
};

const CATEGORIES = [
  {
    id: 'career-soft-skills',
    title: 'The Career Pivot & Soft Skills',
    type: 'CLUSTER',
    courses: [
      {
        id: 'soft-001',
        title: 'Resume & LinkedIn Magic',
        description: 'How to write a resume that beats the bots and gets you hired.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=640&q=80',
        tags: ['Career', 'Writing']
      },
      {
        id: 'soft-002',
        title: 'Mastering the Interview',
        description: 'Behavioral answers, salary negotiation, and body language.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=640&q=80',
        tags: ['Talk', 'Money']
      },
      {
        id: 'soft-003',
        title: 'Emotional Intelligence (EQ)',
        description: 'Reading people and managing workplace relationships.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&q=80',
        tags: ['Mind', 'People']
      },
      {
        id: 'soft-004',
        title: 'Networking for Introverts',
        description: 'How to build connections without feeling fake.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1515169067750-d51a73b55163?auto=format&fit=crop&w=640&q=80',
        tags: ['Social', 'Connections']
      },
      {
        id: 'soft-005',
        title: 'Productivity & Focus',
        description: 'Deep work strategies for the distracted age.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1499750310159-5254f4127278?auto=format&fit=crop&w=640&q=80',
        tags: ['Habits', 'Growth']
      }
    ]
  },
  {
    id: 'law-cluster',
    title: 'Law & Legal Studies',
    type: 'CLUSTER',
    courses: [
      {
        id: 'law-001',
        title: 'Introduction to Torts',
        description: 'Understanding civil wrongs and personal injury law basics.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=640&q=80',
        tags: ['Legal', 'Justice']
      },
      {
        id: 'law-002',
        title: 'Criminal Law 101',
        description: 'From misdemeanors to felonies: how the penal system works.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=640&q=80',
        tags: ['Crime', 'Justice']
      },
      {
        id: 'law-003',
        title: 'Corporate Law Basics',
        description: 'Contracts, mergers, and protecting intellectual property.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=640&q=80',
        tags: ['Business', 'Money']
      },
      {
        id: 'law-004',
        title: 'Constitutional Rights',
        description: 'Know your rights: Free speech, privacy, and due process.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=80',
        tags: ['History', 'Gov']
      },
      {
        id: 'law-005',
        title: 'LSAT Prep Crash Course',
        description: 'Logic games and reading comprehension strategies.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=640&q=80',
        tags: ['Study', 'Logic']
      }
    ]
  },
  {
    id: 'eng-cluster',
    title: 'Engineering & Robotics',
    type: 'CLUSTER',
    courses: [
      {
        id: 'eng-001',
        title: 'Mechanical Design',
        description: 'Gears, levers, and CAD: Building things that move.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1537462713505-a111002572f4?auto=format&fit=crop&w=640&q=80',
        tags: ['Math', 'Build']
      },
      {
        id: 'eng-002',
        title: 'Circuit Theory',
        description: 'Voltage, current, and resistance explained simply.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=640&q=80',
        tags: ['Tech', 'Science']
      },
      {
        id: 'eng-003',
        title: 'Civil Engineering',
        description: 'Bridges, roads, and skyscrapers: How they stand up.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=640&q=80',
        tags: ['Build', 'City']
      },
      {
        id: 'eng-004',
        title: 'Arduino Robotics',
        description: 'Programming microcontrollers to control motors and sensors.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=640&q=80',
        tags: ['Code', 'Robots']
      },
      {
        id: 'eng-005',
        title: 'Aerospace Fundamentals',
        description: 'The physics of flight and rocket propulsion.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=640&q=80',
        tags: ['Space', 'Physics']
      }
    ]
  },
  {
    id: 'health-cluster',
    title: 'Healthcare & Medicine',
    type: 'CLUSTER',
    courses: [
      {
        id: 'med-001',
        title: 'Anatomy 101',
        description: 'Muscles, bones, and organs: The map of the body.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=640&q=80',
        tags: ['Science', 'Body']
      },
      {
        id: 'med-002',
        title: 'Medical Terminology',
        description: 'Learning the language of doctors and nurses.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1584036561566-b93cae3658cd?auto=format&fit=crop&w=640&q=80',
        tags: ['Language', 'Work']
      },
      {
        id: 'med-003',
        title: 'First Aid & CPR',
        description: 'Lifesaving skills everyone should know.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=640&q=80',
        tags: ['Safety', 'Help']
      },
      {
        id: 'med-004',
        title: 'Mental Health Basics',
        description: 'Understanding anxiety, depression, and therapy.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1527137342181-191fe16c5905?auto=format&fit=crop&w=640&q=80',
        tags: ['Mind', 'Care']
      },
      {
        id: 'med-005',
        title: 'Nutrition Science',
        description: 'Macros, micros, and how food fuels the body.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=640&q=80',
        tags: ['Food', 'Health']
      }
    ]
  },
  {
    id: 'trades-cluster',
    title: 'Skilled Trades',
    type: 'CLUSTER',
    courses: [
      {
        id: 'trd-001',
        title: 'Residential Electrical',
        description: 'Wiring outlets, switches, and breaker panels safely.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=640&q=80',
        tags: ['Hands-on', 'Power']
      },
      {
        id: 'trd-002',
        title: 'Modern Plumbing',
        description: 'Pipes, fittings, and fixing common household leaks.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=640&q=80',
        tags: ['Water', 'Fix']
      },
      {
        id: 'trd-003',
        title: 'Carpentry Basics',
        description: 'Framing, measuring, and working with wood.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=640&q=80',
        tags: ['Wood', 'Build']
      },
      {
        id: 'trd-004',
        title: 'HVAC Fundamentals',
        description: 'Heating, ventilation, and air conditioning systems.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&w=640&q=80',
        tags: ['Air', 'Tech']
      },
      {
        id: 'trd-005',
        title: 'Welding Introduction',
        description: 'MIG, TIG, and Stick welding safety and technique.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=640&q=80',
        tags: ['Metal', 'Fire']
      }
    ]
  },
  {
    id: 'board-game-design',
    title: 'Board Game Design & Gamification',
    type: 'CLUSTER',
    courses: [
      {
        id: 'game-001',
        title: 'Mechanics & Dynamics',
        description: 'Understanding rules, player interaction, and balance.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1610890716171-6b1c9f20ad82?auto=format&fit=crop&w=640&q=80',
        tags: ['Design', 'Logic']
      },
      {
        id: 'game-002',
        title: 'Rapid Prototyping',
        description: 'From paper sketches to playable test kits.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=640&q=80',
        tags: ['Creative', 'Art']
      },
      {
        id: 'game-003',
        title: 'The Psychology of Play',
        description: 'Why we play and how to create "Fun".',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1500995617113-cf789362a3e1?auto=format&fit=crop&w=640&q=80',
        tags: ['Mind', 'Fun']
      },
      {
        id: 'game-004',
        title: 'Kickstarter Success',
        description: 'Marketing and funding your tabletop game.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=640&q=80',
        tags: ['Business', 'Money']
      },
      {
        id: 'game-005',
        title: 'Writing Rulebooks',
        description: 'Technical writing that players can actually understand.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=640&q=80',
        tags: ['Writing', 'Technical']
      }
    ]
  },
  {
    id: 'non-profit',
    title: 'Non-Profit & Youth Leadership',
    type: 'CLUSTER',
    courses: [
      {
        id: 'npo-001',
        title: 'Starting a Non-Profit',
        description: 'Legal structures, mission statements, and 501(c)(3) basics.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=640&q=80',
        tags: ['Service', 'Legal']
      },
      {
        id: 'npo-002',
        title: 'Grant Writing 101',
        description: 'How to secure funding for your cause.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=80',
        tags: ['Writing', 'Money']
      },
      {
        id: 'npo-003',
        title: 'Volunteer Management',
        description: 'Recruiting, training, and retaining great people.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=640&q=80',
        tags: ['People', 'Leadership']
      },
      {
        id: 'npo-004',
        title: 'Community Outreach',
        description: 'Building partnerships and public relations.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=640&q=80',
        tags: ['Social', 'Events']
      },
      {
        id: 'npo-005',
        title: 'Mentorship Skills',
        description: 'How to guide and inspire the next generation.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=640&q=80',
        tags: ['Teaching', 'Kids']
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
        description: 'Modern workflows for tech and creative teams.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=640&q=80',
        tags: ['Management', 'Tech']
      },
      {
        id: 'pm-002',
        title: 'Risk Management',
        description: 'Identifying and mitigating problems before they happen.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=640&q=80',
        tags: ['Logic', 'Planning']
      },
      {
        id: 'pm-003',
        title: 'Stakeholder Communication',
        description: 'Keeping bosses, clients, and teams happy.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=640&q=80',
        tags: ['Talk', 'Business']
      },
      {
        id: 'pm-004',
        title: 'Budgeting & Resource Allocation',
        description: 'Managing money and time effectively.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1554224155-98406858d0ade?auto=format&fit=crop&w=640&q=80',
        tags: ['Math', 'Money']
      },
      {
        id: 'pm-005',
        title: 'Remote Team Leadership',
        description: 'Managing productivity across different time zones.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=640&q=80',
        tags: ['Leadership', 'Digital']
      }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    type: 'CLUSTER',
    courses: [
      {
        id: 'mkt-001',
        title: 'Social Media Strategy',
        description: 'Growing an audience on TikTok, IG, and YouTube.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=640&q=80',
        tags: ['Social', 'Creative']
      },
      {
        id: 'mkt-002',
        title: 'SEO Fundamentals',
        description: 'Getting your website to the top of Google Search.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=640&q=80',
        tags: ['Tech', 'Writing']
      },
      {
        id: 'mkt-003',
        title: 'Content Marketing',
        description: 'Storytelling that converts readers into buyers.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1499750310159-5254f4127278?auto=format&fit=crop&w=640&q=80',
        tags: ['Writing', 'Sales']
      },
      {
        id: 'mkt-004',
        title: 'Email Marketing Automation',
        description: 'Building funnels and newsletters that sell.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1563986768494-4dee46a38531?auto=format&fit=crop&w=640&q=80',
        tags: ['Tech', 'Business']
      },
      {
        id: 'mkt-005',
        title: 'Analytics & Data',
        description: 'Reading the numbers to optimize performance.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80',
        tags: ['Math', 'Logic']
      }
    ]
  },
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
        title: 'Corporate Management',
        description: 'Leading teams and navigating the corporate ladder.',
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=640&q=80',
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
  }
];

// ==========================================
// SERVICES & AI INTEGRATION
// ==========================================

let chatSession = null;
let currentTier = UserTier.GUEST;
let currentInterest = undefined;

const initializeChat = (tier, interest) => {
  const apiKey = getApiKey();
  if (!apiKey) return false;

  currentTier = tier;
  currentInterest = interest;
  const ai = new GoogleGenAI({ apiKey });

  let systemInstruction = "";

  const isPaid = tier === UserTier.BUNDLE || tier === UserTier.SINGLE || tier === UserTier.PAID;

  if (isPaid && interest) {
    const cluster = CATEGORIES.find(c => c.title === interest);
    if (cluster) {
      const curriculum = cluster.courses.map(c => 
        `- Course Title: "${c.title}"\n  Description: ${c.description}\n  Topics/Tags: ${c.tags.join(', ')}`
      ).join('\n\n');

      systemInstruction = `You are CareerBot, an expert specialized academic advisor for the "${interest}" career path.
      You have access to the following curriculum:
      ${curriculum}
      RULES:
      1. Answer questions about "${interest}" deeply and helpfully.
      2. STRICTLY BLOCK questions about other majors.
      3. Be encouraging and use emojis.`;
    } else {
        systemInstruction = "You are CareerBot. The user has a premium account, but the course data is missing. Help them with general career advice.";
    }
  } else {
    systemInstruction = `You are CareerBot (Demo Mode).
    ALLOWED TOPICS: General career advice, Motivation.
    FORBIDDEN TOPICS: Specific technical knowledge, Course content details.`;
  }

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
  });
  return true;
};

const sendMessageToAgent = async (message) => {
  if (!chatSession) {
    const success = initializeChat(currentTier, currentInterest);
    if (!success) return "⚠️ API KEY MISSING. Please reload the page.";
  }
  
  if (!chatSession) return "CareerBot Error: Service not initialized.";

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I couldn't think of a response.";
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `CareerBot Connection Failed. Error: ${errorMessage}`;
  }
};

// ==========================================
// UI COMPONENT LIBRARY
// ==========================================

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400 shadow-md hover:shadow-lg",
    secondary: "bg-orange-400 text-white hover:bg-orange-500 focus:ring-orange-300 shadow-md",
    outline: "border-2 border-green-200 bg-white text-green-700 hover:bg-green-50 focus:ring-green-400",
    ghost: "text-green-700 hover:bg-green-100",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
  };

  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-6 py-2.5 text-sm", lg: "px-8 py-4 text-base" };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}>
        {children}
    </div>
);

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
      setInterest(preselectedInterest || '');
      setView(initialMode === 'SIGNUP' ? 'SELECT_PLAN' : 'FORM');
    }
  }, [isOpen, initialMode, preselectedInterest]);

  if (!isOpen) return null;

  const handlePlanSelect = (tier) => {
    setSelectedTier(tier);
    setView('FORM');
  };

  const generateEmail = (user) => `${user.trim().toLowerCase().replace(/\s+/g, '')}@careerfinder.app`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const generatedEmail = generateEmail(username);
      if (mode === 'SIGNUP') {
        if (!username.trim() || !password.trim()) throw new Error('Please fill in all fields.');
        if (!interest) throw new Error('Please select an Interest.');
        const { error: signUpError } = await supabase.auth.signUp({
          email: generatedEmail,
          password,
          options: { data: { username, tier: selectedTier, interest } }
        });
        if (signUpError) throw new Error(signUpError.message);
        onClose();
      } else {
        if (!username.trim() || !password.trim()) throw new Error('Please enter username and password.');
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: generatedEmail, password });
        if (signInError) throw new Error("Login failed.");
        onClose();
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN';
    setMode(newMode);
    setView(newMode === 'SIGNUP' ? 'SELECT_PLAN' : 'FORM');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{mode === 'LOGIN' ? 'Welcome Back' : (view === 'SELECT_PLAN' ? 'Choose Your Path' : 'Create Profile')}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="p-6">
          {view === 'SELECT_PLAN' && mode === 'SIGNUP' ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <button onClick={() => handlePlanSelect('BUNDLE')} className="w-full flex items-center justify-between p-5 border-2 border-green-500 bg-green-50 rounded-xl hover:bg-green-100 transition shadow-sm group">
                  <div className="text-left"><div className="font-bold text-green-900 text-lg group-hover:text-green-700">Course Bundle</div><div className="text-xs text-green-700 font-medium">Access All + AI Tutor</div></div>
                  <div className="font-bold text-green-700 bg-white px-3 py-1 rounded-lg shadow-sm">$10.00</div>
                </button>
                <button onClick={() => handlePlanSelect('SINGLE')} className="w-full flex items-center justify-between p-5 border-2 border-orange-200 bg-orange-50 rounded-xl hover:border-orange-400 hover:bg-orange-100 transition shadow-sm group">
                  <div className="text-left"><div className="font-bold text-slate-800 group-hover:text-orange-900">Single Course</div><div className="text-xs text-slate-500 group-hover:text-orange-800">Access Only One Course</div></div>
                  <div className="font-bold text-orange-600 bg-white px-3 py-1 rounded-lg shadow-sm">$2.50</div>
                </button>
                <button onClick={() => handlePlanSelect('GUEST')} className="w-full flex items-center justify-between p-5 border-2 border-slate-200 bg-slate-50 rounded-xl hover:border-slate-400 hover:bg-slate-100 transition shadow-sm group">
                  <div className="text-left"><div className="font-bold text-slate-700 group-hover:text-slate-900">Demo Access</div><div className="text-xs text-slate-500">Limited Preview</div></div>
                  <div className="font-bold text-slate-600 bg-white px-3 py-1 rounded-lg shadow-sm">Free</div>
                </button>
              </div>
              <div className="text-center pt-2"><button onClick={toggleMode} className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">Already have an account? Log In</button></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-slate-50" placeholder="FutureCEO123" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-slate-50" placeholder="••••••••" required /></div>
              {mode === 'SIGNUP' && (
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Select Bundle</label>
                  <select value={interest} onChange={(e) => setInterest(e.target.value)} disabled={!!preselectedInterest} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 bg-slate-50" required>
                       <option value="" disabled>-- Choose a Cluster --</option>
                       {CATEGORIES.map(cat => (<option key={cat.id} value={cat.title}>{cat.title}</option>))}
                  </select>
                </div>
              )}
              {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
              <div className="pt-2 flex flex-col gap-3"><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Processing...' : (mode === 'SIGNUP' ? 'Create Account' : 'Log In')}</Button>
              <div className="text-center"><button type="button" onClick={toggleMode} className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">{mode === 'SIGNUP' ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}</button></div></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatWidget = ({ user, onLoginRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const userTier = user ? user.tier : UserTier.GUEST;
  const isPaid = userTier === UserTier.BUNDLE || userTier === UserTier.SINGLE || userTier === UserTier.PAID;
  const [messages, setMessages] = useState([{ role: 'model', text: !isPaid ? "Hi! I'm CareerBot (Demo). I can answer general career questions." : "Hi! I'm CareerBot! I'm ready to help you plan your future!" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);
  useEffect(() => { const isNowPaid = userTier === UserTier.BUNDLE || userTier === UserTier.SINGLE || userTier === UserTier.PAID; setMessages([{ role: 'model', text: !isNowPaid ? "Hi! I'm CareerBot (Demo)." : "Hi! I'm CareerBot! Ask me specific questions!" }]); }, [userTier]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setLoading(true);
    const responseText = await sendMessageToAgent(input);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      {isOpen && user && (
        <div className="pointer-events-auto mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-green-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">
          <div className="p-4 bg-green-500 text-white flex justify-between items-center"><span className="font-bold">CareerBot</span><button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">✕</button></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-green-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-white text-slate-800 border border-slate-100 shadow-sm'}`}>{msg.text}</div></div>
            ))}
            {loading && <div className="text-xs text-slate-500">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask CareerBot..." className="flex-1 px-4 py-2 bg-slate-50 border-0 rounded-full focus:ring-2 focus:ring-green-500 text-sm" /><button onClick={handleSend} disabled={loading || !input.trim()} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">Send</button></div>
        </div>
      )}
      <button onClick={() => (!user ? onLoginRequest() : setIsOpen(!isOpen))} className="pointer-events-auto shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2">{isOpen && user ? 'Close' : 'Chat with CareerBot'}</button>
    </div>
  );
};

// ==========================================
// APP COMPONENT (Main)
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
  const [userCount, setUserCount] = useState(() => 9100000 + Math.floor(Math.random() * 80000));

  const questions = [
    { text: "When you visualize your ideal workday, what are you doing?", options: [{ text: "Building structure & organizing chaos", tags: ['Business', 'Logic'] }, { text: "Connecting with & leading people", tags: ['Leadership', 'People'] }, { text: "Creating something visual or auditory", tags: ['Art', 'Design'] }] },
    { text: "How do you prefer to solve complex problems?", options: [{ text: "Analyze data and follow the facts", tags: ['Math', 'Coding'] }, { text: "Collaborate and brainstorm with a team", tags: ['Teams', 'Social'] }, { text: "Experiment until something works", tags: ['Startup', 'Creative'] }] },
    { text: "Which of these feels like a superpower you want?", options: [{ text: "Unshakeable Stability & Wealth", tags: ['Money', 'Security'] }, { text: "Healing & Helping Others", tags: ['Health', 'Service'] }, { text: "Unbounded Expression", tags: ['Media', 'Art'] }] }
  ];

  const mapTier = (tier) => (tier === 'BUNDLE' ? UserTier.BUNDLE : tier === 'SINGLE' ? UserTier.SINGLE : tier === 'PAID' ? UserTier.PAID : UserTier.GUEST);

  useEffect(() => {
    const checkUser = async () => {
        const mock = localStorage.getItem('careerfinder_mock_user');
        if (mock) { try { const u = JSON.parse(mock); setUser({ id: 'mock-123', name: u.username, tier: mapTier(u.tier), interest: u.interest }); } catch (e) { localStorage.removeItem('careerfinder_mock_user'); } }
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setUser({ id: session.user.id, name: session.user.user_metadata.username || 'User', tier: mapTier(session.user.user_metadata.tier), interest: session.user.user_metadata.interest });
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) { setUser({ id: session.user.id, name: session.user.user_metadata.username || 'User', tier: mapTier(session.user.user_metadata.tier), interest: session.user.user_metadata.interest }); setShowLoginModal(false); setPreselectedInterest(undefined); localStorage.removeItem('careerfinder_mock_user'); } 
      else if (!localStorage.getItem('careerfinder_mock_user')) { setUser(null); setView('landing'); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { initializeChat(user ? user.tier : UserTier.GUEST, user?.interest); }, [user]);
  useEffect(() => { const interval = setInterval(() => { setUserCount(prev => prev + Math.floor(Math.random() * 15) + 5); }, 1500); return () => clearInterval(interval); }, []);

  const currentModules = useMemo(() => {
    if (!selectedCourse) return [];
    return [
      { title: `Introduction to ${selectedCourse.title}`, duration: "15 mins", content: <><p className="mb-4">Welcome to <strong>{selectedCourse.title}</strong>.</p><h3 className="text-xl font-bold mt-6 mb-3">Why it matters</h3><p>Master these skills to position yourself as a leader.</p></> },
      { title: "Core Principles", duration: "45 mins", content: <><p>Understanding the 'Why' behind the 'How'.</p></> },
      { title: "Tools & Techniques", duration: "60 mins", content: <><p>Industry standard tools used by professionals.</p></> },
      { title: "Advanced Strategies", duration: "90 mins", content: <><p>Critical thinking and pattern recognition.</p></> },
      { title: "Final Assessment", duration: "30 mins", content: <><p>Congratulations on reaching the final module.</p><Button onClick={() => alert("Certificate Downloaded!")}>Download Certificate</Button></> }
    ];
  }, [selectedCourse]);

  const openAuthModal = (mode, interestToSelect) => { setAuthMode(mode); setPreselectedInterest(interestToSelect); setShowLoginModal(true); };
  const handleLogout = async () => { await supabase.auth.signOut(); localStorage.removeItem('careerfinder_mock_user'); setUser(null); setView('landing'); };
  const goHome = () => { setView('landing'); setSelectedCategory(null); };
  const goToClusters = () => { setView('clusters_list'); setSelectedCategory(null); };
  const openCluster = (cat) => { setSelectedCategory(cat); setView('cluster_courses'); };
  const openCourse = (course) => { setSelectedCourse(course); setView('course_details'); };
  const startLearning = () => { setActiveModuleIndex(0); setView('learning_mode'); window.scrollTo(0, 0); };
  
  const handleQuizAnswer = (tags) => {
    const newScores = { ...quizScores };
    tags.forEach(tag => newScores[tag] = (newScores[tag] || 0) + 1);
    setQuizScores(newScores);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
    else {
        if (!selectedCategory) return;
        setQuizResult(selectedCategory.courses[0]); // Simple selection for demo
        setQuizActive(false);
        setShowQuizResult(true);
    }
  };

  const getTierLabel = (tier) => (tier === UserTier.BUNDLE ? 'Course Bundle' : tier === UserTier.SINGLE ? 'Single Course' : tier === UserTier.PAID ? 'Premium' : 'Guest Mode');

  return (
    <div className="min-h-screen flex flex-col bg-green-50 font-sans text-slate-800">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}><div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">C</div><span className="font-bold text-green-800 text-xl hidden sm:block">CareerFinder</span></div>
          <div className="flex items-center gap-4">{user ? <><span className="text-sm font-bold text-green-900">{user.name}</span><Button variant="outline" size="sm" onClick={handleLogout}>Sign Out</Button></> : <><Button variant="ghost" onClick={() => openAuthModal('LOGIN')}>Log In</Button><Button onClick={() => openAuthModal('SIGNUP')}>Get Started</Button></>}</div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10">
        {view === 'landing' && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in">
            <h1 className="text-5xl font-extrabold text-green-900 mb-8 text-center">Learn what you <span className="text-green-500">Love</span>.</h1>
            <Button size="lg" onClick={goToClusters}>Browse Course Groups</Button>
            <div className="mt-16 bg-slate-800 p-8 rounded-3xl text-center"><div className="text-5xl font-black text-green-400 mb-2">{userCount.toLocaleString()}</div><div className="text-white text-sm">Smart Winners Joined Already</div></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
               <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                 <div className="text-4xl mb-4">👑</div>
                 <h3 className="text-xl font-bold mb-2">GUARANTEED SUCCESS</h3>
                 <p className="text-green-100 text-sm">Our algorithms eliminate risk. Know your destiny with mathematical perfection.</p>
               </Card>
               <Card className="p-6 bg-gradient-to-br from-orange-400 to-amber-500 text-white border-0">
                 <div className="text-4xl mb-4">🏆</div>
                 <h3 className="text-xl font-bold mb-2">ELITE STATUS</h3>
                 <p className="text-orange-100 text-sm">Join the winners circle. Secure unlimited potential and respect.</p>
               </Card>
               <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                 <div className="text-4xl mb-4">⚡</div>
                 <h3 className="text-xl font-bold mb-2">INSTANT MASTERY</h3>
                 <p className="text-blue-100 text-sm">Unlock genius level insight in seconds. It's almost magic.</p>
               </Card>
            </div>
          </div>
        )}

        {view === 'clusters_list' && (
           <div className="animate-in fade-in">
             <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">Course Groups</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {CATEGORIES.map((category) => (
                   <Card key={category.id} className="cursor-pointer group">
                     <div onClick={() => openCluster(category)}>
                        <div className="h-44 bg-slate-200"><img src={category.courses[0]?.image} className="w-full h-full object-cover" /></div>
                        <div className="p-6"><h3 className="text-xl font-bold text-slate-800 mb-2">{category.title}</h3><p className="text-slate-500 text-sm">{category.courses.length} Courses</p></div>
                     </div>
                   </Card>
                ))}
             </div>
           </div>
        )}

        {view === 'cluster_courses' && selectedCategory && (
          <div className="animate-in fade-in">
             <button onClick={goToClusters} className="mb-6 text-slate-500 hover:text-green-600">← Back to Groups</button>
             <div className="flex justify-between items-end mb-8 border-b border-green-200 pb-4">
                <h2 className="text-3xl font-bold text-green-900">{selectedCategory.title}</h2>
                <Button variant="secondary" onClick={() => { setQuizActive(true); setShowQuizResult(false); }}>Find Your Match!</Button>
             </div>
             
             {quizActive && <div className="mb-8 p-8 bg-indigo-50 rounded-3xl border border-indigo-200 shadow-xl">
                 <h3 className="text-2xl font-bold mb-8">{questions[currentQuestion].text}</h3>
                 <div className="grid gap-4">{questions[currentQuestion].options.map((opt, idx) => <button key={idx} onClick={() => handleQuizAnswer(opt.tags)} className="p-4 bg-white rounded-xl border hover:border-indigo-400 text-left font-bold">{opt.text}</button>)}</div>
             </div>}

             {showQuizResult && quizResult && <div className="mb-8 p-6 bg-orange-100 rounded-2xl border-2 border-orange-300 relative"><button onClick={() => setShowQuizResult(false)} className="absolute top-4 right-4">✕</button><h3 className="text-2xl font-bold mb-2">Recommended: {quizResult.title}</h3><Button onClick={() => openCourse(quizResult)}>View Course</Button></div>}
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedCategory.courses.map((course) => (
                  <Card key={course.id} className="group">
                    <div className="h-48 bg-slate-200"><img src={course.image} className="w-full h-full object-cover" /></div>
                    <div className="p-6"><h3 className="text-lg font-bold mb-2">{course.title}</h3><Button onClick={() => openCourse(course)} variant="outline" className="w-full">View Details</Button></div>
                  </Card>
                ))}
             </div>
          </div>
        )}

        {view === 'course_details' && selectedCourse && (
          <div className="animate-in fade-in max-w-5xl mx-auto">
            <button onClick={() => openCluster(selectedCategory)} className="mb-6 text-slate-500 hover:text-green-600">← Back to Course List</button>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full bg-slate-200"><img src={selectedCourse.image} className="w-full h-full object-cover" /></div>
                <div className="p-12 flex flex-col justify-center">
                   <h1 className="text-4xl font-extrabold mb-6">{selectedCourse.title}</h1>
                   <p className="text-lg text-slate-600 mb-8">{selectedCourse.description}</p>
                   <div className="text-3xl font-black text-green-600 mb-8">${selectedCourse.price.toFixed(2)}</div>
                   {isUserPaid ? <Button size="lg" className="w-full" onClick={startLearning}>Start Learning Now</Button> : <Button size="lg" className="w-full" onClick={() => openAuthModal('SIGNUP', selectedCategory?.title)}>Unlock Full Access</Button>}
                </div>
            </div>
          </div>
        )}

        {view === 'learning_mode' && selectedCourse && (
          <div className="animate-in fade-in flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
             <div className="w-full lg:w-1/4">
                <button onClick={() => setView('course_details')} className="mb-6 text-slate-500">← Exit Course</button>
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                   {currentModules.map((module, idx) => (
                        <div key={idx} onClick={() => setActiveModuleIndex(idx)} className={`p-4 cursor-pointer border-l-4 ${activeModuleIndex === idx ? 'bg-indigo-50 border-indigo-500' : 'border-transparent'}`}>
                           <div className="font-bold text-sm">Module {idx + 1}</div>
                           <div className="text-xs text-slate-500">{module.title}</div>
                        </div>
                   ))}
                </div>
             </div>
             <div className="flex-1 bg-white rounded-3xl shadow-lg p-12">
                   <h1 className="text-3xl font-extrabold mb-6">{currentModules[activeModuleIndex].title}</h1>
                   <div className="prose prose-lg text-slate-600">{currentModules[activeModuleIndex].content}</div>
             </div>
          </div>
        )}
      </main>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} initialMode={authMode} preselectedInterest={preselectedInterest} />
      <ChatWidget user={user} onLoginRequest={() => openAuthModal('SIGNUP')} />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

