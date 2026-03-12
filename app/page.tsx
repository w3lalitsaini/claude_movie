import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrendingMovies from "@/components/home/TrendingMovies";
import LatestUploads from "@/components/home/LatestUploads";
import MovieCategories from "@/components/home/MovieCategories";
import TopRated from "@/components/home/TopRated";
import PopularGenres from "@/components/home/PopularGenres";
import BlogSection from "@/components/home/BlogSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import AdUnit from "@/components/ui/AdUnit";

export const metadata: Metadata = {
  title: "AtoZ Movies – Your Ultimate Movie Destination",
  description:
    "Discover Bollywood, Hollywood, South Hindi Dubbed movies and web series.",
};

export default function HomePage() {
  return (
    <div className="pt-[30px]">
      <HeroSection />

      <div className="max-w-[1400px] mx-auto px-4 my-8">
        <AdUnit />
      </div>

      <div className="max-w-[1400px] mx-auto px-4">
        <TrendingMovies />
        <LatestUploads />

        <div className="my-10">
          <AdUnit layout="in-article" format="fluid" />
        </div>

        <MovieCategories />
        <TopRated />

        <div className="my-10">
          <AdUnit format="rectangle" />
        </div>

        <PopularGenres />
        <BlogSection />

        <div className="my-10">
          <AdUnit />
        </div>

        <NewsletterSection />
      </div>
    </div>
  );
}
