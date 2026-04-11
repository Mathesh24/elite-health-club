import Hero from "@/components/sections/Hero";
import Amenities from "@/components/sections/Amenities";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Membership from "@/components/sections/Membership";
import Testimonials from "@/components/sections/Testimonials";
import Booking from "@/components/sections/Booking";

export default function Home() {
  return (
    <>
      <Hero />
      <Amenities />
      <About />
      <Gallery />
      <Membership />
      <Testimonials />
      <Booking />
    </>
  );
}
