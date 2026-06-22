'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShoppingList } from '@/hooks/useShoppingList';

const TABS = [
  { href: '/aliments', label: 'Aliments', emoji: '📦' },
  { href: '/recettes', label: 'Recettes', emoji: '🍳' },
  { href: '/courses', label: 'Courses', emoji: '🛒' },
  { href: '/dashboard', label: 'Dashboard', emoji: '📊' },
];

export default function BottomNav() {
  const path = usePathname();
  const { uncheckedCount } = useShoppingList();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-xl">
      <div className="max-w-2xl mx-auto flex">
        {TABS.map(tab => {
          const active = path.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors relative
                ${active ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <span className="text-2xl relative">
                {tab.emoji}
                {tab.href === '/courses' && uncheckedCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {uncheckedCount > 99 ? '99+' : uncheckedCount}
                  </span>
                )}
              </span>
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
