export type HighlightLink = {
  label: string;
  href: string;
};

export type ExperienceEntry = {
  org: string;
  meta?: string;
  title: string;
  impact?: string;
  bullets: string[];
  highlights?: HighlightLink[];
};

export type SubRole = {
  title: string;
  meta: string;
  bullets: string[];
};

export type EducationEntry = {
  school: string;
  meta: string;
  degree: string;
};

export const workExperience: ExperienceEntry[] = [
  {
    org: "MediumAI",
    meta: "Jan 2023 - Present",
    title: "Co-Founder & Software Engineer",
    impact: "Impact: Shipped multilingual RAG pipelines and production deployment infrastructure.",
    bullets: [
      "Built production RAG LLM pipelines for multilingual medical transcription and documentation.",
      "Expanded the pipeline for multimodal inputs with privacy-sensitive preprocessing.",
      "Led R&D planning and delivery using GitHub and Jira.",
      "Developed UI and new product features with HeroUI and Tailwind."
    ],
    highlights: [
      { label: "The Product of MediumAI", href: "https://medium-ai-scribe.squarespace.com/scribe-family-doctor" },
      {
        label: "First-success post",
        href: "https://www.linkedin.com/posts/justinlinkk_on-november-20-mcmaster-universitys-entrepreneurial-activity-7265823373262221312-10pO"
      },
      { label: "New voice agent project", href: "https://talktomedi.com/" }
    ]
  },
  {
    org: "Sun Yat-sen University",
    meta: "May - Aug 2023",
    title: "Computer Science RA Intern",
    impact: "Impact: Enabled physics simulation workflows with MLP solvers and 3D data tooling.",
    bullets: [
      "Developed neural-network models for physics simulation and differential equation solving.",
      "Researched MLP solvers with NVIDIA Modulus for differential equations.",
      "Processed and visualized 3D scan datasets using Open3D and ParaView.",
      "Built dataset conversion tooling for 3D scans and STL files."
    ]
  }
];

export const ieeeSubroles: SubRole[] = [
  {
    title: "Branch Treasurer",
    meta: "May 2024 - May 2025",
    bullets: [
      "Managed financial activities including maintaining balanced accounts, preparing budget for the Student Branch Annual Plan, overseeing fundraiser efforts, and directing office and laboratory inventory management."
    ]
  },
  {
    title: "Branch Vice-Chair",
    meta: "May 2023 - May 2024",
    bullets: [
      "Engaged in Student Branch meetings, resolving conflicts related to branch management between the main team and chapter executives.",
      "Organized technical workshops including soldering and eye-tracking training; supervised lab instruments and provided hardware/embedded design guidance for capstone projects."
    ]
  }
];

export const roboMasterRole: SubRole = {
  title: "Computer Vision Engineer",
  meta: "Sep 2022 - Aug 2023",
  bullets: [
    "Used a YOLOv5 model with a custom dataset to build an object-tracking pipeline; deployed on Jetson with UART-based communication to the main controller.",
    "Trained and tested convolutional neural networks on Jetson for object detection across diverse environments."
  ]
};

export const educationHistory: EducationEntry[] = [
  {
    school: "University of California, San Diego",
    meta: "Sept 2025 - Present",
    degree: "M.S. in Computer Engineering"
  },
  {
    school: "McMaster University",
    meta: "Sept 2020 - June 2025",
    degree: "B.Eng. in Electrical Engineering & Management"
  }
];

export const awards = [
  "Dean's Honour List (2025, 2023, 2021)",
  "McMaster Honour Award (2020)"
];

export const scholarshipAward = {
  label: "Dr. Rudolf De Buda Scholarship (2025)",
  href: "https://www.scholarshipca.com/scholarships/mcmaster-university-dr-rudolf-de-buda-scholarship-2024"
};
