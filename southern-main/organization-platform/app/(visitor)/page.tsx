'use client';

import { useEffect, useState } from 'react';
import MediaRenderer from '@/components/MediaRenderer';
import Link from 'next/link';
import Image from 'next/image';
import HelloSlides from '@/components/HelloSlides';
import ImageCard from '@/components/ImageCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';
import { ArrowRight, Heart } from 'lucide-react';
import { useAppStore, useHydratedTheme } from '@/lib/store';

interface AboutContent {
  id: string;
  description: string;
  image_url: string | null;
}

interface VisionMission {
  id: string;
  image_url: string | null;
  statement: string;
}

interface Objective {
  id: string;
  image_url: string | null;
  statement: string;
}

interface Program {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

interface Achievement {
  id: string;
  image_url: string;
  title: string;
  description: string;
  achievement_date: string;
}

interface CoreValue {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

interface NewsItem {
  id: string;
  image_url: string;
  title: string;
  description: string;
  published_date: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
  description: string | null;
}

interface ActiveSponsor {
  id: string;
  full_name: string;
  logo_url: string | null;
  message: string | null;
  amount_or_item: string;
  programs: {
    title: string;
  };
}

interface FeaturedGraduate {
  id: string;
  full_name: string;
  profile_image_url: string | null;
  course: string;
  graduation_year: number;
}

export default function HomePage() {
  const { theme } = useHydratedTheme();
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState<AboutContent[]>([]);
  const [vision, setVision] = useState<VisionMission | null>(null);
  const [mission, setMission] = useState<VisionMission | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [activeSponsors, setActiveSponsors] = useState<ActiveSponsor[]>([]);
  const [featuredGraduates, setFeaturedGraduates] = useState<FeaturedGraduate[]>([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [
        aboutData,
        visionData,
        missionData,
        objectivesData,
        programsData,
        achievementsData,
        coreValuesData,
        newsData,
        galleryData,
        sponsorsData,
        graduatesData,
      ] = await Promise.all([
        (supabase.from('about_us') as any).select('*').eq('is_active', true).limit(1),
        (supabase.from('vision') as any).select('*').eq('is_active', true).single(),
        (supabase.from('mission') as any).select('*').eq('is_active', true).single(),
        (supabase.from('objectives') as any).select('*').eq('is_active', true).order('order_index').limit(3),
        (supabase.from('programs') as any).select('*').eq('is_active', true).eq('is_featured', true).limit(2),
        (supabase.from('achievements') as any).select('*').eq('is_active', true).eq('is_featured', true).limit(3),
        (supabase.from('core_values') as any).select('*').eq('is_active', true).eq('is_featured', true).limit(3),
        (supabase.from('news') as any).select('*').eq('is_active', true).eq('is_featured', true).order('published_date', { ascending: false }).limit(3),
        (supabase.from('gallery') as any).select('*').eq('is_active', true).eq('is_featured', true).limit(6),
        (supabase.from('program_sponsorships') as any).select(`
          id,
          full_name,
          logo_url,
          message,
          amount_or_item,
          programs!inner (
            title,
            is_active,
            end_date
          )
        `).eq('status', 'approved'),
        (supabase.from('graduates') as any).select('id, full_name, profile_image_url, course, graduation_year').eq('is_active', true).eq('is_featured', true).order('graduation_year', { ascending: false }).limit(4)
      ]);

      setAbout(aboutData.data || []);
      setVision(visionData.data);
      setMission(missionData.data);
      setObjectives(objectivesData.data || []);
      setPrograms(programsData.data || []);
      setAchievements(achievementsData.data || []);
      setCoreValues(coreValuesData.data || []);
      setNews(newsData.data || []);
      setGallery(galleryData.data || []);
      setFeaturedGraduates(graduatesData.data || []);
      
      // Filter active sponsors
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const validSponsors = (sponsorsData?.data || []).filter((sponsor: any) => {
        const program = sponsor.programs;
        if (!program || !program.is_active) return false;
        if (program.end_date) {
          const endDate = new Date(program.end_date);
          if (endDate < today) return false;
        }
        return true;
      });

      setActiveSponsors(validSponsors);

    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hello Slides Section */}
      <HelloSlides />

      {/* About Us Section */}
      {about.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About Us</h2>
            <div className="relative w-[80vw] h-[80vh] mx-auto rounded-lg overflow-hidden shadow-2xl">
              {about[0].image_url && (
                <MediaRenderer                   src={about[0].image_url}
                  alt="About Us"
                  fill
                  className="object-cover"
                />
              )}
              {/* Description overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center p-8 md:p-12">
                <div className="text-center max-w-4xl">
                  <p className="text-white text-lg md:text-2xl leading-relaxed mb-6">
                    {about[0].description}
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center text-white px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Learn More <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vision Section */}
      {vision && (
        <section className="py-16 px-4 bg-black/5">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Vision</h2>
            <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
              {vision.image_url && (
                <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                  <MediaRenderer                     src={vision.image_url}
                    alt="Our Vision"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="w-full md:w-1/2">
                <p className="text-xl leading-relaxed italic opacity-80">
                  "{vision.statement}"
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mission Section */}
      {mission && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Mission</h2>
            <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
              {mission.image_url && (
                <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                  <MediaRenderer                     src={mission.image_url}
                    alt="Our Mission"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="w-full md:w-1/2">
                <p className="text-xl leading-relaxed italic opacity-80">
                  "{mission.statement}"
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Objectives Section */}
      {objectives.length > 0 && (
        <section className="py-16 px-4 bg-black/5">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {objectives.map((objective) => (
                <div key={objective.id} className="rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow bg-white/5 border border-current border-opacity-10">
                  {objective.image_url && (
                    <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
                      <MediaRenderer                         src={objective.image_url}
                        alt="Objective"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="leading-relaxed opacity-90">{objective.statement}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Programs Section */}
      {programs.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Programs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-w-7xl mx-auto">
              {programs.map((program) => (
                <ImageCard
                  key={program.id}
                  imageUrl={program.image_url}
                  title={program.title}
                  description={program.description}
                />
              ))}
            </div>
            {programs.length >= 2 && (
              <div className="text-center">
                <Link
                  href="/programs"
                  className="inline-flex items-center text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  View All Programs <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="py-16 px-4 bg-black/5">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Achievements</h2>
            <div className="grid grid-cols-1 gap-8 mb-8 max-w-3xl mx-auto">
              <ImageCard
                key={achievements[0].id}
                imageUrl={achievements[0].image_url}
                title={achievements[0].title}
                description={achievements[0].description}
              />
            </div>
            <div className="text-center">
              <Link
                href="/achievements"
                className="inline-flex items-center text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                style={{ backgroundColor: theme.primaryColor }}
              >
                View All Achievements <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Core Values Section */}
      {coreValues.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-w-7xl mx-auto">
              {coreValues.map((value) => (
                <ImageCard
                  key={value.id}
                  imageUrl={value.image_url}
                  title={value.title}
                  description={value.description}
                />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/core-values"
                className="inline-flex items-center text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                style={{ backgroundColor: theme.primaryColor }}
              >
                View All Values <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-16 px-4 bg-black/5">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {gallery.map((image) => (
                <div key={image.id} className="relative aspect-square group overflow-hidden rounded-lg">
                  {image.image_url ? (
                    <MediaRenderer                       src={image.image_url}
                      alt={image.description || 'Gallery image'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700 transition-transform duration-300 group-hover:scale-110" />
                  )}
                  {image.description && (
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <p className="text-white text-center text-sm">{image.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/gallery"
                className="inline-flex items-center text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                style={{ backgroundColor: theme.primaryColor }}
              >
                View Full Gallery <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* News Section */}
      {news.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {news.map((item) => (
                <ImageCard
                  key={item.id}
                  imageUrl={item.image_url}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/news"
                className="inline-flex items-center text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                style={{ backgroundColor: theme.primaryColor }}
              >
                View All News <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Graduates Section */}
      {featuredGraduates.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Graduates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
              {featuredGraduates.map((graduate) => (
                <div key={graduate.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    {graduate.profile_image_url ? (
                      <MediaRenderer src={graduate.profile_image_url} alt={graduate.full_name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <span className="text-6xl text-gray-400 font-bold">{graduate.full_name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                      <h3 className="text-xl font-bold mb-1 line-clamp-1">{graduate.full_name}</h3>
                      <p className="text-white/90 font-medium text-xs mb-1">Class of {graduate.graduation_year}</p>
                      <p className="text-gray-300 text-xs line-clamp-2">{graduate.course}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {featuredGraduates.length >= 3 && (
              <div className="text-center">
                <Link
                  href="/graduates"
                  className="inline-flex items-center text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  View All Graduates <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sponsors Section */}
      {activeSponsors.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-gray-100 border-t border-gray-200">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 rounded-full mb-4" style={{ backgroundColor: `${theme.primaryColor}20` }}>
                <Heart className="w-8 h-8 fill-current" style={{ color: theme.primaryColor }} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Generous Sponsors</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                We extend our deepest gratitude to the incredible businesses and individuals making our programs possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeSponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: theme.primaryColor }} />
                  
                  <div className="flex items-start gap-4 mb-4">
                    {sponsor.logo_url ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 p-2 bg-white flex items-center justify-center shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sponsor.logo_url} alt={sponsor.full_name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center shadow-sm">
                        <span className="text-gray-400 font-bold text-xl">{sponsor.full_name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-2">{sponsor.full_name}</h3>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
                        {sponsor.programs.title}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {sponsor.message && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-600 italic border-l-4" style={{ borderColor: theme.primaryColor }}>
                        "{sponsor.message}"
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 mt-auto border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Contribution</p>
                    <p className="font-semibold text-gray-800">{sponsor.amount_or_item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/programs"
                className="inline-flex items-center text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Join them and Sponsor a Program! <ArrowRight className="ml-2 w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action - Donate */}
      <section className="py-16 px-4 bg-black/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Make a Difference Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-80">
            Your support helps us continue our mission to create positive change in our community.
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity font-bold text-lg shadow-lg hover:shadow-xl"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Donate Now <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
