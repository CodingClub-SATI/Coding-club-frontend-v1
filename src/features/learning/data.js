// Learning resources and roadmaps for the Learning Hub page. This content
// changes only a couple of times a year, so it ships as a static file
// instead of an API-backed collection — edit this file and redeploy to
// update it, no backend needed.
//
// Each roadmap links to a resource category via `categoryId`; a category
// with no matching roadmap just falls back to a "coming soon" message.

export const LEARNING_RESOURCES = [
  {
    id: 'webdev',
    category: 'Web Development',
    icon: '🌐',
    items: [
      {
        title: 'The Odin Project',
        url: 'https://www.theodinproject.com',
        type: 'Course',
        free: true,
        description: 'Full stack web dev from scratch.',
      },
      {
        title: 'CS50 Web',
        url: 'https://cs50.harvard.edu/web',
        type: 'Course',
        free: true,
        description: "Harvard's web programming with Python & JS.",
      },
      {
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        type: 'Reference',
        free: true,
        description: 'The definitive web dev reference.',
      },
    ],
  },
  {
    id: 'dsa',
    category: 'Data Structures & Algorithms',
    icon: '⚡',
    items: [
      {
        title: "Striver's DSA Sheet",
        url: 'https://takeuforward.org/strivers-a2z-dsa-course',
        type: 'Course',
        free: true,
        description: '450 questions with video solutions.',
      },
      {
        title: 'LeetCode',
        url: 'https://leetcode.com',
        type: 'Practice',
        free: true,
        description: 'Interview prep with company-tagged problems.',
      },
      {
        title: 'CP Algorithms',
        url: 'https://cp-algorithms.com',
        type: 'Reference',
        free: true,
        description: 'Competitive programming techniques.',
      },
    ],
  },
  {
    id: 'ml',
    category: 'Machine Learning',
    icon: '🤖',
    items: [
      {
        title: 'fast.ai',
        url: 'https://fast.ai',
        type: 'Course',
        free: true,
        description: 'Top-down practical deep learning.',
      },
      {
        title: 'Andrew Ng ML Spec',
        url: 'https://coursera.org/specializations/machine-learning-introduction',
        type: 'Course',
        free: false,
        description: 'The classic ML specialization.',
      },
      {
        title: 'Kaggle Learn',
        url: 'https://kaggle.com/learn',
        type: 'Course',
        free: true,
        description: 'Micro-courses with hands-on notebooks.',
      },
    ],
  },
  {
    id: 'cybersecurity',
    category: 'Cybersecurity',
    icon: '🔐',
    items: [
      {
        title: 'TryHackMe',
        url: 'https://tryhackme.com',
        type: 'Platform',
        free: true,
        description: 'Gamified cybersecurity learning paths.',
      },
      {
        title: 'PicoCTF',
        url: 'https://picoctf.org',
        type: 'Practice',
        free: true,
        description: 'CTF challenges for beginners.',
      },
      {
        title: 'OWASP Top 10',
        url: 'https://owasp.org/Top10',
        type: 'Reference',
        free: true,
        description: 'The 10 critical web security risks.',
      },
    ],
  },
  {
    id: 'mobile',
    category: 'Mobile Development',
    icon: '📱',
    items: [
      {
        title: 'Android Developers',
        url: 'https://developer.android.com/courses',
        type: 'Course',
        free: true,
        description: 'Official Android & Kotlin courses.',
      },
      {
        title: 'Flutter Docs',
        url: 'https://docs.flutter.dev',
        type: 'Reference',
        free: true,
        description: 'Official Flutter documentation.',
      },
      {
        title: 'React Native Expo',
        url: 'https://expo.dev/learn',
        type: 'Course',
        free: true,
        description: 'Cross-platform mobile with React.',
      },
    ],
  },
  {
    id: 'cloud-devops',
    category: 'Cloud & DevOps',
    icon: '☁️',
    items: [
      {
        title: 'AWS Free Tier',
        url: 'https://aws.amazon.com/free',
        type: 'Platform',
        free: true,
        description: 'Hands-on AWS with free tier.',
      },
      {
        title: 'Docker Docs',
        url: 'https://docs.docker.com',
        type: 'Reference',
        free: true,
        description: 'Containerization from basics.',
      },
      {
        title: 'The Linux Command Line',
        url: 'https://linuxcommand.org/tlcl.php',
        type: 'Book',
        free: true,
        description: 'Master the terminal.',
      },
    ],
  },
];

export const ROADMAPS = [
  {
    id: 'webdev-roadmap',
    categoryId: 'webdev',
    title: 'Web Development',
    tone: 'primary',
    steps: [
      'HTML, CSS & Responsive Layouts',
      'JavaScript Fundamentals & the DOM',
      'A Frontend Framework (React)',
      'Backend Basics (Node.js & REST APIs)',
      'Databases & Full-Stack Projects',
    ],
  },
  {
    id: 'dsa-roadmap',
    categoryId: 'dsa',
    title: 'Data Structures & Algorithms',
    tone: 'secondary',
    steps: [
      'Language Fundamentals & Logic',
      'Time/Space Complexity Analysis',
      'Basic Data Structures (Arrays, Strings, Linked Lists)',
      'Core Algorithms (Sorting, Searching, Recursion)',
      'Advanced DS (Trees, Graphs, DP)',
    ],
  },
  {
    id: 'ml-roadmap',
    categoryId: 'ml',
    title: 'Machine Learning',
    tone: 'accent',
    steps: [
      'Python & Math Foundations (Linear Algebra, Calculus, Stats)',
      'Data Manipulation (Pandas, NumPy)',
      'Classical ML Algorithms (Scikit-Learn)',
      'Deep Learning (PyTorch / TensorFlow)',
      'Model Deployment & Real-World Projects',
    ],
  },
  {
    id: 'cybersecurity-roadmap',
    categoryId: 'cybersecurity',
    title: 'Cybersecurity',
    tone: 'primary',
    steps: [
      'Networking & OS Fundamentals',
      'Linux & Command Line Proficiency',
      'Web Security Basics (OWASP Top 10)',
      'Hands-On Practice (CTFs, TryHackMe Rooms)',
      'Specialize (Pentesting, Cloud Security, or Forensics)',
    ],
  },
  {
    id: 'mobile-roadmap',
    categoryId: 'mobile',
    title: 'Mobile Development',
    tone: 'secondary',
    steps: [
      'Programming Fundamentals (Kotlin / Dart / JS)',
      'UI Toolkit Basics (Jetpack Compose / Flutter / React Native)',
      'State Management & Navigation',
      'APIs, Local Storage & Device Features',
      'Publish an App to the Play Store',
    ],
  },
  {
    id: 'cloud-devops-roadmap',
    categoryId: 'cloud-devops',
    title: 'Cloud & DevOps',
    tone: 'accent',
    steps: [
      'Linux & Networking Basics',
      'Version Control & CI/CD Pipelines',
      'Containerization with Docker',
      'Cloud Platform Fundamentals (AWS / Azure / GCP)',
      'Orchestration & Infrastructure as Code (Kubernetes, Terraform)',
    ],
  },
];
