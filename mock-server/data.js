// ===== SITE DATA MATCHING NEW FRONTEND CONTRACTS =====

export const siteInfo = {
  name: "Coding Club SATI",
  email: "codingclub@sati.edu",
  phone: "+91 9876543210",
  tagline: "Beyond Classrooms, Into Innovation",
  description: "A futuristic community of developers, innovators, cybersecurity enthusiasts, and tech learners building impactful solutions beyond classrooms.",
  socials: {
    github: "https://github.com/codingclubsati",
    linkedin: "https://linkedin.com/company/codingclubsati",
    instagram: "https://instagram.com/codingclubsati",
    discord: "https://discord.com",
    x: "https://x.com/codingclubsati",
    youtube: "https://youtube.com/codingclubsati",
  }
};

export const publicStats = {
  activeMembers: 142,
  totalEvents: 45,
  studentProjects: 24,
  workshops: 12
};

export const adminStats = {
  totalEvents: 45,
  totalProjects: 24,
  newContactMessages: 3,
  totalMembers: 142
};

export const updates = [
  { id: 1, publishDate: "2026-07-29T10:00:00Z", message: "CodeSprint 2026 registration is now live! Check the Events page." },
  { id: 2, publishDate: "2026-07-25T14:30:00Z", message: "New learning roadmaps have been added to the Learning Hub." }
];

export const events = [
  {
    id: "e1",
    title: "CodeSprint 2026",
    type: "Hackathon",
    status: "upcoming",
    featured: true,
    date: "August 15, 2026",
    time: "10:00 AM",
    venue: "Main Auditorium, SATI",
    description: "A 48-hour hackathon where teams compete to build innovative solutions for real-world problems.",
    tags: ["Hackathon", "Team Event", "Cash Prize"],
    registrationLink: "https://forms.gle/example",
    bannerUrl: null,
    viewCount: 156,
    registerClickCount: 42,
    archived: false
  },
  {
    id: "e2",
    title: "Web Dev Bootcamp",
    type: "Workshop",
    status: "upcoming",
    featured: false,
    date: "July 28, 2025",
    time: "11:00 AM",
    venue: "Computer Lab 2, SATI",
    description: "Hands-on workshop covering HTML, CSS, React, and deployment. From zero to deployed website in one day.",
    tags: ["Workshop", "Web Dev", "Beginner Friendly"], registrationLink: "#",
    bannerUrl: null,
    viewCount: 89,
    registerClickCount: 12,
    archived: false
  },
  {
    id: "e3", title: "DSA Championship", type: "Competition", status: "upcoming", featured: false,
    date: "August 5, 2025", time: "2:00 PM", venue: "Computer Lab 1, SATI",
    description: "Test your data structures and algorithms knowledge in this competitive programming challenge on Codeforces.",
    tags: ["Competition", "DSA", "Individual"], registrationLink: "#", bannerUrl: null, viewCount: 200, registerClickCount: 85, archived: false
  },
  {
    id: "e4", title: "Introduction to Computer Science", type: "Seminar", status: "completed", featured: true,
    date: "May 10, 2024", time: "11:00 AM", venue: "Seminar Hall, SATI",
    description: "A comprehensive introduction to programming concepts, algorithms, and computational thinking for first-year students.",
    tags: ["Seminar", "Beginner", "CS Fundamentals"], registrationLink: "", bannerUrl: null, viewCount: 340, registerClickCount: 0, archived: false
  }
];

export const gallery = [
  {
    id: "g1", title: "CodeSprint 2024", date: "August 2024", cover: null, imageCount: 8,
    images: Array(8).fill(null).map((_, i) => ({ id: `img1_${i}`, src: null, caption: `CodeSprint moment ${i + 1}`, featured: i === 0 }))
  },
  {
    id: "g2", title: "Web Dev Bootcamp", date: "July 2024", cover: null, imageCount: 6,
    images: Array(6).fill(null).map((_, i) => ({ id: `img2_${i}`, src: null, caption: `Bootcamp session ${i + 1}`, featured: false }))
  },
  {
    id: "g3", title: "AI/ML Seminar", date: "March 2024", cover: null, imageCount: 6,
    images: Array(6).fill(null).map((_, i) => ({ id: `img3_${i}`, src: null, caption: `AI Seminar ${i + 1}`, featured: false }))
  }
];

export const projects = [
  { id: "p1", title: "Campus Nav App", team: "Team Voyager", members: 4, tech: ["React Native", "Node.js"], description: "Indoor navigation app for SATI campus using BLE beacons.", stars: 47, forks: 12, github: "#", demo: "#", category: "Mobile App", achieved: true },
  { id: "p2", title: "EduBot AI", team: "Team Neural", members: 3, tech: ["Python", "OpenAI", "FastAPI"], description: "AI-powered study assistant that answers questions from RGPV syllabus.", stars: 89, forks: 23, github: "#", demo: "#", category: "AI/ML", achieved: true },
  { id: "p3", title: "CampusConnect", team: "Team Matrix", members: 5, tech: ["MERN", "Socket.io"], description: "Real-time social platform for SATI students to share resources and connect.", stars: 63, forks: 18, github: "#", demo: "#", category: "Web App", achieved: true },
  { id: "p4", title: "Smart Attendance", team: "Team Vision", members: 3, tech: ["Python", "OpenCV", "Flask"], description: "Face recognition-based attendance system using Raspberry Pi.", stars: 55, forks: 15, github: "#", demo: "", category: "IoT/CV", achieved: false },
  { id: "p5", title: "Code Compiler IDE", team: "Team Byte", members: 4, tech: ["React", "Node.js", "Docker"], description: "Browser-based multi-language code compiler with real-time collaboration.", stars: 71, forks: 20, github: "#", demo: "#", category: "Dev Tools", achieved: false }
];

export const contacts = [
  { id: "c1", name: "John Doe", email: "john@example.com", requestType: "General Inquiry", message: "Hi, I would like to know more about the upcoming hackathon. Are first-year students allowed to participate?", status: "New", submittedAt: "2025-07-28T08:30:00Z" }
];

// ==========================================
// NORMALIZED TEAM DATA
// ==========================================

// 1. Master list of all members (Flattened from your original coreTeam, developers, mentors, etc.)
export const allMembers = [
  { id: "m1", fullName: "Arjun Sharma", specialization: "Full Stack Developer", batch: "2025", skills: ["React", "Node.js", "Python"], avatarUrl: null, socials: { github: "#", linkedin: "#", instagram: "#", x: "#" } },
  { id: "m2", fullName: "Priya Verma", specialization: "UI/UX Designer", batch: "2025", skills: ["Figma", "CSS", "JavaScript"], avatarUrl: null, socials: { github: "#", linkedin: "#", instagram: "#", x: "#" } },
  { id: "m3", fullName: "Rahul Patel", specialization: "Backend Developer", batch: "2025", skills: ["Java", "Spring", "MySQL"], avatarUrl: null, socials: { github: "#", linkedin: "#" } },
  { id: "m4", fullName: "Prof. Amit Kumar", specialization: "Assistant Professor, CS", batch: "2025", skills: ["AI", "ML", "Research"], avatarUrl: null, socials: { linkedin: "#" } },
  { id: "m5", fullName: "Prof. Sunita Joshi", specialization: "Assistant Professor, IT", batch: "2025", skills: ["Web", "Networking"], avatarUrl: null, socials: { linkedin: "#" } },
  { id: "m6", fullName: "Vikram Singh", specialization: "Frontend Developer", batch: "2025", skills: ["React", "TypeScript", "Tailwind"], avatarUrl: null, socials: { github: "#", linkedin: "#" } },
  { id: "m7", fullName: "Ananya Gupta", specialization: "Full Stack Dev", batch: "2025", skills: ["MERN", "Firebase"], avatarUrl: null, socials: { github: "#", linkedin: "#" } },
  { id: "m8", fullName: "Aditya Rao", specialization: "Software Engineer", batch: "2024", skills: ["Python", "Django", "AWS"], avatarUrl: null, socials: { github: "#", linkedin: "#" } },
  { id: "m9", fullName: "Deepika Nair", specialization: "Data Scientist", batch: "2024", skills: ["Python", "ML", "Tableau"], avatarUrl: null, socials: { github: "#", linkedin: "#" } },
  { id: "m10", fullName: "Mohit Dubey", specialization: "Full Stack Dev", batch: "2024", skills: ["Vue.js", "Laravel", "MySQL"], avatarUrl: null, socials: { github: "#", linkedin: "#" } },
];

// 2. Relational mapping linking roles to member IDs
export let leadershipMapping = {
  convenors: ["m4", "m5"],
  coConvenors: ["m1", "m2"],
  departmentHeads: {
    "Technical": "m6",
    "Design": "m7"
  }
};