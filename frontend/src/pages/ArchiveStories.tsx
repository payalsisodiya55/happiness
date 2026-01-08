import React from 'react';
import TopNavigation from '../components/TopNavigation';
import Footer from '../components/Footer';
import UserBottomNavigation from '../components/UserBottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mountain, Palmtree, Landmark, Sun, Compass } from 'lucide-react';

const ArchiveStories = () => {
    
    // Data structure for the content to make rendering clean and modular
    const sections = [
        {
            title: "North India",
            description: "North India is a medley of kingdoms, cultures, traditions, architectural marvels, and a spectrum of varied landscapes. Ranging from the snow-capped Himalayan crown to the agriculturally rich plains of Punjab, the arid deserts of Rajasthan, the contrasting extremes of Old and New Delhi, the wonder of the world Taj Mahal, and the ancient cities of Haridwar and Varanasi set along the banks of holy River Ganges, North India offers a continuum of unique experiences.",
            subsections: [
                {
                    title: "Golden Triangle",
                    content: "The most popular tour of India, the Golden Triangle tour, includes a visit to Delhi, the capital of India; Agra, land of the world-famous Taj Mahal; and Jaipur, the pink capital city of Rajasthan."
                },
                {
                    title: "Agra",
                    content: "The Mughal city founded in the 16th century is one of the most visited tourist cities of India. Agra is home to magnificent architectural masterpieces such as the beautiful wonder of the world, Taj Mahal, and the splendid Agra Fort. The artisans of Agra still practice the Mughal art of marble inlay work, creating magical beauty with marble."
                },
                {
                    title: "Jaipur",
                    content: "Is an exuberance of colours, folk dances, and traditional arts and crafts. This princely city is home to a wonderful collection of palatial masterpieces such as the City Palace, Amber Fort, Jal Mahal, and Hawa Mahal. One of the most well-planned cities of India, Jaipur is built in 9 rectangular sectors symbolising 9 divisions of the universe, as per Indian cosmology."
                },
                {
                    title: "Delhi",
                    content: "The power seat of India, is divided into two parts - Old and New Delhi. The walled city of Old Delhi narrates the history of the city, whilst the contemporary New Delhi reflects the cosmopolitan face of India. From the chaotic streets of Chandni Chowk to the imposing features of Lutyen's Delhi, this capital city encapsulates the extremes of historic and modern India."
                }
            ]
        },
        {
            title: "Forts & Palaces of Rajasthan",
            description: "India's forts and palaces are the country's treasured manuscripts narrating the saga of this Land of Maharajas. The desert state of Rajasthan is where history comes alive in the form of art, architecture, sculptures, and cultures that bring thousands of heritage lovers to India. Rajasthan houses the largest number of forts and palaces in the world.",
            subsections: [
                {
                    title: "Jodhpur",
                    content: "The blue-hued city of Rajasthan houses the splendid Mehrangarh Fort, one of the most impressive and formidable structures in Rajasthan. Jodhpur is also home to the magnificent Umaid Bhawan Palace, a fine example of early 20th-century palatial architecture in India."
                },
                {
                    title: "Udaipur",
                    content: "The lake city surrounded by Aravalli ranges, is regarded as one of the most romantic cities of Rajasthan. The majestic City Palace in Udaipur is one of the largest palace complexes in Rajasthan. Taj Lake Palace, set in the middle of Lake Pichola, is an 18th-century white marble and mosaic palace which is today a luxury hotel and the landmark property of Udaipur."
                },
                {
                    title: "Jaisalmer",
                    content: "The city of golden sand dunes, in the far west of Rajasthan, is popularly called 'the Golden City of India'. Jaisalmer Fort is the second oldest fort of Rajasthan, encapsulating five beautiful palaces. The grand havelis of Jaisalmer, featuring intricate designs and luxurious interiors, are fine examples of architectural brilliance of the Rajput Maharajas."
                },
                {
                    title: "Chittaurgarh",
                    content: "The tragic historical fort of Rajasthan, was occupied for more than 800 years before being abandoned in the 16th century. The fort was invaded thrice and on all three occasions the civilians of the region chose to sacrifice their lives rather than leading a life of submission. Inside the fort are ruins of erstwhile palaces and temples still in active worship."
                }
            ]
        },
        {
            title: "Himalayan Beauty",
            description: "The Himalayas extend over 2,500km in east-west and between a range of 250-425km in north-south direction. Formed in three parallel ranges, the Himalayas extend over more than one country. Himalayan tours can be designed to suit diverse interests including adventure, culture, wellness, spiritual, wildlife, walking, or leisure tours.",
            subsections: [
                {
                    title: "Ladakh",
                    content: "Renowned for its remote mountain beauty, is strongly influenced by Tibetan culture and popularly called 'Little Tibet' of India. Famous as the adventure capital of Himalayas, Ladakh offers mountain climbing, cycling, jeep safaris, yak safaris, mountaineering, river rafting, village walks, and trekking."
                },
                {
                    title: "Kumaon",
                    content: "Towered by the highest Himalayan ranges in India, is a confluence of cultures, architectural and archeological wonders such as Jageshwar temple, Katarmal sun temple, prehistoric rock art, and charming local villages blending British and Kumaoni architecture. Gems of Kumaon region include the first British hill station of Almora, the lake town of Nainital, and the wilderness of Corbett National Park."
                },
                {
                    title: "Manali",
                    content: "Nestled in the Kullu valley, surrounded by snow-capped peaks, is known for its flourishing orchard industry, as a trailhead for treks and for heli-skiing in the valley."
                },
                {
                    title: "Shimla",
                    content: "The former summer capital of British India, is set amidst snow-capped mountains, which offer stunning views of the Himalayas. Shimla is an architectural legacy of the British Raj, with mall, churches, theatre, and half-timbered bungalows peppered around town."
                },
                {
                    title: "Srinagar",
                    content: "Set along the banks of River Jhelum in Kashmir valley, was aptly named by the Mughals as 'Paradise on Earth'. Set like a jeweled crown on the map of India, Kashmir changes its hues with seasons - in winter, when snow carpets the mountains, there is skiing and sledge riding along the gentle slopes; in spring and summer, the honey-dewed orchards, rippling lakes make the valley breathtakingly beautiful."
                }
            ]
        },
        {
            title: "In the Footsteps of Buddha",
            description: "Follow the path of enlightenment, in the footsteps of Lord Buddha, imprinted in the various Buddhist pilgrimage sites associated with important milestones in the life of Lord Buddha.",
            subsections: [
                {
                    title: "Sravasti (Uttar Pradesh)",
                    content: "Founded by the mythological King Sravast, this land hosted Lord Buddha and His disciples for 24 years. Lord Buddha is believed to have performed the only miracles of His life to convince the non-believers at Sravasti."
                },
                {
                    title: "Nalanda (Bihar)",
                    content: "Treasures the ruins of the first residential international university of the world, where more than 10,000 monk students studied and lived. Though Lord Buddha visited Nalanda several times during his lifetime, this famous center of Buddhist learning shot to fame much later, during 5th-12th centuries."
                },
                {
                    title: "Rajgir (Bihar)",
                    content: "The town where Lord Buddha stayed for 12 years and delivered many of His sermons. It was here that the teachings of Lord Buddha were recorded in writing for the first time."
                },
                {
                    title: "Bodhgaya (Bihar)",
                    content: "Was the place where Prince Siddhartha attained enlightenment and became Lord Buddha. It was here that Lord Buddha entered into meditation after being moved by the sufferings of mankind. Bodhgaya is often visited by the Dalai Lama and other Lamas."
                },
                {
                    title: "Sarnath (Uttar Pradesh)",
                    content: "Was the place where Lord Buddha, after attaining enlightenment, preached his first sermon to his five disciples."
                }
            ]
        },
        {
            title: "Maharashtra",
            description: "The Land of the Marathas, Maharashtra is the 2nd most populated and the 3rd largest state in India. It is a major state in India which has tons of places and attractions a tourist must explore.",
            subsections: [
                {
                    title: "Mumbai",
                    content: "Formerly known as 'Bombay', Mumbai is the largest city and the capital of Maharashtra. The city is often nicknamed the Manhattan of India and is home to the famous Indian film industry or 'Bollywood'. Attractions include Gateway of India, Elephanta Caves, Marine Drive, Chhatrapati Shivaji Terminus, Haji Ali Shrine, Sanjay Gandhi National Park, and Global Vipassana Pagoda."
                },
                {
                    title: "Aurangabad",
                    content: "Is named after the Mughal emperor Aurangzeb and is one of the most prominent tourist places in Maharashtra. The city is famous for its historical monuments and the ancient caves of Ajanta and Ellora which are a national heritage site."
                },
                {
                    title: "Kolhapur",
                    content: "The city of Kolhapur is located at the banks of the Panchganga River and one of the Princely states of the Marathas. The city is considered to be the heart of the Maratha Empire and is famous for its various historical monuments and cultural heritage of the Marathi people."
                },
                {
                   title: "Mahabaleshwar",
                   content: "Mahabaleshwar is a hill station in Maharashtra and is located at the Western Ghats. The average elevation of the place is approximately 1,353 meters above sea level and is the source of the Krishna River. The city is a famous summer retreat for the people in Mumbai."
                },
                 {
                   title: "Matheran",
                   content: "Another great hill station located at the Western Ghats in the state of Maharashtra, Matheran is located at an elevation of approximately 800 meters above sea level. The city is famous for its cool and less humid climate and is a popular summer retreat for the population of Maharashtra."
                },
                {
                   title: "Pune",
                   content: "The land of Peshwas, Pune has held an important position; both culturally and historically since the times of Chhatrapati Shivaji Maharaj. In the present times, it is an important educational, cultural and economic hub in Maharashtra. Famous examples include Shaniwarwada, Shivneri Fort, Aga Khan Palace, and Sinhagad Fort."
                },
                {
                   title: "Nashik",
                   content: "Located in the North-Western region of Maharashtra and on the banks of the river Godavari. The place is famous for being one of the cities that host the Kumbha Mela of India once every 12 years. The town has a huge number of tourist attractions including museums, gardens, and a huge array of ancient Temples."
                }
            ]
        },
         {
            title: "Goa",
            description: "Goa is the most popular destination for beachside holidays in India. It is the smallest state in the country by area, located on the southwestern coast. The region is blessed with beautiful scenic views, magnificent beaches, glorious natural landforms, tons of popular tourist attractions, and much more.",
            subsections: [
                {
                    title: "About Goa",
                    content: "Now, Goa is one of India's most visited tourist places, with visitors flocking to the region all year round. Alongside domestic travelers, tourists from around the globe visit Goa to witness its rich flora and fauna, incredible white-sand beaches, religious and historical landmarks, vibrant nightlife, delicious regional cuisine, and much more."
                },
                {
                    title: "Adventure & Culture",
                    content: "Goa has everything you would hope for in terms of adventure. It is a paradise for tourists who want to participate in exciting activities during their trip, like beach hopping, water sports, dolphin spotting, hot-air ballooning, etc. Adding to its aspect of fun activities, tourists can also spend time exploring the local culture and tradition, trying out street food, going on a shopping spree, and much more during their visit."
                }
            ]
        }
    ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavigation />

      {/* Hero Section */}
      <div className="bg-[#212c40] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f48432] rounded-full opacity-10 blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full opacity-10 blur-3xl transform -translate-x-16 translate-y-16"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Archives Stories</h1>
          <div className="w-24 h-1.5 bg-[#f48432] mx-auto rounded-full mb-8"></div>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Welcome to India: The Land of Euphoria. India is a medley of fascinating colours and cultures, an historical legacy, a canvas of architectural masterpieces, and an extravagant exuberance of royal splendour.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 flex-grow -mt-10 relative z-20">
        
        <div className="grid grid-cols-1 gap-12">
            {sections.map((section, index) => (
                <div key={index} className="scroll-mt-24">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-[#212c40] rounded-xl text-white">
                            {/* Dynamic Icon selection could be done, for now using generic map-pin/compass */}
                            <Compass className="w-6 h-6 text-[#f48432]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#212c40]">{section.title}</h2>
                    </div>
                    
                    <Card className="border-none shadow-lg overflow-hidden bg-white">
                        <CardContent className="p-8">
                             <p className="text-gray-600 text-lg mb-8 leading-relaxed italic border-l-4 border-[#f48432] pl-4 bg-orange-50/50 py-4 rounded-r-lg">
                                {section.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {section.subsections.map((sub, subIndex) => (
                                    <div key={subIndex} className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#212c40] mb-3 flex items-start gap-2">
                                            <MapPin className="w-5 h-5 text-[#f48432] mt-1 flex-shrink-0" />
                                            {sub.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed text-justify">
                                            {sub.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>

      </div>

      <Footer />
      <UserBottomNavigation />
    </div>
  );
};

export default ArchiveStories;
