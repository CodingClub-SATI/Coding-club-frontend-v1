// ===== SITE DATA MATCHING NEW FRONTEND CONTRACTS =====

export const siteInfo = {
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
    status: "completed",
    featured: false,
    date: "July 10, 2026",
    time: "11:00 AM",
    venue: "Computer Lab 2, SATI",
    description: "Hands-on workshop covering HTML, CSS, React, and deployment.",
    tags: ["Workshop", "Web Dev", "Beginner Friendly"],
    registrationLink: "",
    bannerUrl: null,
    viewCount: 89,
    registerClickCount: 0,
    archived: false
  }
];

export const gallery = [
  {
    id: "g1",
    title: "CodeSprint 2025",
    date: "August 2025",
    cover: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    imageCount: 2,
    images: [
      { id: "img1", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", caption: "Hackathon kickoff", featured: true },
      { id: "img2", src: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80", caption: "Midnight coding", featured: false }
    ]
  }
];

export const projects = [
  {
    id: "p1",
    title: "Campus Nav App",
    team: "Team Voyager",
    members: 4,
    category: "Mobile App",
    description: "Indoor navigation app for SATI campus using BLE beacons.",
    tech: ["React Native", "Node.js"],
    github: "https://github.com/example/campus-nav",
    demo: "",
    stars: 47,
    forks: 12,
    achieved: true
  },
  {
    id: "p2",
    title: "EduBot AI",
    team: "Team Neural",
    members: 3,
    category: "AI/ML",
    description: "AI-powered study assistant that answers questions from RGPV syllabus.",
    tech: ["Python", "OpenAI", "FastAPI"],
    github: "https://github.com/example/edubot",
    demo: "https://edubot.example.com",
    stars: 89,
    forks: 23,
    achieved: true
  }
];

export const teamsPublic = {
  leadership: {
    convenor: { id: "l1", fullName: "Prof. Amit Kumar", clubPosition: "Convenor", specialization: "Faculty Mentor", avatarUrl: null, socials: { linkedin: "https://linkedin.com" } },
    coConvenor: { id: "l2", fullName: "Dr. Sunita Joshi", clubPosition: "Co-Convenor", specialization: "Faculty Co-Mentor", avatarUrl: null, socials: {} },
    departmentLeads: [
      { id: "l3", fullName: "Arjun Sharma", clubPosition: "Department Lead - Technical", specialization: "Full Stack Developer", avatarUrl: null, socials: { github: "https://github.com" } }
    ]
  },
  batches: [
    {
      batch: "2026",
      members: [
        { id: "m1", fullName: "Rahul Patel", clubPosition: "President", specialization: "Backend Developer", skills: ["Java", "Spring", "MySQL"], avatarUrl: null, socials: { github: "https://github.com" } },
        { id: "m2", fullName: "Priya Verma", clubPosition: "Vice President", specialization: "UI/UX Designer", skills: ["Figma", "CSS"], avatarUrl: null, socials: {} }
      ]
    }
  ]
};

export const teamsAdmin = {
  batches: [
    {
      batch: "2026",
      archived: false,
      memberCount: 3,
      members: [
        { id: "l3", fullName: "Arjun Sharma", clubPosition: "Department Lead - Technical", specialization: "Full Stack Developer", batch: "2026", skills: ["React", "Node.js"], avatarUrl: null, socials: { github: "https://github.com" }, isLeadership: true },
        { id: "m1", fullName: "Rahul Patel", clubPosition: "President", specialization: "Backend Developer", batch: "2026", skills: ["Java", "Spring", "MySQL"], avatarUrl: null, socials: { github: "https://github.com" }, isLeadership: false },
        { id: "m2", fullName: "Priya Verma", clubPosition: "Vice President", specialization: "UI/UX Designer", batch: "2026", skills: ["Figma", "CSS"], avatarUrl: null, socials: {}, isLeadership: false }
      ]
    }
  ]
};

export const contacts = [
  {
    id: "c1",
    name: "John Doe",
    email: "john@example.com",
    requestType: "General Inquiry",
    message: "Hi, I would like to know more about the upcoming hackathon. Are first-year students allowed to participate?",
    status: "New",
    submittedAt: "2026-07-28T08:30:00Z"
  },
  {
    id: "c2",
    name: "Jane Smith",
    email: "jane@example.com",
    requestType: "Join Club",
    message: "I am interested in joining the web development team. What is the process?",
    status: "Read",
    submittedAt: "2026-07-25T14:15:00Z"
  }
];