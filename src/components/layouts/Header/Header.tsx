'use client';

import styles from './header.module.css';
import Link from 'next/link';

import GeneralButton from '@/components/ui/GeneralButton';
import ProfileIcon from '@/components/features/user/ProfileIcon';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="
      bg-primary shadow py-5 px-10 z-50
      flex items-center justify-center
    ">
      <div className="w-full flex items-center justify-between">
        <Link className="font-bold text-2xl" href="/">風の谷の集い</Link>
        <nav className="font-bold flex items-center justify-end gap-8">
          <Link className={pathname === '/' ? styles.nav_link_selected : styles.nav_link} href="/">ホーム</Link>
          {user ? (
            <Link href="/profile">
              <ProfileIcon
                user={user}
                size={40}
                className={`${pathname.startsWith('/profile') ? 'outline-2 outline-stone-200' : ''}`}
              />
            </Link>
          ) : (
            <GeneralButton className="bg-primary hover:bg-textcolor/90 hover:border-textcolor/90 border-textcolor/70 font-normal group">
              <Link href="/auth/login" className="group-hover:text-primary group-hover:font-normal transition-colors duration-200">ログイン</Link>
            </GeneralButton>
          )}
        </nav>
      </div>
    </header>
  )
}