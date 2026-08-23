export const workExpirienceItems: IWorkExpirienceItem[] = [
  {
    order: 4,
    company: "Sahaj Seva",
    position: "Software developer",
    startDate: "May 2025",
    endDate: "Present",
    description:
      "Currently developing CRM application for Medical domain organisation",
    pointers: [
      "Currently developing CRM application for Medical domain organisation",
    ],
    skills: "react,typescript,nodejs,express,mongodb,tailwindcss,redis",
    isCurrent: true,
  },
  {
    order: 3,
    company: "Axe consultancy pvt. ltd.",
    position: "Full Stack Developer",
    startDate: "February 2026",
    endDate: "May 2026",
    description:
      "Worked as a Full Stack Developer on SureGems, an e-commerce platform for diamonds and gemstones. Contributed to both frontend and backend development by building scalable features and optimizing application performance.",
    pointers: [
      "Developed and integrated frontend screens and reusable components using React.js, including Diamond pages, Gemstone pages, Cart, and Wishlist modules.",
      "Implemented TanStack Query for efficient data fetching, caching, and frontend performance optimization.",
      "Used Zustand for state management in complex UI workflows, including multi-step forms and shared application states.",
      "Designed and developed GraphQL server architecture to securely expose and manage APIs.",
      "Built backend APIs for Wishlist, Cart, Discounts, Diamond , Gemstone and related e-commerce functionalities using Go (Golang).",
      "Worked with PostgreSQL database and used Bob ORM for database operations and query management.",
      "Collaborated across the development lifecycle, from feature implementation to production-ready deployment and optimization.",
    ],
    skills: "react,go,postgres,graphql,redis,tailwind",
    isCurrent: false,
  },
  {
    order: 2,
    company: "Yatra Online Pvt. Ltd.",
    position: "SDE intern",
    startDate: "August 2025",
    endDate: "Present",
    description:
      "Worked as a Backend Developer on logistics systems, contributing to API development, enterprise integrations, and workflow automation. Built and enhanced scalable backend services for shipment tracking, data synchronization, and production operations.",
    pointers: [
      "Developed container tracking functionality enabling real-time visibility across 200+ daily shipments",
      "Integrated Microsoft Dynamics 365 Business Central (Navision) APIs for customer and billing data synchronization.",
      "Automated shipment tracking using scheduled cron jobs, ensuring timely updates and reducing repetitive manual tasks.",
      "Developed configurable integrations for flexible third-party API connectivity, enabling new integrations with minimal code changes.",
      "Enhanced microservice integrations using Handlebars templates to support scalable and reliable API workflows.",
      "Troubleshot and resolved production issues, improving system reliability and minimizing downtime.",
    ],
    skills: "react,mongodb,express,nodejs,typescript,angular,bootstrap",
    isCurrent: false,
  },
  {
    order: 1,
    company: "Medyug technologies pvt ltd",
    position: "Web developer intern",
    startDate: "May 2024",
    endDate: "September 2024",
    description:
      "Worked on an AI-powered medical assistant, contributing to both frontend development and AI-integrated user experiences. Built responsive interfaces for patient interactions and collaborated with backend and product teams to deliver intuitive, user-friendly features.",
    pointers: [
      "Contributed to the development and training of an AI-powered medical assistant, improving automated patient query classification and response accuracy",
      "Developed interactive frontend interfaces using React.js and Tailwind CSS to present AI-generated responses and patient query flows.",
      "Designed responsive web interfaces to improve accessibility and user experience across devices.",
      "Collaborated with backend and product teams to deliver seamless AI-integrated user experiences.",
    ],
    skills: "react,typescript,nodejs,express,mongodb,tailwindcss",
    isCurrent: false,
  },
]

export type IWorkExpirienceItem = {
  order: number
  company: string
  companyLinkedin?: string
  position: string
  startDate: string
  endDate?: string
  description: string
  pointers?: string[]
  skills: string

  isCurrent: boolean

  media?: string[]
}
