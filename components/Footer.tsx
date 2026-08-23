const githubLink = "https://github.com/shailendrapawar/";
const leetcodeLink = "https://leetcode.com/u/shailendrapawar/";
const linkedinLink = "https://www.linkedin.com/in/shailendra-pawar792/";

const socials = [
  { label: "GITHUB", href: githubLink },
  { label: "LINKEDIN", href: linkedinLink },
  { label: "LEETCODE", href: leetcodeLink },
];

export default function Footer() {
  return (
    <footer className="flex h-50 w-full flex-col items-center justify-center gap-5 bg-black text-gray-500">
      <section className="flex w-full max-w-100 items-center justify-center gap-3">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors hover:text-white"
          >
            {social.label}
          </a>
        ))}
      </section>

      <h3 className="text-sm">
        © 2025 Shailendra Pawar. All rights reserved.💀
      </h3>
    </footer>
  );
}
