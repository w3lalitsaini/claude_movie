import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";

const CATEGORIES = [
  {
    label: "Bollywood",
    href: "/movies?category=bollywood",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    count: "2000+ Movies",
    color: "#e50914",
  },
  {
    label: "Hollywood",
    href: "/movies?category=hollywood",
    img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    count: "5000+ Movies",
    color: "#1a6b3a",
  },
  {
    label: "South Hindi",
    href: "/movies?category=south-hindi",
    img: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&q=80",
    count: "1500+ Movies",
    color: "#7b2d8b",
  },
  {
    label: "Dual Audio",
    href: "/movies?category=dual-audio",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    count: "3000+ Movies",
    color: "#1a4a8a",
  },
  {
    label: "Web Series",
    href: "/movies?category=web-series",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    count: "800+ Series",
    color: "#8a4a1a",
  },
];

export default function MovieCategories() {
  return (
    <section className="py-10 border-t border-[#1a1a1a]">
      <SectionHeader title="Browse Categories" subtitle="Find your favorite genre" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative h-36 rounded-sm overflow-hidden border border-[#1a1a1a] hover:border-[#333]"
          >
            <Image
              src={cat.img}
              alt={cat.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#000]/60 group-hover:bg-[#000]/40 transition-colors" />
            {/* Color accent bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 opacity-80"
              style={{ backgroundColor: cat.color }}
            />
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <h3 className="font-display font-bold text-white text-lg uppercase tracking-widest group-hover:text-[#e50914] transition-colors">
                {cat.label}
              </h3>
              <p className="text-[#888] text-xs group-hover:text-[#aaa] transition-colors">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
