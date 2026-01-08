import TopNavigation from '../components/TopNavigation';
import HeroSection from '../components/HeroSection';

import WhyChooseUs from '../components/WhyChooseUs';
import FeaturesSection from '../components/FeaturesSection';
import OurServices from '../components/OurServices';

import RoutesTable from '../components/RoutesTable';
import AppDownloadSection from '../components/AppDownloadSection';
import Footer from '../components/Footer';
import UserBottomNavigation from '../components/UserBottomNavigation';
import MobileHome from '../components/MobileHome';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* DESKTOP VIEW */}
      <div className="hidden md:block">
        <TopNavigation />
        <HeroSection />

        <WhyChooseUs />
        <FeaturesSection />
        <OurServices />

        <div className="pb-24 md:pb-0">
          <Footer />
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden">
        <MobileHome />
      </div>

      <UserBottomNavigation />
    </div>
  );
};

export default Index;