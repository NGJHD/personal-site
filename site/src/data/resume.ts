// Transcribed directly from "Ng Jun Hao Darren.pdf". Do not add facts, metrics,
// or employers that are not present in the source resume.

export const profile = {
  name: "Ng Jun Hao Darren",
  title: "Frontend / Full-Stack Engineer",
  phone: "9474 9449",
  email: "ng.jh.darren@outlook.com",
  summary:
    "Building things that need to work",
};

export const skills = [
  {
    category: "Frontend",
    items: ["React", "JavaScript", "Grafana", "C# WPF"],
  },
  {
    category: "Backend",
    items: ["Node.js", "C# .NET"],
  },
  {
    category: "Tools & DevOps",
    items: ["Docker", "Git", "Kubernetes"],
  },
  {
    category: "Design",
    items: ["Photoshop"],
  },
] as const;

export type SubProject = {
  name: string;
  role: string;
  team?: string;
  duration?: string;
  description: string;
  tags: string[];
  note?: string;
};

export type Employer = {
  name: string;
  duration: string;
  status: "ongoing" | "complete";
  projects: SubProject[];
};

export const experience: Employer[] = [
  {
    name: "ST Engineering Cloud & Data Centre Solutions",
    duration: "10/2012 – Current",
    status: "ongoing",
    projects: [
      {
        name: "Monitoring Platform",
        role: "UI/UX Manager",
        // team: "2x Frontend, 4x Backend",
        duration: "2020 – Ongoing",
        description:
          "Led frontend development of a monitoring platform tracking equipment and network statuses across multiple locations.",
        tags: [
          // "React",
          // "React Admin",
          // "Grafana",
          // "HTML/CSS",
          // "SQL",
          // "TypeScript",
          // "Scrum",
          // "Agile",
          // "JSON",
          // "REST",
          // "Feathers.js",
          // "Kubernetes",
          // "Message Queue",
          // "NATS",
          // "Docker",
          // "Git",
        ],
      },
      {
        name: "Analytics Dashboard",
        role: "Frontend Lead",
        // team: "1x Frontend, 7x Backend",
        duration: "2019 – 2020 (1 year)",
        description:
          "Designed and implemented a dashboard to display various interesting metrics.",
        tags: [],
      },
      {
        name: "Various Video Wall Projects",
        role: "Full Stack Engineer",
        // team: "Just me",
        duration: "2012 – 2019 (7 years)",
        description:
          "Sole engineer developing multiple video wall solutions for various enterprises.",
        tags: [],
      },
      {
        name: "Littoral Mission Vessel",
        role: "Software Manager",
        // team: "2x Frontend, 7x Backend",
        duration: "2013 – 2020 (7 years)",
        description:
          "Involved from the start to the end.",
        tags: [],
        note: "Notable applications delivered under this programme:",
      },
    ],
  },
];

export type MissionApp = {
  name: string;
  description: string;
  tags: string[];
};

export const missionApps: MissionApp[] = [
  {
    name: "Command Console",
    description:
      "Providing situation awareness to the CO.",
    tags: [],
  },
  {
    name: "Water Cannon",
    description:
      "Controlling and enabling precise targeting.",
    tags: [],
  },
  {
    name: "Communications",
    description:
      "A platform to exchange messages and other files.",
    tags: [],
  },
];

export type PersonalProject = {
  name: string;
  period: string;
  description: string;
  tags: string[];
  repo: string;
  playStore?: string;
};

export const personalProjects: PersonalProject[] = [
  {
    name: "Composition Marker",
    period: "Since 2026",
    description:
      "An app that marks handwritten compositions from photos and generates feedback using a bundled, locally hosted Qwen3.8-27B model. Self-contained - no installation required.",
    tags: ["Claude Code", "Windows"],
    repo: "https://github.com/NGJHD/Composition-Marker",
  },  
  {
    name: "Wave Keep",
    period: "Since 2026",
    description:
      "Built a tower defense game for kids on Android. Generated all the game assets locally with ComfyUI and used Claude Code to build the game. Published on Play Store.",
    tags: ["Claude Code", "ComfyUI", "Android"],
    repo: "",
    playStore: "https://play.google.com/store/apps/details?id=com.wavekeep.game",
  },
  {
    name: "Meeting Summariser / Minutes Generator",
    period: "Since 2026",
    description:
      "Built an app that takes in audio and generates a summary and minutes. It hosts and uses local models for speech-to-text (whisper-large-v3-turbo) and summarisation (Qwen3.8-27B-UD-IQ4_XS). Self-contained - no installation required.",
    tags: ["Claude Code", "Windows"],
    repo: "https://github.com/NGJHD/Meeting-Summarizer",
  },  
  {
    name: "Media Whiteboard",
    period: "Since 2026",
    description:
      "Ever wanted to make a collage or animated collage without dealing with complicated apps? I built an app just for that. Drop in your images, annotate, hit generate and your static or animated WebP is ready to upload. Self-contained - no installation required.",
    tags: ["Claude Code", "Windows"],
    repo: "https://github.com/NGJHD/media-whiteboard",
  },  
  {
    name: "Video Trim & Crop",
    period: "Since 2026",
    description:
      "Just need to rotate, crop, or trim a video without firing up Adobe Premiere? I built a simple app for exactly that. Self-contained - no installation required.",
    tags: ["Claude Code", "Windows"],
    repo: "https://github.com/NGJHD/video-trim-crop-app",
  },  
  {
    name: "Stock Thesis Monitor Bot",
    period: "Since 2026",
    description:
      "Built a bot that monitors Yahoo News daily for updates relevant to my numerous stock investment theses and delivers a curated daily summary via Telegram.",
    tags: ["OpenRouter API", "Claude Code", "Windows", "Telegram"],
    repo: "",
  },
  {
    name: "Windows Port Killer",
    period: "Since 2026",
    description:
      "Built a tool to easily kill processes running on specific ports on Windows. It's actually a simple utility but I like the UI so I'm listing it here 😂. Self-contained - no installation required",
    tags: ["Claude Code", "Windows"],
    repo: "https://github.com/NGJHD/port-killer",
  },
  {
    name: "Kanban Board",
    period: "Since 2026",
    description:
      "Tons of Kanban boards out there. None did what I wanted with a priority tag, so naturally I bullied Claude into making one 😂. Self-contained - no installation required",
    tags: ["Claude Code", "Windows"],
    repo: "https://github.com/NGJHD/Kanban-App",
  },
  {
    name: "Cryptocurrency Trading Bot",
    period: "2021 - 2026",
    description:
      "Developed a fully automated trading system in C# integrating the Gemini Exchange API for real-time order execution using custom indicator-based logic. Added automated daily summary Telegram reports and achieved sustained profitability since 2022.",
    tags: ["C#", ".NET", "Windows"],
    repo: "",
  },  
  {
    name: "Music Folder Player",
    period: "Since 2016",
    description:
      "Built a lightweight, portable C# folder-based music player to simplify playlist management on Windows.",
    tags: ["C#", "WPF", ".NET", "Windows"],
    repo: "https://github.com/NGJHD/FolderPlayer",

  },
  {
    name: "Movie Catalogue Software",
    period: "Since 2012",
    description:
      "Built a lightweight, portable C# desktop app that automatically scrapes and catalogues movie details from OMDB for local movie video files.",
    tags: ["C#", "WPF", ".NET", "Windows"],
    repo: "https://github.com/NGJHD/MovieCatelogSoftware",
  },
];

export type Hobby = {
  name: string;
  period: string;
  description: string;
};

// Listed in display order.
export const hobbies: Hobby[] = [
  {
    name: "AI Filmmaking with ComfyUI",
    period: "Since 2025",
    description:
      "Still getting nowhere with this mode of storytelling after spending thousands of hours training LoRAs and generating videos. A slipper will be going through my monitor screen soon.",
  },
  {
    name: "Generative Art with ComfyUI",
    period: "Since 2025",
    description:
      "Creating fantasy scenes of my dreams with ComfyUI. Results vary; dreams don't.",
  },
  {
    name: "Photography",
    period: "Since 2012",
    description: "Some of the ones that didn't get deleted.",
  },
  {
    name: "Watching Movies",
    period: "Since 2007",
    description:
      "After more than 800 movies, here are some of my absolute favourites.",
  },
  {
    name: "Build / Overclock Computers",
    period: "2009 – 2017",
    description:
      "Built more than 100 desktops for various churches and people. Overclocking was once a personal passion project.",
  },
];

// A period that names an end year (as opposed to an open-ended "Since ...").
// Matches both the hyphen-minus and the en dash used across the data above.
export const isEndedPeriod = (period: string) => /[-–]/.test(period);

export const certifications = [
  { name: "Certified Kubernetes Application Developer (CKAD)", year: "2025" },
  { name: "Certified Couchbase Capella Associate Administrator", year: "2025" },
  { name: "Certified ScrumMaster", year: "2022" },
];

export const education = [
  {
    school: "University of Wollongong",
    subtitle: "Singapore Institute of Management",
    program: "Bachelor of Computer Science",
    duration: "2009 – 2012",
    details: [
      "Major in Digital Systems Security",
      "Salutatorian, Rank 2nd in Cohort",
      "CSIT Silver Award",
      "Dean's Merit List",
    ],
  },
  {
    school: "Singapore Polytechnic",
    program: "Diploma in Electronics, Electrical and Computer Engineering",
    duration: "2004 – 2007",
    details: [],
  },
];
