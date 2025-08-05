'use client';
import styles from './header.module.css';
import Link from 'next/link';

import GeneralButton from '@/components/ui/GeneralButton';
import ProfileIcon from '@/components/features/user/ProfileIcon';
import { FiHome } from "react-icons/fi";

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="
      bg-primary shadow py-5 px-6 sm:px-8 z-50
      flex items-center justify-center
    ">
      <div className="w-full flex items-center justify-between gap-1">
        <Link className="font-bold text-lg sm:text-xl tracking-wide" href="/">ジブリ掲示板</Link>
        <nav className={`
          ${user ? 'gap-5 sm:gap-6' : 'gap-3 sm:gap-4'}
          font-bold flex items-center justify-end
        `}>
          {/* <Link className={pathname === '/' ? styles.nav_link_selected : styles.nav_link} href="/"> */}
          <Link className={`
            rounded-full p-1.5 sm:p-2 color-textcolor/90
            transition-colors duration-200
            ${pathname === '/' ? 'bg-primary-dark/85' : 'hover:bg-primary-dark/85'
          }`} href="/">
            <FiHome className="text-lg sm:text-xl" />
          </Link>
          {user ? (
            <Link href="/profile">
              <ProfileIcon
                user={user}
                size={40}
                className={`
                  ${pathname.startsWith('/profile') ? 'outline-2 outline-primary-dark/85' : ''}
                `}
              />
            </Link>
          ) : (
            <GeneralButton className="bg-primary hover:bg-textcolor/90 hover:border-textcolor/90 border-textcolor/70 group">
              <Link href="/auth/login" className="group-hover:text-primary transition-colors duration-200">ログイン</Link>
            </GeneralButton>
          )}
        </nav>
      </div>
    </header>
  )
}