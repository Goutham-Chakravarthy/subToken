import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900/80 border-t border-white/10 py-12">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-extrabold text-teal-400 text-xl">TokenSub</div>
          <p className="mt-2 text-white/60">Tokenized Subscription Extension</p>
          <p className="mt-2 text-white/50">© {new Date().getFullYear()} TokenSub. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-white/80 font-semibold">Links</div>
          <Link href="/privacy" className="text-white/60 hover:text-white">Privacy</Link>
          <Link href="/terms" className="text-white/60 hover:text-white">Terms</Link>
          <Link href="/docs" className="text-white/60 hover:text-white">Docs</Link>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-white/80 font-semibold">Social</div>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">Twitter</a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">Discord</a>
          <a href="mailto:hello@example.com" className="text-white/60 hover:text-white">Email</a>
        </div>
      </div>
    </footer>
  );
}
