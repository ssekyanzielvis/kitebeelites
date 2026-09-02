'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import MediaRenderer from '@/components/MediaRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Heart } from 'lucide-react';
import Link from 'next/link';

type WhyDonate = Database['public']['Tables']['why_donate']['Row'];

export default function WhyDonatePage() {
  const [items, setItems] = useState<WhyDonate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await (supabase.from('why_donate') as any).select('*').order('display_order', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching why donate content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-red-500 animate-pulse" fill="currentColor" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Why We Donate</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light text-blue-100">
            Every contribution creates a ripple effect of positive change in our community. Here is how your support transforms lives.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Content is being updated. Please check back soon!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Media Side */}
                {item.media_url && (
                  <div className="w-full md:w-1/2 aspect-video md:aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative bg-gray-900">
                    <MediaRenderer src={item.media_url} alt={item.title || 'Impact area'} />
                  </div>
                )}
                
                {/* Content Side */}
                <div className={`w-full ${item.media_url ? 'md:w-1/2' : ''}`}>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6">
                    Impact Area {index + 1}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
                    {item.title}
                  </h2>
                  <div className="prose prose-lg text-gray-600">
                    <p className="whitespace-pre-wrap">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-24 text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold mb-4">Ready to make a difference?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in our mission. Whether it is a one-time gift or a recurring contribution, your support matters.
          </p>
          <Link 
            href="/donate" 
            className="inline-block bg-blue-600 text-white font-bold px-10 py-4 rounded-full hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
}
