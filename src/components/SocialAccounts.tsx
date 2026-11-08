import { Github, Linkedin, Mail, Send } from "lucide-react";
import { gmailCompose } from "../lib/contact";
export function SocialAccounts({ className = "" }: { className?: string }) {
  const accounts = [
    { name: "GitHub", href: "https://github.com/dorrsakh", Icon: Github },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/dorsa-khalili",
      Icon: Linkedin,
    },
    { name: "Gmail", href: gmailCompose(), Icon: Mail },
    { name: "Telegram", href: "https://t.me/dorrsakhaili", Icon: Send },
  ];
  return (
    <div
      className={`social-accounts ${className}`}
      aria-label="Social accounts"
    >
      {accounts.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          aria-label={`Dorsa on ${name}`}
          title={name}
          target="_blank"
          rel="noreferrer"
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  );
}
