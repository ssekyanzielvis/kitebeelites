'use client';

import { useEffect, useState } from 'react';
import MediaRenderer from '@/components/MediaRenderer';
import Image from 'next/image';
import TruncatedText from '@/components/TruncatedText';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';

interface AboutContent {
  id: string;
  image_url: string | null;
  description: string;
  order_index: number;
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
  order_index: number;
}

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent[]>([]);
  const [vision, setVision] = useState<VisionMission | null>(null);
  const [mission, setMission] = useState<VisionMission | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data: aboutData } = await supabase
        .from('about_us')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      const { data: visionData } = await supabase
        .from('vision')
        .select('*')
        .eq('is_active', true)
        .single();
      
      const { data: missionData } = await supabase
        .from('mission')
        .select('*')
        .eq('is_active', true)
        .single();
      
      const { data: objectivesData } = await supabase
        .from('objectives')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (aboutData) setContent(aboutData);
      if (visionData) setVision(visionData);
      if (missionData) setMission(missionData);
      if (objectivesData) setObjectives(objectivesData);
    } catch (error) {
      console.error('Error fetching about content:', error);
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
    <div className="w-full py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">About Us</h1>
        
        {/* About Us Content - Alternating layout */}
        <div className="space-y-12 mb-16">
          {content.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-8 animate-fade-in`}
            >
              {item.image_url && (
                <div className="w-full md:w-1/2">
                  <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg border border-current border-opacity-10">
                    <MediaRenderer                       src={item.image_url}
                      alt="About us"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className={`w-full ${item.image_url ? 'md:w-1/2' : 'md:w-full'}`}>
                <div className="text-lg leading-relaxed whitespace-pre-line opacity-80">
                  <TruncatedText text={item.description} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vision Section */}
        {vision && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Vision</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {vision.image_url && (
                <div className="w-full md:w-1/2">
                  <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg border border-current border-opacity-10">
                    <MediaRenderer                       src={vision.image_url}
                      alt="Our Vision"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className={`w-full ${vision.image_url ? 'md:w-1/2' : 'md:w-full'} bg-black/5 p-8 rounded-lg`}>
                <div className="text-xl leading-relaxed whitespace-pre-line opacity-90">
                  <TruncatedText text={vision.statement} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mission Section */}
        {mission && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {mission.image_url && (
                <div className="w-full md:w-1/2">
                  <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg border border-current border-opacity-10">
                    <MediaRenderer                       src={mission.image_url}
                      alt="Our Mission"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className={`w-full ${mission.image_url ? 'md:w-1/2' : 'md:w-full'} bg-black/5 p-8 rounded-lg`}>
                <div className="text-xl leading-relaxed whitespace-pre-line opacity-90">
                  <TruncatedText text={mission.statement} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Objectives Section */}
        {objectives.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Our Objectives</h2>
            <div className="space-y-8">
              {objectives.map((objective) => (
                <div
                  key={objective.id}
                  className="flex flex-col md:flex-row items-center gap-8 bg-black/5 rounded-lg shadow-md p-6"
                >
                  {objective.image_url && (
                    <div className="w-full md:w-1/3">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-current border-opacity-10">
                        <MediaRenderer                           src={objective.image_url}
                          alt="Objective"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className={`w-full ${objective.image_url ? 'md:w-2/3' : 'md:w-full'}`}>
                    <div className="text-lg leading-relaxed whitespace-pre-line opacity-80">
                      <TruncatedText text={objective.statement} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.length === 0 && !vision && !mission && objectives.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl opacity-50">No content available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
