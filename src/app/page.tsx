import Hero from "@/components/sections/Hero";
import Amenities from "@/components/sections/Amenities";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Membership from "@/components/sections/Membership";
import ClubFeatures from "@/components/sections/ClubFeatures";
// import Testimonials from "@/components/sections/Testimonials";
import Booking from "@/components/sections/Booking";

export default function Home() {
  return (
    <>
      <Hero />
      <Amenities />
      <About />
      <Gallery />
      <Membership />
      <ClubFeatures />
      {/* <Testimonials /> */}
      <Booking />
    </>
  );
}
