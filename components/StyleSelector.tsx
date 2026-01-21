'use client';

import { useState } from 'react';

type DesignDirection = 
  | 'luxury_minimal'
  | 'bold_modern'
  | 'warm_organic'
  | 'dark_premium'
  | 'editorial_classic'
  | 'vibrant_energy';

interface StyleSelectorProps {
  value: DesignDirection | '';
  onChange: (direction: DesignDirection) => void;
}

const designDirections: {
  id: DesignDirection;
  name: string;
  tagline: string;
  description: string;
  fonts: string;
  palette: string[];
  characteristics: string[];
  bestFor: string[];
  preview: {
    bg: string;
    accent: string;
    text: string;
    headingFont: string;
    bodyFont: string;
  };
}[] = [
  {
    id: 'luxury_minimal',
    name: 'Luxury Minimal',
    tagline: 'Refined elegance, breathing space',
    description: 'Ultra-refined aesthetics with generous whitespace, subtle animations, and premium typography. Every element earns its place.',
    fonts: 'Cormorant Garamond + Inter',
    palette: ['#FAFAFA', '#1A1A1A', '#B8860B', '#F5F5F5', '#2C2C2C'],
    characteristics: ['Generous whitespace', 'Serif headlines', 'Subtle gold accents', 'Micro-animations'],
    bestFor: ['High-end services', 'Luxury brands', 'Professional portfolios', 'Architecture firms'],
    preview: {
      bg: 'bg-[#FAFAFA]',
      accent: 'bg-[#B8860B]',
      text: 'text-[#1A1A1A]',
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
  },
  {
    id: 'bold_modern',
    name: 'Bold Modern',
    tagline: 'High impact, maximum confidence',
    description: 'Oversized typography, strong geometric shapes, and high contrast. Makes an immediate statement and commands attention.',
    fonts: 'Space Grotesk + DM Sans',
    palette: ['#FFFFFF', '#0A0A0A', '#FF3366', '#F0F0F0', '#333333'],
    characteristics: ['Oversized type', 'Geometric shapes', 'Bold CTAs', 'Asymmetric layouts'],
    bestFor: ['Tech startups', 'Creative agencies', 'Fitness brands', 'E-commerce'],
    preview: {
      bg: 'bg-white',
      accent: 'bg-[#FF3366]',
      text: 'text-[#0A0A0A]',
      headingFont: 'font-sans font-bold',
      bodyFont: 'font-sans',
    },
  },
  {
    id: 'warm_organic',
    name: 'Warm Organic',
    tagline: 'Natural warmth, human connection',
    description: 'Earthy tones, soft rounded shapes, and natural textures. Creates an approachable, trustworthy atmosphere.',
    fonts: 'Fraunces + Source Sans Pro',
    palette: ['#FDF6E3', '#2D2A26', '#C17F59', '#E8DFD0', '#5C4A3D'],
    characteristics: ['Warm earth tones', 'Rounded corners', 'Natural textures', 'Handcrafted feel'],
    bestFor: ['Wellness brands', 'Restaurants', 'Artisan businesses', 'Non-profits'],
    preview: {
      bg: 'bg-[#FDF6E3]',
      accent: 'bg-[#C17F59]',
      text: 'text-[#2D2A26]',
      headingFont: 'font-serif',
      bodyFont: 'font-sans',
    },
  },
  {
    id: 'dark_premium',
    name: 'Dark Premium',
    tagline: 'Sophisticated darkness, glowing accents',
    description: 'Dark backgrounds with luminous accents, gradients, and glass effects. Exudes exclusivity and cutting-edge sophistication.',
    fonts: 'Outfit + Inter',
    palette: ['#0D0D0D', '#FFFFFF', '#8B5CF6', '#1A1A2E', '#A855F7'],
    characteristics: ['Dark backgrounds', 'Gradient accents', 'Glowing effects', 'Glass morphism'],
    bestFor: ['SaaS products', 'Gaming', 'Music/Entertainment', 'Finance/Crypto'],
    preview: {
      bg: 'bg-[#0D0D0D]',
      accent: 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]',
      text: 'text-white',
      headingFont: 'font-sans font-semibold',
      bodyFont: 'font-sans',
    },
  },
  {
    id: 'editorial_classic',
    name: 'Editorial Classic',
    tagline: 'Magazine-worthy, timeless authority',
    description: 'Strong typographic hierarchy inspired by premium publications. Grid-based layouts with confident use of negative space.',
    fonts: 'Playfair Display + Lora',
    palette: ['#FFFFFF', '#111111', '#C9A227', '#F8F8F8', '#444444'],
    characteristics: ['Strong typography', 'Grid layouts', 'Dramatic imagery', 'Editorial spacing'],
    bestFor: ['Media/Publishing', 'Law firms', 'Consulting', 'Real estate'],
    preview: {
      bg: 'bg-white',
      accent: 'bg-[#C9A227]',
      text: 'text-[#111111]',
      headingFont: 'font-serif font-bold',
      bodyFont: 'font-serif',
    },
  },
  {
    id: 'vibrant_energy',
    name: 'Vibrant Energy',
    tagline: 'Playful, dynamic, unforgettable',
    description: 'Bold colors, dynamic animations, and playful interactions. Creates excitement and a sense of forward momentum.',
    fonts: 'Poppins + Nunito',
    palette: ['#FFFFFF', '#1E1E1E', '#FF6B35', '#FFF8F0', '#2EC4B6'],
    characteristics: ['Vibrant colors', 'Playful animations', 'Dynamic shapes', 'Friendly tone'],
    bestFor: ['Education', 'Kids brands', 'Events', 'Food & beverage'],
    preview: {
      bg: 'bg-[#FFF8F0]',
      accent: 'bg-gradient-to-r from-[#FF6B35] to-[#2EC4B6]',
      text: 'text-[#1E1E1E]',
      headingFont: 'font-sans font-bold',
      bodyFont: 'font-sans',
    },
  },
];

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const [hoveredId, setHoveredId] = useState<DesignDirection | null>(null);
  const [expandedId, setExpandedId] = useState<DesignDirection | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-medium text-black mb-2">
          Choose Your Design Direction
        </h2>
        <p className="font-body text-neutral-500 text-sm">
          Each direction is crafted with specific typography, colors, and layouts
        </p>
      </div>

      {/* Grid of Design Directions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designDirections.map((direction) => {
          const isSelected = value === direction.id;
          const isHovered = hoveredId === direction.id;
          const isExpanded = expandedId === direction.id;

          return (
            <div
              key={direction.id}
              onClick={() => onChange(direction.id)}
              onMouseEnter={() => setHoveredId(direction.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300
                ${isSelected 
                  ? 'ring-2 ring-black ring-offset-2 shadow-xl' 
                  : 'border border-neutral-200 hover:border-neutral-300 hover:shadow-lg'
                }
              `}
            >
              {/* Mini Preview - Visual representation of the style */}
              <div className={`h-32 ${direction.preview.bg} relative overflow-hidden`}>
                {/* Mock website preview */}
                <div className="absolute inset-3 flex flex-col">
                  {/* Mock nav */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-6 h-6 rounded ${direction.preview.accent}`}></div>
                    <div className="flex gap-2">
                      <div className={`w-8 h-1.5 rounded ${direction.preview.text} opacity-30`}></div>
                      <div className={`w-8 h-1.5 rounded ${direction.preview.text} opacity-30`}></div>
                      <div className={`w-8 h-1.5 rounded ${direction.preview.text} opacity-30`}></div>
                    </div>
                  </div>
                  
                  {/* Mock hero */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className={`w-3/4 h-3 rounded mb-2 ${direction.preview.text} opacity-80`}></div>
                    <div className={`w-1/2 h-2 rounded mb-3 ${direction.preview.text} opacity-40`}></div>
                    <div className={`w-16 h-5 rounded-full ${direction.preview.accent}`}></div>
                  </div>

                  {/* Mock cards */}
                  <div className="flex gap-2 mt-auto">
                    <div className={`flex-1 h-8 rounded ${direction.id === 'dark_premium' ? 'bg-white/10' : 'bg-black/5'}`}></div>
                    <div className={`flex-1 h-8 rounded ${direction.id === 'dark_premium' ? 'bg-white/10' : 'bg-black/5'}`}></div>
                    <div className={`flex-1 h-8 rounded ${direction.id === 'dark_premium' ? 'bg-white/10' : 'bg-black/5'}`}></div>
                  </div>
                </div>

                {/* Color palette dots */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {direction.palette.slice(0, 4).map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-white/30 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-4 bg-white">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-body font-semibold text-black text-sm">
                    {direction.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : direction.id);
                    }}
                    className="text-neutral-400 hover:text-black transition-colors"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <p className="font-body text-xs text-neutral-500 italic mb-2">
                  {direction.tagline}
                </p>
                <p className="font-body text-xs text-neutral-600 line-clamp-2">
                  {direction.description}
                </p>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {/* Fonts */}
                    <div>
                      <span className="font-body text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                        Typography
                      </span>
                      <span className="font-body text-xs text-black">{direction.fonts}</span>
                    </div>

                    {/* Characteristics */}
                    <div>
                      <span className="font-body text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                        Key Features
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {direction.characteristics.map((char, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-body text-neutral-600"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Best For */}
                    <div>
                      <span className="font-body text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                        Best For
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {direction.bestFor.map((item, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-body"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-body font-medium text-violet-900 text-sm mb-1">
              Not sure? Let AI decide
            </h4>
            <p className="font-body text-xs text-violet-700">
              Based on your industry and goals, we'll automatically select the best design direction. 
              You can always preview and change it later.
            </p>
            <button
              onClick={() => onChange('luxury_minimal')} // Default to luxury_minimal as "AI choice"
              className="mt-2 px-3 py-1.5 bg-violet-500 text-white text-xs font-body font-medium rounded-lg hover:bg-violet-600 transition-colors"
            >
              Let AI Choose →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
