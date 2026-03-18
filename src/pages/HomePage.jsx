import React from 'react';
import CategorySection from '../components/Category/CategorySection';
import HeroSlider from "../components/HeroSlider";
import FeaturedProductBanner from "../components/FeaturedProductBanner";
import PopularProductsSection from "../components/PopularProductsSection";
import ServiceBlock from "../components/ServiceBlock";
import LatestArrivalsSection from '../components/LatestArrivalsSection';
import AllProductsSection from '../components/AllProductsSection';
import Footer from '../components/Footer';
import AdSection from '../components/AdSection/AdSection';
import BottomNav from '../components/BottomNav';


const HomePage = () => {
  return (
    <div className="flex flex-col gap-8">
      <HeroSlider />
      <CategorySection />
      <AdSection />
      <LatestArrivalsSection />
      <PopularProductsSection />
      <ServiceBlock />
      <FeaturedProductBanner />
      <AllProductsSection />
      <Footer />
      <div className="md:hidden h-16" />
      <BottomNav />
    </div>
  );
};

export default HomePage;