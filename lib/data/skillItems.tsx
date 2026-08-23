export const frontendSkills: ISkills = [
  {
    name: "JavaScript",
    code: "javascript",
    category: "frontend",
    level: 80,
    lightIcon: "skill-icons:javascript",
    darkIcon: "skill-icons:javascript",
    defaultIcon: "skill-icons:javascript"
  },
  {
    name: "React",
    code: "react",
    category: "frontend",
    level: 80,
    lightIcon: "skill-icons:react-light",
    darkIcon: "skill-icons:react-dark",
    defaultIcon: "skill-icons:react-dark"
  },
  {
    name: "TypeScript",
    code: "typescript",
    category: "frontend",
    level: 80,
    defaultIcon: "skill-icons:typescript"
  },
  {
    name: "Next.js",
    code: "next.js",
    category: "frontend",
    level: 70,
    lightIcon: "skill-icons:nextjs-light",
    darkIcon: "skill-icons:nextjs-dark",
    defaultIcon: "skill-icons:nextjs-dark"
  },
  {
    name: "Zustand",
    code: "zustand",
    category: "frontend",
    level: 60,
    lightIcon: "devicon:zustand",
    darkIcon: "devicon:zustand",
    defaultIcon: "devicon:zustand"
  },
  {
    name: "Redux-toolkit",
    code: "redux-toolkit",
    category: "frontend",
    level: 60,
    lightIcon: "skill-icons:redux",
    darkIcon: "skill-icons:redux",
    defaultIcon: "skill-icons:redux"
  },
  {
    name: "Tailwind CSS",
    code: "tailwind-css",
    category: "frontend",
    level: 80,
    lightIcon: "skill-icons:tailwindcss-light",
    darkIcon: "skill-icons:tailwindcss-dark",
    defaultIcon: "skill-icons:tailwindcss-dark"
  },
  {
    name: "Vite",
    code: "vite",
    category: "frontend",
    level: 70,
    lightIcon: "skill-icons:vite-light",
    darkIcon: "skill-icons:vite-dark",
    defaultIcon: "skill-icons:vite-dark"
  },
  {
    name:"TanStack Query",
    code:"tanstack-query",
    category:"frontend",
    level:60,
    defaultIcon:"thesvg-color:tanstack"
  }
]

export const backendSkills: ISkills = [
  {
    name: "Node",
    code: "node",
    category: "backend",
    level: 80,
    lightIcon: "skill-icons:nodejs-light",
    darkIcon: "skill-icons:nodejs-dark",
    defaultIcon: "skill-icons:nodejs-dark"
  },
  {
    name: "Express",
    code: "express",
    category: "backend",
    level: 70,
    lightIcon: "skill-icons:expressjs-light",
    darkIcon: "skill-icons:expressjs-dark",
    defaultIcon: "skill-icons:expressjs-dark"
  },
  {
    name: "Go-lang",
    code: "go-lang",
    category: "backend",
    level: 60,
    defaultIcon: "skill-icons:golang"
  },
  {
    name:"Gin-framework",
    code:"gin",
    category:"backend",
    level:50,
    defaultIcon:"logos:gin"
  },
  {
    name: "Redis",
    code: "redis",
    category: "backend",
    level: 50,
    lightIcon: "skill-icons:redis-light",
    darkIcon: "skill-icons:redis-dark",
    defaultIcon: "skill-icons:redis-dark"
  },
  {
    name: "RabbitMQ",
    code: "rabbitmq",
    category: "backend",
    level: 50,
    lightIcon: "skill-icons:rabbitmq-light",
    darkIcon: "skill-icons:rabbitmq-dark",
    defaultIcon: "skill-icons:rabbitmq-dark"
  },

]
export const databaseSkills: ISkills = [
  {
    name: "MongoDB",
    code: "mongodb",
    category: "database",
    level: 70,
    defaultIcon: "skill-icons:mongodb"
  },
  {
    name: "MySQL",
    code: "mysql",
    category: "database",
    level: 60,
    lightIcon: "skill-icons:mysql-light",
    darkIcon: "skill-icons:mysql-dark",
    defaultIcon: "skill-icons:mysql-dark"
  },
  {
    name: "PostgreSQL",
    code: "postgresql",
    category: "database",
    level: 60,
    lightIcon: "skill-icons:postgresql-light",
    darkIcon: "skill-icons:postgresql-dark",
    defaultIcon: "skill-icons:postgresql-dark"
  }
]

export const toolSkills: ISkills = [
  {
    name: "Git",
    code: "git",
    category: "tool",
    level: 70,
    defaultIcon: "skill-icons:git"
  },
  {
    name: "Docker",
    code: "docker",
    category: "tool",
    level: 60,
    defaultIcon: "skill-icons:docker"
  },
  {
    name: "Figma",
    code: "figma",
    category: "tool",
    level: 70,
    lightIcon: "skill-icons:figma-light",
    darkIcon: "skill-icons:figma-dark",
    defaultIcon: "skill-icons:figma-dark"
  },
  {
    name: "VS Code",
    code: "vs-code",
    category: "tool",
    level: 80,
    lightIcon: "skill-icons:vscode-light",
    darkIcon: "skill-icons:vscode-dark",
    defaultIcon: "skill-icons:vscode-dark"
  },
  {
    name: "Postman",
    code: "postman",
    category: "tool",
    level: 70,
    defaultIcon: "skill-icons:postman"
  },
  {
    name: "GitHub",
    code: "github",
    category: "tool",
    level: 80,
    lightIcon: "skill-icons:github-light",
    darkIcon: "skill-icons:github-dark",
    defaultIcon: "skill-icons:github-dark"
  },
  {
    name: "Jenkins",
    code: "jenkins",
    category: "tool",
    level: 60,
    lightIcon: "skill-icons:jenkins-light",
    darkIcon: "skill-icons:jenkins-dark",
    defaultIcon: "skill-icons:jenkins-dark"
  },
  {
    name: "Npm",
    code: "npm",
    category: "tool",
    level: 70,
    lightIcon: "skill-icons:npm-light",
    darkIcon: "skill-icons:npm-dark",
    defaultIcon: "skill-icons:npm-dark"
  }
]

export const skills: ISkills = [
  ...frontendSkills,
  ...backendSkills,
  ...databaseSkills,
  ...toolSkills
]

export type ISkills = {
  name: string
  code: string
  category: string
  level: number

  lightIcon?: string
  darkIcon?: string
  defaultIcon: string
}[]
