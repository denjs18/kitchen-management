'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/aliments', label: 'Aliments', emoji: '📦' },
  { href: '/recettes', label: 'Recettes', emoji: '🍳' },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-xl">
      <div className="max-w-2xl mx-auto flex">
        {TABS.map(tab => {
          const active = path.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors
                ${active ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <span className="text-2xl">{tab.emoji}</span>
              <span className={`text-xs font-semibold ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-12 h-0.5 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
