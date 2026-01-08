import React from 'react';
import TopNavigation from '../components/TopNavigation';
import Footer from '../components/Footer';
import UserBottomNavigation from '../components/UserBottomNavigation';
import { Mail } from 'lucide-react';

const Career = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavigation />

      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        
        {/* Main Header / Intro */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-gray-100 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#212c40] mb-6">Careers</h1>
            <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
                <p>
                    Happiness Car Rental India’s biggest cab rental company operating in 98 cities. We are working on our mission to provide world class cab experience to Indian consumers and are looking forward for likeminded people to join us. We are funded by top-notch VC firms and are based out of Pune ,Mumbai,Delhi,Indore If you love solving interesting problems and want to be a part of success story, send us your resumes to <a href="mailto:jobs@happinesscarrental.com" className="text-[#f48432] font-semibold hover:underline">jobs@happinesscarrental.com</a> and tell us why you are unique and how you can contribute. Alternatively, post you resume for an open position below:
                </p>
                <p>
                    Happiness car rental is India's premium online cab booking aggregator, providing customers with reliable and premium Intercity and Local car rental services. Over the last decade, we are uniquely placed as the largest chauffeur-driven Car Rental Company in India in terms of geographical reach. We are currently providing services in 1800+ cities across India and we are driven by the mission of making every Indian fall in love with road travel.
                </p>
                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-[#212c40]">
                    <p className="font-medium text-[#212c40]">
                        We are looking to hire talented and ambitious individual to manage Maharashtra for us. The position is based out of Pune/Mumbai . The position comprises to work with management to create and grow the entire Maharashtra region for happiness car rental by motivating the team under you, by effectively managing all sourcing partners and by ensuring that each and every business growth opportunity is rigorously followed and successfully executed on ground. Of course, the most important aspect will be that happiness car rental customers get the best Car Rental experience.
                    </p>
                </div>
            </div>
        </div>

        {/* Roles and Responsibilities Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-[#212c40] mb-6">Below are the specifics of this position:</h2>
            <h3 className="text-xl font-bold text-[#f48432] mb-4">Roles and Responsibilities</h3>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
                <div className="flex gap-4">
                    <span className="font-bold text-[#212c40] whitespace-nowrap">1}</span>
                    <p>
                        <span className="font-bold text-[#212c40]">Team Management:</span> We provide 24x7 services hence Operations run round the clock all 365 days. Hence it is necessary to keep the team very motivated and to ensure that proper processes are followed for seamless delivery of services to customers. It will be your responsibility that each of your team member performs to their fullest potential.
                    </p>
                </div>
                <div className="flex gap-4">
                    <span className="font-bold text-[#212c40] whitespace-nowrap">2}</span>
                    <p>
                        <span className="font-bold text-[#212c40]">Cab Vendor/Driver Management:</span> This is a core function and includes ensuring that each of the city in Maharashtra and for each of the product type has good number of reliable vendors. This would include expanding our vendor base, ensuring that they are properly trained on happiness car rental system and the Driver app and happiess car rental’s expectation of service delivery. Most importantly, it is must to keep all of them happy by creating a win-win partnership with them.
                    </p>
                </div>
                <div className="flex gap-4">
                    <span className="font-bold text-[#212c40] whitespace-nowrap">3}</span>
                    <p>
                         <span className="font-bold text-[#212c40]">Business Development:</span> This is the most important function where you will directly work with management to identify opportunities to grow business in terms of sourcing and launching new offerings. This will include reporting to management on the progress made for each of the opportunities and planning well for peak seasons where sufficient inventory is made available to make the most of the demand while ensuring the customer gets the excellent experience that they expect from HCR.
                    </p>
                </div>
                <div className="flex gap-4">
                    <span className="font-bold text-[#212c40] whitespace-nowrap">4}</span>
                    <p>
                        <span className="font-bold text-[#212c40]">Must-have Requirements:</span> Drive to take challenges to grow revenue . Love for Technology on how it can provide for consistency, scalability and reliability in our services. Passion for delivering excellent Customer experience. Experience in sourcing and business development and sound understanding of managing state/multicity vendor base. Bachelor’s degree ideally in Engineering or Management.
                    </p>
                </div>
            </div>
        </div>

        {/* Closing CTA */}
        <div className="bg-[#212c40] text-white p-8 rounded-3xl text-center">
            <p className="text-lg md:text-xl font-medium mb-4">
                If the above sounds exciting, the first step would be to apply by sending your resume to
            </p>
            <a 
                href="mailto:jobs@happinesscarrental.com" 
                className="inline-flex items-center gap-2 bg-[#f48432] hover:bg-[#d9732a] text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105"
            >
                <Mail className="w-5 h-5" />
                jobs@happinesscarrental.com
            </a>
        </div>

      </div>

      <Footer />
      <UserBottomNavigation />
    </div>
  );
};

export default Career;
