import Hero from '@/components/features/home/Hero';
import Trending from '@/components/features/home/Trending';

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <Trending />
    </main>
  );
}