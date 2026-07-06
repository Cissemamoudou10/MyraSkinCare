import Hero from "@/components/sections/Hero";
import Marquee from "@/components/layout/Marquee";
import {
  Reassurance,
  Concerns,
  Collection,
  NewArrivals,
  Editorial,
  BestSellers,
  PartnerBrands,
  Reviews,
  About,
  Journal,
} from "@/components/sections/HomeSections";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Reassurance />
      <Concerns />
      <Collection />
      <NewArrivals />
      <Editorial />
      <BestSellers />
      <PartnerBrands />
      <Reviews />
      <About />
      <Journal />
    </>
  );
}
