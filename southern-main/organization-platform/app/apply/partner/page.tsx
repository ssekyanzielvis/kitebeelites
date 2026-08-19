"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PartnerApplicationPage() {
  const [form, setForm] = useState({
    fullName: "",
    orgName: "",
    offer: "",
    email: "",
    nationality: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const { fullName, orgName, offer, email, nationality } = form;
    if (!fullName || !orgName || !offer || !email || !nationality) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    
    // Add 'as any' to fix the TypeScript error
    const { error } = await supabase.from("partner_applications").insert({
      full_name: fullName, 
      organization_name: orgName, 
      offer, 
      email, 
      nationality
    } as any); // <-- Add this

    if (error) {
      setError("Submission failed. Please try again.");
    } else {
      setSuccess(true);
      setForm({ fullName: "", orgName: "", offer: "", email: "", nationality: "" });
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto py-16 px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Become a Partner</h1>
          <form className="space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-semibold">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={form.fullName} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Organisation Name</label>
              <input 
                type="text" 
                name="orgName" 
                value={form.orgName} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">What to Offer</label>
              <textarea 
                name="offer" 
                value={form.offer} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Nationality</label>
              <input 
                type="text" 
                name="nationality" 
                value={form.nationality} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Application submitted successfully!</p>}
            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors" 
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}