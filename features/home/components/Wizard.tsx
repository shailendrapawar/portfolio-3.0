"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const wizards = {
  light: "https://res.cloudinary.com/soty762i/image/upload/v1787428920/blue-wizard.png",
  dark: "https://res.cloudinary.com/soty762i/image/upload/v1787428920/white-wizard.png",
};

export default function Wizard() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch: theme is only known on the client.
  if (!mounted) return <div className="h-full w-full" />;

  const src = resolvedTheme === "dark" ? wizards.dark : wizards.light;

  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt="Wizard"
        fill
        sizes="(max-width: 640px) 12.5rem, (max-width: 768px) 16.25rem, 20rem"
        className="object-contain"
        priority
      />
    </div>
  );
}
