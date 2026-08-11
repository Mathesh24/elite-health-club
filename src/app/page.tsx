import Hero from "@/components/sections/Hero";
import Amenities from "@/components/sections/Amenities";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Membership from "@/components/sections/Membership";
import ClubFeatures from "@/components/sections/ClubFeatures";
import Booking from "@/components/sections/Booking";

export default function Home() {
  return (
    <>
      <Hero />
      <Amenities />
      <Gallery />
      <About />
      <Membership />
      <ClubFeatures />
      <Booking />
    </>
  );
}
