// ===== SITE DATA FROM SOURCE =====

const clubInfo = {
  name: "Coding Club SATI",
  tagline: "Beyond Classrooms, Into Innovation",
  description: "A futuristic community of developers, innovators, cybersecurity enthusiasts, and tech learners building impactful solutions beyond classrooms.",
  email: "codingclub@sati.edu",
  phone: "+91 9876543210",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    discord: "https://discord.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
  },
  stats: [
    { value: "500+", label: "Active Members", icon: "👥" },
    { value: "40+", label: "Events Conducted", icon: "📅" },
    { value: "20+", label: "Student Projects", icon: "</>" },
    { value: "10+", label: "Workshops", icon: "🏆" },
  ]
};

export const eventsData = [
  {
    id: 1,
    title: "CodeSprint 2025",
    type: "Hackathon",
    status: "upcoming",
    featured: true,
    date: "July 15, 2025",
    time: "10:00 AM",
    venue: "Main Auditorium, SATI",
    description: "A 48-hour hackathon where teams compete to build innovative solutions for real-world problems. Open to all branches.",
    image: null,
    tags: ["Hackathon", "Team Event", "Cash Prize"],
    registrationLink: "#"
  },
  {
    id: 2,
    title: "Web Dev Bootcamp",
    type: "Workshop",
    status: "upcoming",
    featured: false,
    date: "July 28, 2025",
    time: "11:00 AM",
    venue: "Computer Lab 2, SATI",
    description: "Hands-on workshop covering HTML, CSS, React, and deployment. From zero to deployed website in one day.",
    image: null,
    tags: ["Workshop", "Web Dev", "Beginner Friendly"],
    registrationLink: "#"
  },
  {
    id: 3,
    title: "DSA Championship",
    type: "Competition",
    status: "upcoming",
    featured: false,
    date: "August 5, 2025",
    time: "2:00 PM",
    venue: "Computer Lab 1, SATI",
    description: "Test your data structures and algorithms knowledge in this competitive programming challenge on Codeforces.",
    image: null,
    tags: ["Competition", "DSA", "Individual"],
    registrationLink: "#"
  },
  {
    id: 4,
    title: "Introduction to Computer Science",
    type: "Seminar",
    status: "completed",
    featured: true,
    date: "May 10, 2024",
    time: "11:00 AM",
    venue: "Seminar Hall, SATI",
    description: "A comprehensive introduction to programming concepts, algorithms, and computational thinking for first-year students.",
    image: null,
    tags: ["Seminar", "Beginner", "CS Fundamentals"],
    registrationLink: null
  },
  {
    id: 5,
    title: "AI/ML Tech Talk",
    type: "Seminar",
    status: "completed",
    featured: false,
    date: "March 22, 2024",
    time: "3:00 PM",
    venue: "Seminar Hall, SATI",
    description: "Industry experts shared insights on artificial intelligence and machine learning trends and real-world applications.",
    image: null,
    tags: ["Seminar", "AI/ML", "Industry Talk"],
    registrationLink: null
  },
  {
    id: 6,
    title: "Android Dev Workshop",
    type: "Workshop",
    status: "completed",
    featured: false,
    date: "February 18, 2024",
    time: "10:00 AM",
    venue: "Computer Lab 3, SATI",
    description: "Hands-on session covering Android application development using Kotlin and Android Studio basics.",
    image: null,
    tags: ["Workshop", "Android", "Mobile Dev"],
    registrationLink: null
  }
];

export const galleryData = [
  {
    id: 1,
    title: "CodeSprint 2024",
    date: "August 2024",
    cover: null,
    imageCount: 24,
    images: Array(8).fill(null).map((_, i) => ({ id: i, src: null, caption: `CodeSprint moment ${i + 1}` }))
  },
  {
    id: 2,
    title: "Web Dev Bootcamp",
    date: "July 2024",
    cover: null,
    imageCount: 18,
    images: Array(6).fill(null).map((_, i) => ({ id: i, src: null, caption: `Bootcamp session ${i + 1}` }))
  },
  {
    id: 3,
    title: "AI/ML Seminar",
    date: "March 2024",
    cover: null,
    imageCount: 15,
    images: Array(6).fill(null).map((_, i) => ({ id: i, src: null, caption: `AI Seminar ${i + 1}` }))
  },
  {
    id: 4,
    title: "Club Orientation 2024",
    date: "January 2024",
    cover: null,
    imageCount: 30,
    images: Array(8).fill(null).map((_, i) => ({ id: i, src: null, caption: `Orientation ${i + 1}` }))
  },
  {
    id: 5,
    title: "Android Workshop",
    date: "February 2024",
    cover: null,
    imageCount: 12,
    images: Array(5).fill(null).map((_, i) => ({ id: i, src: null, caption: `Android session ${i + 1}` }))
  },
  {
    id: 6,
    title: "Farewell 2024",
    date: "May 2024",
    cover: null,
    imageCount: 40,
    images: Array(8).fill(null).map((_, i) => ({ id: i, src: null, caption: `Farewell 2024 ${i + 1}` }))
  }
];

export const teamsData = {
  "2024-25": {
    coreTeam: [
      { id: 1, name: "Arjun Sharma", role: "President", designation: "Full Stack Developer", skills: ["React", "Node.js", "Python"], github: "#", linkedin: "#", instagram: "#", twitter: "#", image: null },
      { id: 2, name: "Priya Verma", role: "Vice President", designation: "UI/UX Designer", skills: ["Figma", "CSS", "JavaScript"], github: "#", linkedin: "#", instagram: "#", twitter: "#", image: null },
      { id: 3, name: "Rahul Patel", role: "Secretary", designation: "Backend Developer", skills: ["Java", "Spring", "MySQL"], github: "#", linkedin: "#", image: null },
    ],
    mentors: [
      { id: 4, name: "Prof. Amit Kumar", role: "Faculty Mentor", designation: "Assistant Professor, CS", skills: ["AI", "ML", "Research"], linkedin: "#", image: null },
      { id: 5, name: "Prof. Sunita Joshi", role: "Co-Mentor", designation: "Assistant Professor, IT", skills: ["Web", "Networking"], linkedin: "#", image: null },
    ],
    developers: [
      { id: 6, name: "Vikram Singh", role: "Lead Developer", designation: "Frontend Developer", skills: ["React", "TypeScript", "Tailwind"], github: "#", linkedin: "#", image: null },
      { id: 7, name: "Ananya Gupta", role: "Developer", designation: "Full Stack Dev", skills: ["MERN", "Firebase"], github: "#", linkedin: "#", image: null },
      { id: 8, name: "Karan Mishra", role: "Developer", designation: "Android Developer", skills: ["Kotlin", "Flutter", "Firebase"], github: "#", linkedin: "#", image: null },
      { id: 9, name: "Sneha Tiwari", role: "Designer", designation: "UI Designer", skills: ["Figma", "Adobe XD", "CSS"], github: "#", linkedin: "#", image: null },
    ]
  },
  "2023-24": {
    coreTeam: [
      { id: 10, name: "Aditya Rao", role: "President", designation: "Software Engineer", skills: ["Python", "Django", "AWS"], github: "#", linkedin: "#", image: null },
      { id: 11, name: "Deepika Nair", role: "Vice President", designation: "Data Scientist", skills: ["Python", "ML", "Tableau"], github: "#", linkedin: "#", image: null },
    ],
    developers: [
      { id: 12, name: "Mohit Dubey", role: "Lead Dev", designation: "Full Stack Dev", skills: ["Vue.js", "Laravel", "MySQL"], github: "#", linkedin: "#", image: null },
      { id: 13, name: "Riya Saxena", role: "Developer", designation: "Frontend Dev", skills: ["React", "CSS", "JavaScript"], github: "#", linkedin: "#", image: null },
    ]
  }
};

export const projectsData = [
  { id: 1, title: "Campus Nav App", team: "Team Voyager", members: 4, tech: ["React Native", "Node.js"], description: "Indoor navigation app for SATI campus using BLE beacons.", stars: 47, forks: 12, github: "#", demo: "#", category: "Mobile App" },
  { id: 2, title: "EduBot AI", team: "Team Neural", members: 3, tech: ["Python", "OpenAI", "FastAPI"], description: "AI-powered study assistant that answers questions from RGPV syllabus.", stars: 89, forks: 23, github: "#", demo: "#", category: "AI/ML" },
  { id: 3, title: "CampusConnect", team: "Team Matrix", members: 5, tech: ["MERN", "Socket.io"], description: "Real-time social platform for SATI students to share resources and connect.", stars: 63, forks: 18, github: "#", demo: "#", category: "Web App" },
  { id: 4, title: "Smart Attendance", team: "Team Vision", members: 3, tech: ["Python", "OpenCV", "Flask"], description: "Face recognition-based attendance system using Raspberry Pi.", stars: 55, forks: 15, github: "#", demo: null, category: "IoT/CV" },
  { id: 5, title: "Code Compiler IDE", team: "Team Byte", members: 4, tech: ["React", "Node.js", "Docker"], description: "Browser-based multi-language code compiler with real-time collaboration.", stars: 71, forks: 20, github: "#", demo: "#", category: "Dev Tools" },
  { id: 6, title: "Expense Tracker", team: "Team Wallet", members: 2, tech: ["Flutter", "Firebase"], description: "Cross-platform personal finance manager with AI spending insights.", stars: 38, forks: 9, github: "#", demo: "#", category: "Mobile App" },
];

export const learningData = [
  {
    id: 1, category: "Web Development",
    icon: "🌐",
    items: [
      { title: "The Odin Project", url: "https://www.theodinproject.com", type: "Course", free: true, description: "Full stack web dev from scratch." },
      { title: "CS50 Web", url: "https://cs50.harvard.edu/web", type: "Course", free: true, description: "Harvard's web programming with Python & JS." },
      { title: "MDN Web Docs", url: "https://developer.mozilla.org", type: "Reference", free: true, description: "The definitive web dev reference." },
    ]
  },
  {
    id: 2, category: "Data Structures & Algorithms",
    icon: "⚡",
    items: [
      { title: "Striver's DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course", type: "Course", free: true, description: "450 questions with video solutions." },
      { title: "LeetCode", url: "https://leetcode.com", type: "Practice", free: true, description: "Interview prep with company-tagged problems." },
      { title: "CP Algorithms", url: "https://cp-algorithms.com", type: "Reference", free: true, description: "Competitive programming techniques." },
    ]
  },
  {
    id: 3, category: "Machine Learning",
    icon: "🤖",
    items: [
      { title: "fast.ai", url: "https://fast.ai", type: "Course", free: true, description: "Top-down practical deep learning." },
      { title: "Andrew Ng ML Spec", url: "https://coursera.org/specializations/machine-learning-introduction", type: "Course", free: false, description: "The classic ML specialization." },
      { title: "Kaggle Learn", url: "https://kaggle.com/learn", type: "Course", free: true, description: "Micro-courses with hands-on notebooks." },
    ]
  },
  {
    id: 4, category: "Cybersecurity",
    icon: "🔐",
    items: [
      { title: "TryHackMe", url: "https://tryhackme.com", type: "Platform", free: true, description: "Gamified cybersecurity learning paths." },
      { title: "PicoCTF", url: "https://picoctf.org", type: "Practice", free: true, description: "CTF challenges for beginners." },
      { title: "OWASP Top 10", url: "https://owasp.org/Top10", type: "Reference", free: true, description: "The 10 critical web security risks." },
    ]
  },
  {
    id: 5, category: "Mobile Development",
    icon: "📱",
    items: [
      { title: "Android Developers", url: "https://developer.android.com/courses", type: "Course", free: true, description: "Official Android & Kotlin courses." },
      { title: "Flutter Docs", url: "https://docs.flutter.dev", type: "Reference", free: true, description: "Official Flutter documentation." },
      { title: "React Native Expo", url: "https://expo.dev/learn", type: "Course", free: true, description: "Cross-platform mobile with React." },
    ]
  },
  {
    id: 6, category: "Cloud & DevOps",
    icon: "☁️",
    items: [
      { title: "AWS Free Tier", url: "https://aws.amazon.com/free", type: "Platform", free: true, description: "Hands-on AWS with free tier." },
      { title: "Docker Docs", url: "https://docs.docker.com", type: "Reference", free: true, description: "Containerization from basics." },
      { title: "The Linux Command Line", url: "https://linuxcommand.org/tlcl.php", type: "Book", free: true, description: "Master the terminal." },
    ]
  }
];

// ===== EXPORTS FOR MOCK SERVER =====

// Public Home Page Data (Dynamically created from clubInfo)
export const homeData = {
  hero: {
    title: clubInfo.name,
    subtitle: clubInfo.tagline,
    description: clubInfo.description
  },
  updates: [
    { id: 1, text: "CodeSprint 2025 registration is now live!", date: "2025-07-01" },
    { id: 2, text: "Join our DSA Championship next month.", date: "2025-07-10" }
  ]
};

// Public Stats (Passed directly from clubInfo)
export const publicStatsData = clubInfo.stats;

// Admin Stats (Calculated based on your actual data lengths to make it realistic)
export const adminStatsData = {
  totalUsers: 142,
  activeProjects: projectsData.length,
  upcomingEvents: eventsData.filter(e => e.status === 'upcoming').length,
  unreadMessages: 5
};