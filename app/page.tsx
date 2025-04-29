

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Brain, Sparkles, Edit3 } from 'lucide-react';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';


import AppHeader from '@/components/landing/AppHeader';
import TypingHeroText from '@/components/landing/TypingHeroText';
import DemoVideo from '@/components/landing/DemoVideo';
import AnimatedSection from '@/components/landing/AnimatedSection';
// import { Slide } from '@mui/material';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });

// --- SEO Metadata ---


const baseUrl = 'https://reflectai-9qg9.vercel.app';

export const metadata: Metadata = {
  // --- Core Metadata ---
  title: 'ReflectAI: AI Journaling App for Insights & Personal Growth', // More concise, keyword-focused, benefit-driven
  description: 'Unlock deeper self-understanding with ReflectAI, your AI-powered journaling app. Analyze emotions, track progress, and gain personal insights for mental wellness & growth. Start free!', // ~158 chars, keywords, benefits, CTA

  // --- Keywords (Low impact on Google, but comprehensive) ---
  keywords: [
    'journaling',
    'ai journaling',
    'journaling app',
    'digital journal',
    'online journal',
    'personal growth',
    'self reflection',
    'mental wellness',
    'sentiment analysis',
    'mood tracking',
    'guided journaling',
    'reflection app',
    'ai therapy companion', // Explore related concepts
    'thought diary',
    'emotional intelligence app',
  ],

  // --- Author & Generator ---
  authors: [{ name: 'ReflectAI Team' /* or your name/company */, url: baseUrl }], // Link to author/site
  creator: 'ReflectAi ltd', // Specific creator if different
  publisher: 'Fonji Daniel', // Often same as creator/company
  generator: 'Next.js', // Indicates the technology used

  // --- Canonical URL & Alternates ---
  metadataBase: new URL(baseUrl), // Sets the base for resolving paths
  alternates: {
    canonical: '/', // Relative to metadataBase, resolves to `${baseUrl}/`
    // languages: { // If you add translations later
    //   'en-US': '/en-US',
    //   'es-ES': '/es-ES',
    // },
  },

  // --- Robots Meta Tags (Fine-grained control for crawlers) ---
  robots: {
    index: true, // Allow indexing this page
    follow: true, // Allow following links from this page
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large', // Allow large image previews in Discover, etc.
      'max-snippet': -1, // No limit on snippet length (Google decides)
      'max-video-preview': -1, // No limit on video preview
    },
  },

  // --- Icons (Essential for Branding) - UNCOMMENT and ensure files exist in /public ---
  // icons: {
  //    icon: [ // Provide multiple sizes/formats
  //        { url: '/favicon.ico', sizes: 'any' }, // Standard favicon
  //        { url: '/icon.svg', type: 'image/svg+xml' }, // Modern SVG icon
  //        { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
  //        { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
  //    ],
  //    apple: '/apple-touch-icon.png', // For iOS home screens (180x180 recommended)
  //    // other: [ // Less common, but potentially useful
  //    //   { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
  //    //   { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
  //    // ],
  // },

  // --- Web App Manifest (for PWA features) ---
  // manifest: '/manifest.json', // Ensure manifest.json exists in /public

  // --- Theme Color (for mobile browser UI) ---
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' }, // light theme main color
    { media: '(prefers-color-scheme: dark)', color: '#1a202c' }, // dark theme main color (dark purple/indigo)
  ],

  // --- Open Graph (for Facebook, LinkedIn, etc.) ---
  openGraph: {
    title: 'ReflectAI: AI Journaling for Deeper Self-Understanding', // Slightly different title for social engagement
    description: 'Transform your thoughts into insights. ReflectAI uses AI to analyze your journal entries, track emotions, and guide personal growth. ✨', // More engaging description
    url: baseUrl,
    siteName: 'ReflectAI',
    images: [
      {
        url: '/images/placeholder.png', // Make sure this exists in /public (1200x630)
        width: 1200,
        height: 630,
        alt: 'ReflectAI dashboard showing insights from journal entries.', // More descriptive alt text
        type: 'image/png', // Specify image type
      },
      // You could add a second, smaller image (e.g., square) as a fallback
      // { url: '/images/og-square.png', width: 600, height: 600, alt: 'ReflectAI Logo' }
    ],
    locale: 'en_US',
    type: 'website', // Correct type for a landing page
    // Optional: Add Facebook App ID if relevant
    // appId: 'YOUR_FB_APP_ID',
  },

  // --- Twitter Card (for Twitter Shares) ---
  twitter: {
    card: 'summary_large_image', // Good choice for visual appeal
    title: 'ReflectAI: AI Journaling App for Insights & Growth', // Align with main title or OG
    description: 'Analyze emotions, track progress, and gain personal insights with ReflectAI, your AI-powered journaling companion. #Journaling #AI #MentalWellness', // Include relevant hashtags
    siteId: '', // If you have a Twitter Website ID (rarely used)
    creator: '@BaronzBoss', // Your Twitter handle
    creatorId: '', // Your Twitter User ID (numeric) - Optional
    site: '@BaronzBoss', // Site's main Twitter handle (can be same as creator)
    images: {
      url: '/images/placeholder.png', // Make sure this exists (Ideally 1:1 or 2:1 ratio, < 5MB)
      alt: 'Preview of the ReflectAI journaling interface and insights.', // Descriptive alt text
    },
  },

  // --- App Links (Deep linking for mobile apps, if applicable) ---
  // appLinks: {
  //   ios: { url: 'yourapp://...', app_store_id: '...' },
  //   android: { package: 'com.example.android/package', app_name: 'app_name_android' },
  //   web: { url: '...', should_fallback: true },
  // },

  // --- Verification (for Google Search Console, Bing, etc.) ---
  // verification: {
  //   google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  //   yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
  //   yahoo: 'YOUR_YAHOO_VERIFICATION_CODE',
  //   other: {
  //     me: ['my-email@example.com', 'my-link'], // Example for other verification types
  //   },
  // },

  // --- Other Potentially Useful Tags ---
  category: 'Technology', // Or 'Health', 'Lifestyle'
  classification: 'Journaling Software', // More specific classification
  // referrer: 'origin-when-cross-origin', // Default, controls referrer information
  // formatDetection: { // Prevent auto-formatting of numbers as phone links on mobile
  //   telephone: false,
  //   email: false,
  //   address: false,
  // },
};


// --- Animation Variants ---
// const fadeIn = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
// };

// const staggerContainer = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2
//     }
//   }
// };

// const slideInLeft = {
//   hidden: { opacity: 0, x: -50 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
// };



const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};



export default function LandingPage() {

  return (
    <div className={`font-sans text-gray-900 bg-gradient-to-b from-white to-purple-50 ${poppins.className}`}>
      {/* Client Component Header */}
      <AppHeader
        logoSrc="/images/icon.png"
        logoAlt="ReflectAI Logo"
        siteName="ReflectAI"
      />

      {/* Hero Section */}
      <section className="pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 opacity-70 z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-3xl z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-300 rounded-full opacity-20 blur-3xl z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center max-w-7xl mx-auto px-4">
            {/* Hero Text Content */}
            <div className="w-full text-center mb-16">
              <span className="inline-block bg-purple-100 text-purple-800 px-5 py-2 rounded-full text-base font-medium mb-8
                 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"> {/* Added filter & drop-shadow */}
                AI-Powered Journaling
              </span>
              {/* Typing Animation Client Component */}
              <TypingHeroText
                className="text-6xl lg:text-7xl font-bold text-purple-900 leading-tight"
                highlightClassName="text-indigo-600"
                textLines={[
                  'Reflections', 1500,
                  'Thoughts', 1500,
                  'Ideas', 1500,
                  'Feelings', 1500,
                ]}
              />
              <p className="mt-8 text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                ReflectAI is your intelligent companion that analyzes your journal entries, tracks emotional patterns, and guides your personal growth journey.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-transform hover:scale-105 active:scale-95 font-medium text-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-3 h-6 w-6" />
                </a>
                <Link
                  href="/#demo"
                  className="inline-flex items-center justify-center bg-white text-purple-700 border border-purple-200 py-4 px-10 rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95 font-medium text-xl"
                >
                  Watch Demo
                  <Play className="ml-3 h-6 w-6" />
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full">
              <div className="bg-white p-4 rounded-2xl shadow-2xl max-w-5xl mx-auto">
                <Image
                  width={1200}
                  height={800}
                  src="/images/placeholder.png"
                  alt="ReflectAI Dashboard Preview"
                  className="rounded-xl w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* Feature Intro */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Why Choose ReflectAI</span>
            <h3 className="mt-2 text-4xl font-bold text-gray-900">
              Powerful Features for Meaningful Reflection
            </h3>
            <p className="mt-4 text-xl text-gray-600">
              Our unique technology turns your thoughts into actionable insights, helping you understand yourself better.
            </p>
          </div>

          {/* Feature Grid */}
          <AnimatedSection tag="div" className="" variants={slideInRight}>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Brain className="h-7 w-7 text-purple-700" />
                </div>
                <h4 className="text-2xl font-bold text-purple-900 mb-4">AI Sentiment Analysis</h4>
                <p className="text-gray-600 leading-relaxed">Our advanced algorithm analyzes the emotional tone of your entries, identifying patterns and providing personalized feedback in real-time.</p>
              </div>
              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-indigo-700" />
                </div>
                <h4 className="text-2xl font-bold text-indigo-900 mb-4">Personalized Insights</h4>
                <p className="text-gray-600 leading-relaxed">Receive tailored suggestions that help you understand your emotions, track personal growth over time, and develop meaningful habits.</p>
              </div>
              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Edit3 className="h-7 w-7 text-purple-700" />
                </div>
                <h4 className="text-2xl font-bold text-purple-900 mb-4">Dynamic Editor</h4>
                <p className="text-gray-600 leading-relaxed">Express yourself freely with our intuitive, distraction-free writing interface that adapts to your unique journaling style.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-6">
          {/* Demo Intro */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">See It In Action</span>
            <h3 className="mt-2 text-4xl font-bold text-gray-900">Experience ReflectAI</h3>
            <p className="mt-4 text-xl text-gray-600">Watch how ReflectAI transforms daily journaling into a powerful tool for self-awareness and growth.</p>
          </div>

          {/* Use the Client Component for the video player */}
          <DemoVideo
            videoSrc="/videos/hero.mp4"
            posterSrc="/images/placeholder.png"
          />
        </div>
      </section>

      {/* Testimonials Section (Can remain static or use AnimatedSection) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* Testimonials Intro */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h3 className="mt-2 text-4xl font-bold text-gray-900">What Our Users Say</h3>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-md">
              <div className="flex items-center mb-4">
                {/* Placeholder for user avatar - Use Image if you have actual images */}
                <div className="w-12 h-12 bg-purple-200 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Wellness Coach</p>
                </div>
              </div>
              <p className="text-gray-700 italic">ReflectAI has been transformative for my clients. The emotional insights help them identify patterns they never noticed before.</p>
            </div>
            {/* Testimonial 2 */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">As someone who struggles with expressing emotions, this app has been a game-changer. It helps me understand myself better.</p>
            </div>
            {/* Testimonial 3 */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Elena Rodriguez</h4>
                  <p className="text-sm text-gray-600">Therapist</p>
                </div>
              </div>
              <p className="text-gray-700 italic">I recommend ReflectAI to all my patients. The insights provide excellent discussion points for our sessions.</p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-4xl font-bold">Start Your Journey Today</h3>
            <p className="mt-4 text-xl text-purple-100">Join thousands who are discovering new insights about themselves every day.</p>
            <a
              href="/signup"
              className="mt-8 inline-flex items-center justify-center bg-white text-purple-700 py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-transform hover:scale-105 active:scale-95 font-medium text-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Footer Branding */}
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-6">
                {/* Using Image for footer logo */}
                <Image src="/images/icon.png" alt="ReflectAI Logo White" width={32} height={32} />
                {/* Or keep the simpler one:
                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                       <span className="text-purple-800 font-bold text-sm">R</span>
                     </div>
                     */}
                <span className="text-xl font-bold">ReflectAI</span>
              </Link>
              <p className="text-gray-400 text-sm">
                Transform your journaling experience with the power of AI.
              </p>
            </div>

            {/* Footer Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/#demo" className="text-gray-400 hover:text-white transition-colors text-sm">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li> {/* Added Privacy Policy */}
              </ul>
            </div>

            {/* Footer Contact */}
            <div id="contact"> {/* Keep ID if needed for internal links */}
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">Email: <a href="mailto:info@reflectai.com" className="hover:text-white transition-colors">info@reflectai.com</a></li>
              </ul>
              {/* Social Links */}
              <div className="flex space-x-4 mt-4">
                <a href="https://x.com/BaronzBoss" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>

              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ReflectAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}