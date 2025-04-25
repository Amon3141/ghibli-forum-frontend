import styles from './header.module.css';
import Link from 'next/link';

/**
 * Tailwind Reference:
 * db-white: dark-blue
 * shadow: box-shadow 0 1px 3px 0 rgba(0, 0, 0, 0.1);
 * container: width: 100%, max-width: 1280px
 * mx-auto: margin-x auto -> center horizontally
 * px-4: padding-x 1rem
 */

export default function Header() {
  return (
    <header className="
      sticky top-0
      bg-primary shadow py-8
      z-50
    ">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="font-bold text-2xl" href="/">風の谷の集い</Link>
        <nav className="font-bold flex items-center justify-end gap-8">
          <Link className={styles.nav_link} href="/">ホーム</Link>
          <Link className={styles.nav_link} href="/films/">作品別ページ</Link>
          <Link className={styles.nav_link} href="/">創作ギャラリー</Link>
          <Link className={styles.nav_link} href="/">ニュース・イベント</Link>
          <Link className={styles.nav_link} href="/">プロフィール</Link>
        </nav>
      </div>
    </header>
  )
}