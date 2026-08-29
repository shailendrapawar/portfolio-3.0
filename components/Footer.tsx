import { footerLinks } from "@/lib/data/socialItems";
import { AuthService } from "@/features/auth/service";

export default async function Footer() {
  // Fetched server-side (like the landing/About sections) so the name stays in
  // sync with the profile and the page remains cacheable.
  const profile = await AuthService.getPublicProfile();
  const name = profile?.name || "Shailendra Pawar";

  return (
    <footer className="flex h-50 w-full flex-col items-center justify-center gap-5 bg-black text-gray-500">
      <section className="flex w-full max-w-100 items-center justify-center gap-3">
        {footerLinks.map((social) => (
          <a
            key={social.key}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm uppercase transition-colors hover:text-white"
          >
            {social.label}
          </a>
        ))}
      </section>

      <h3 className="text-sm">
        © 2026 {name}. All rights reserved.💀
      </h3>
    </footer>
  );
}
