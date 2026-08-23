
export const projectItems: IProject[] = [
 {
        title: "Study Crush",
        description: "A collaborative platform that allows students to share and access study resources like notes, PDFs, and links. Built with a focus on simplicity and accessibility, the app promotes peer-to-peer learning and efficient academic support.",
        github: "https://github.com/shailendrapawar/studyCrush",
        live: "https://study-crush.vercel.app/",
        img: "https://res.cloudinary.com/soty762i/image/upload/v1787492346/studyCrush.png",
        skills: "react,nodejs,express,mongodb,redux,postman,tailwind",
        category: "fullstack",
        isFeatured: true
    },
    {
        title: "Buzz Talk",
        description: "A full-stack one-on-one chat application built using the MERN stack with persistent messaging, user authentication, and real-time communication using Socket.IO. Designed with a clean UI for seamless user interaction",
        github: "https://github.com/shailendrapawar/mernChatBackend",
        live: "https://mern-chat-frontend-sepia.vercel.app/",
        img: "https://res.cloudinary.com/soty762i/image/upload/v1787492345/buzzTalk.png",
        skills: "react,nodejs,express,mongodb,redux,postman,tailwind",
        category: "fullstack",
        isFeatured: true
    },
    {
        title: "Easy Ride rentals",
        description: "A modern vehicle rental platform built with Next.js, allowing users to browse, filter, and book vehicles seamlessly. Features a clean UI with shadcn components, responsive design, and optimized performance using server-side rendering. Designed with scalability in mind for future backend integration including booking management and authentication.",
        github: "https://github.com/shailendrapawar/easy-ride-rental",
        live: "https://easy-ride-rental.vercel.app/",
        img: "https://res.cloudinary.com/soty762i/image/upload/v1787492347/easy-ride-rentals.png",
        skills: "typescript,nextjs,react,tailwind",
        category: "frontend",
        isFeatured: false
    },
    {
        title: "Luna Ecommerce",
        description: "A responsive eCommerce UI built with React — featuring product listings, cart management, and a smooth checkout flow.",
        github: "https://github.com/shailendrapawar/e-commerce",
        live: "https://e-commerce-seven-olive-87.vercel.app/",
        img: "https://res.cloudinary.com/soty762i/image/upload/v1787492346/luna-ecommerce.png",
        skills: "typescript,react,tailwind,redux",
        category: "frontend",
        isFeatured: false
    },
    {
        title: "Tesser-X",
        description: "A sleek agency website showcasing services, portfolio, and team with a modern, professional design.",
        github: "https://github.com/shailendrapawar/agency-website",
        live: "https://agency-website-beta-blush.vercel.app/",
        img: "https://res.cloudinary.com/soty762i/image/upload/v1787492346/agency-website.png",
        skills: "react,javascript,tailwind,redux",
        category: "frontend",
        isFeatured: false

    },
    {
        title: "Crusty Bites",
        description: "A clean and responsive web app for a pizza store where users can browse the menu and simulate placing orders",
        github: "https://github.com/shailendrapawar/foodOrder-app",
        live: "https://crusty-bites.vercel.app/",
        img: "https://res.cloudinary.com/soty762i/image/upload/v1787492346/studyCrush.png",
        skills: "react,tailwind,redux",
        category: "frontend",
        isFeatured: false
    },
    {
        title: "Camera App",
        description: "A simple mobile app built with React Native that allows users to access the device camera to take photos or record videos. It includes features like camera permission handling, switching between front and back cameras, and saving media to the device gallery.",
        skills: "react,javascript,css,babel,npm,git",
        github: "https://github.com/shailendrapawar/cameraApp-reactNative",
        img: "https://res.cloudinary.com/soty762i/image/upload/v1787492345/camera-app.svg",
        category: "app",
        isFeatured: false
    },
    {
        title: "Weather App",
        description: "A clean and lightweight React Native app that shows real-time weather information based on the user's location. It fetches data from a weather API and displays details like temperature, conditions (sunny, rainy, etc.), and humidity with a simple and user-friendly UI.",
        github: "https://github.com/shailendrapawar/weatherApp-reactNative",
        skills: "react,javascript,css,babel,npm,git",
        img: "https://res.cloudinary.com/soty762i/image/upload/v1787492347/weather-app.svg",
        category: "app",
        isFeatured: false
    }
];

export type  IProject={
    title: string;
    description: string;
    img: string;
    skills: string;
    category: string;
    live?: string;
    github: string;
    isFeatured:boolean;
}