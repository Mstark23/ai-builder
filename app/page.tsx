'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    // Smooth scroll
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      if (anchor) {
        e.preventDefault();
        const targetElement = document.querySelector(anchor.getAttribute('href') || '');
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --slate: #0F172A;
          --blue: #3B82F6;
          --green: #10B981;
          --white: #ffffff;
          --gray-50: #F8FAFC;
          --gray-100: #F1F5F9;
          --gray-600: #475569;
          --gray-900: #0F172A;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: var(--slate);
          color: var(--white);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .bg-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.4;
          background: 
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }

        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          z-index: 1000;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .nav-menu {
          display: flex;
          gap: 40px;
          list-style: none;
          align-items: center;
        }

        .nav-menu a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-menu a:hover {
          color: var(--blue);
        }

        .nav-cta {
          background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
          color: var(--white);
          padding: 12px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          padding: 140px 60px 100px;
          overflow: hidden;
        }

        .hero-container {
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 32px;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }

        .ai-badge::before {
          content: '⚡';
          font-size: 16px;
        }

        .hero h1 {
          font-size: 80px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 28px;
          background: linear-gradient(135deg, var(--white) 0%, var(--blue) 50%, var(--green) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-subtitle {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 48px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero-cta-group {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 60px;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--green) 0%, #059669 100%);
          color: var(--white);
          padding: 18px 48px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 17px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(16, 185, 129, 0.6);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          color: var(--white);
          padding: 18px 48px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 17px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--blue);
        }

        .hero-stats {
          display: flex;
          gap: 60px;
          justify-content: center;
          margin-top: 80px;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .section {
          padding: 120px 60px;
          position: relative;
        }

        .section-container {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 80px;
        }

        .section-label {
          color: var(--green);
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 56px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .section-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.7);
        }

        .how-it-works {
          background: rgba(15, 23, 42, 0.5);
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .step-card {
          background: rgba(59, 130, 246, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 48px;
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--blue) 0%, var(--green) 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .step-card:hover::before {
          transform: scaleX(1);
        }

        .step-card:hover {
          transform: translateY(-10px);
          border-color: var(--blue);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.2);
        }

        .step-number {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          margin: 0 auto 24px;
        }

        .step-card h3 {
          font-size: 24px;
          margin-bottom: 16px;
        }

        .step-card p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 40px;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: 24px;
          display: block;
        }

        .feature-card h3 {
          font-size: 22px;
          margin-bottom: 12px;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .comparison {
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .comparison-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 48px;
          border-radius: 20px;
        }

        .comparison-card.traditional {
          border-color: rgba(239, 68, 68, 0.3);
        }

        .comparison-card.verktor {
          border-color: var(--green);
          background: rgba(16, 185, 129, 0.05);
        }

        .comparison-label {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .comparison-card.traditional .comparison-label {
          color: #EF4444;
        }

        .comparison-card.verktor .comparison-label {
          color: var(--green);
        }

        .comparison-card h3 {
          font-size: 36px;
          margin-bottom: 32px;
        }

        .comparison-list {
          list-style: none;
        }

        .comparison-list li {
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          gap: 16px;
          align-items: start;
        }

        .comparison-list li::before {
          content: '✓';
          color: var(--green);
          font-weight: 700;
          font-size: 20px;
          flex-shrink: 0;
        }

        .comparison-card.traditional .comparison-list li::before {
          content: '✗';
          color: #EF4444;
        }

        .portfolio {
          background: rgba(15, 23, 42, 0.8);
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
        }

        .portfolio-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .portfolio-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
          border-color: var(--blue);
        }

        .portfolio-preview {
          aspect-ratio: 16/10;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          position: relative;
          overflow: hidden;
        }

        .portfolio-preview::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
          border-radius: 50%;
        }

        .portfolio-info {
          padding: 32px;
        }

        .portfolio-info h3 {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .portfolio-info p {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 20px;
        }

        .portfolio-link {
          color: var(--blue);
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.3s ease;
        }

        .portfolio-link:hover {
          gap: 12px;
        }

        .use-cases-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
        }

        .use-case-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 48px;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .use-case-card:hover {
          transform: translateY(-8px);
          border-color: var(--blue);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.2);
        }

        .use-case-icon {
          font-size: 48px;
          margin-bottom: 24px;
        }

        .use-case-card h3 {
          font-size: 28px;
          margin-bottom: 16px;
        }

        .use-case-card p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .use-case-benefits {
          list-style: none;
        }

        .use-case-benefits li {
          padding: 8px 0;
          padding-left: 28px;
          position: relative;
          color: rgba(255, 255, 255, 0.8);
        }

        .use-case-benefits li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--green);
          font-weight: 700;
        }

        .pricing {
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 48px;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-10px);
          border-color: var(--blue);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
        }

        .pricing-card.featured {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
          border-color: var(--green);
          transform: scale(1.05);
        }

        .popular-badge {
          background: var(--green);
          color: var(--white);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 24px;
        }

        .pricing-card h3 {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .pricing-card .description {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 32px;
        }

        .price {
          font-size: 64px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .price-period {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 32px;
        }

        .pricing-features {
          list-style: none;
          margin-bottom: 32px;
        }

        .pricing-features li {
          padding: 12px 0;
          padding-left: 32px;
          position: relative;
          color: rgba(255, 255, 255, 0.8);
        }

        .pricing-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--green);
          font-weight: 700;
          font-size: 18px;
        }

        .pricing-cta {
          width: 100%;
          padding: 16px;
          border-radius: 10px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          display: block;
          transition: all 0.3s ease;
        }

        .pricing-card:not(.featured) .pricing-cta {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--white);
        }

        .pricing-card:not(.featured) .pricing-cta:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .pricing-card.featured .pricing-cta {
          background: linear-gradient(135deg, var(--green) 0%, #059669 100%);
          color: var(--white);
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
        }

        .pricing-card.featured .pricing-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(16, 185, 129, 0.6);
        }

        .testimonials {
          background: rgba(15, 23, 42, 0.5);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 16px;
        }

        .testimonial-stars {
          color: var(--green);
          font-size: 18px;
          margin-bottom: 20px;
          letter-spacing: 4px;
        }

        .testimonial-text {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 24px;
          font-size: 16px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }

        .author-info h4 {
          font-size: 16px;
          margin-bottom: 4px;
        }

        .author-info p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .faq {
          background: rgba(15, 23, 42, 0.8);
        }

        .faq-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 32px;
          border-radius: 16px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          background: rgba(59, 130, 246, 0.05);
          border-color: var(--blue);
        }

        .faq-question {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--white);
        }

        .faq-answer {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .final-cta {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .final-cta::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
          animation: rotate 30s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .final-cta-content {
          position: relative;
          z-index: 1;
        }

        .final-cta h2 {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .final-cta p {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 48px;
        }

        footer {
          background: rgba(15, 23, 42, 0.95);
          padding: 80px 60px 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-brand .logo {
          font-size: 28px;
          margin-bottom: 20px;
        }

        .footer-description {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .footer-column h4 {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--blue);
        }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }

        .powered-by {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 1200px) {
          .steps-grid,
          .features-grid,
          .pricing-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .comparison-grid,
          .portfolio-grid,
          .use-cases-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .nav-container,
          .section {
            padding-left: 24px;
            padding-right: 24px;
          }

          .nav-menu {
            display: none;
          }

          .hero h1 {
            font-size: 48px;
          }

          .section-title {
            font-size: 36px;
          }

          .hero-cta-group,
          .hero-stats {
            flex-direction: column;
            gap: 20px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>

      <div className="bg-animation"></div>

      <nav>
        <div className="nav-container">
          <div className="logo">Verktorlabs.ai</div>
          <ul className="nav-menu">
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <a href="#pricing" className="nav-cta">Get Started Free</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <div className="ai-badge">Powered by Claude AI • 10+ Years Experience</div>
          
          <h1>AI-Powered. Human-Perfected.<br/>Instantly Delivered.</h1>
          
          <p className="hero-subtitle">$50,000 agency-quality websites delivered in 60 minutes. See your website before you pay. Revolutionary AI meets decades of expertise.</p>
          
          <div className="hero-cta-group">
            <a href="#pricing" className="btn-primary">Start Your Website Now</a>
            <a href="#portfolio" className="btn-secondary">View Portfolio</a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">60min</span>
              <span className="stat-label">Preview Delivery</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">$50K</span>
              <span className="stat-label">Agency Quality</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works section" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">How It Works</div>
            <h2 className="section-title">From Concept to Live Website in 3 Steps</h2>
            <p className="section-subtitle">The future of web development is here. No more weeks of waiting. No more massive upfront costs.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Fill Quick Form</h3>
              <p>Tell us about your business in 5 minutes. We need your name, business details, style preferences, and content requirements.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>AI Builds Your Site</h3>
              <p>Our advanced AI system combined with 10+ years of expertise creates your custom website. Preview ready in 60 minutes.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Test & Pay Only If You Love It</h3>
              <p>Review your live website. Test on all devices. Show your team. Pay only if you're thrilled. Zero risk.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Features</div>
            <h2 className="section-title">Revolutionary Technology Meets Expert Craftsmanship</h2>
            <p className="section-subtitle">Everything you need to dominate your market online</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>60-Minute Previews</h3>
              <p>See your complete website in 60 minutes. Not a mockup. Not wireframes. Your actual website, live and ready to test.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">💎</span>
              <h3>$50K Agency Quality</h3>
              <p>Premium designs that look and perform like sites costing $50,000+. Professional, polished, and proven to convert.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h3>Try Before You Buy</h3>
              <p>Zero risk. See your website first, then decide. No payment until you're completely satisfied with the result.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h3>AI-Powered Technology</h3>
              <p>Powered by Claude AI, the world's most advanced language model. Combined with human expertise for perfection.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3>Mobile-Responsive</h3>
              <p>Flawless on every device. Desktop, tablet, mobile. Your website adapts perfectly to any screen size automatically.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Full Code Ownership</h3>
              <p>You own everything. All files, all code, forever. No subscriptions, no lock-in, no ongoing fees to us.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Comparison</div>
            <h2 className="section-title">Traditional Agencies vs. Verktorlabs.ai</h2>
            <p className="section-subtitle">See why thousands choose us over traditional web development</p>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card traditional">
              <div className="comparison-label">Traditional Agencies</div>
              <h3>$5,000-$50,000</h3>
              <ul className="comparison-list">
                <li>2-8 weeks delivery time</li>
                <li>Pay 50% upfront before seeing anything</li>
                <li>Limited revisions (2-3 rounds max)</li>
                <li>Expensive rush fees</li>
                <li>Hidden costs and upsells</li>
                <li>Locked into their platform</li>
                <li>Ongoing maintenance fees</li>
              </ul>
            </div>

            <div className="comparison-card verktor">
              <div className="comparison-label">Verktorlabs.ai</div>
              <h3>$299-$999</h3>
              <ul className="comparison-list">
                <li>60-minute preview delivery</li>
                <li>See your website before paying anything</li>
                <li>Multiple revision rounds included</li>
                <li>Same-day turnaround standard</li>
                <li>Transparent, all-inclusive pricing</li>
                <li>Full code ownership, no lock-in</li>
                <li>No ongoing fees to us</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio section" id="portfolio">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">See What We Build</h2>
            <p className="section-subtitle">Real examples of $50,000 agency-quality websites we create</p>
          </div>

          <div className="portfolio-grid">
            <div className="portfolio-item">
              <div className="portfolio-preview"></div>
              <div className="portfolio-info">
                <h3>Business Consulting</h3>
                <p>Professional service landing page with lead generation focus</p>
                <a href="https://progrowth-demo.netlify.app" target="_blank" rel="noopener noreferrer" className="portfolio-link">View Live Demo →</a>
              </div>
            </div>

            <div className="portfolio-item">
              <div className="portfolio-preview"></div>
              <div className="portfolio-info">
                <h3>E-Commerce Store</h3>
                <p>Bold editorial fashion site with product showcase</p>
                <a href="https://luxe-demo1.netlify.app" target="_blank" rel="noopener noreferrer" className="portfolio-link">View Live Demo →</a>
              </div>
            </div>

            <div className="portfolio-item">
              <div className="portfolio-preview"></div>
              <div className="portfolio-info">
                <h3>Professional Services</h3>
                <p>Premium law firm website with trust-building design</p>
                <a href="https://sterling-demo.netlify.app" target="_blank" rel="noopener noreferrer" className="portfolio-link">View Live Demo →</a>
              </div>
            </div>

            <div className="portfolio-item">
              <div className="portfolio-preview"></div>
              <div className="portfolio-info">
                <h3>SaaS Product</h3>
                <p>Modern tech landing page with interactive pricing</p>
                <a href="https://flowmetrics-demo.netlify.app" target="_blank" rel="noopener noreferrer" className="portfolio-link">View Live Demo →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Use Cases</div>
            <h2 className="section-title">Built for Your Business Model</h2>
            <p className="section-subtitle">Whether you're an agency, freelancer, or business owner</p>
          </div>

          <div className="use-cases-grid">
            <div className="use-case-card">
              <div className="use-case-icon">🏢</div>
              <h3>For Agencies</h3>
              <p>Scale your client work without hiring more developers. White-label our service and deliver professional websites in hours, not weeks.</p>
              <ul className="use-case-benefits">
                <li>Take on 10x more clients</li>
                <li>Increase profit margins</li>
                <li>Faster turnaround = happier clients</li>
                <li>Focus on strategy, we handle execution</li>
              </ul>
            </div>

            <div className="use-case-card">
              <div className="use-case-icon">💼</div>
              <h3>For Freelancers</h3>
              <p>Compete with agencies without their overhead. Deliver premium quality that justifies premium prices.</p>
              <ul className="use-case-benefits">
                <li>Charge agency rates ($2K-$5K+)</li>
                <li>Deliver same-day results</li>
                <li>Scale without hiring</li>
                <li>Build passive income streams</li>
              </ul>
            </div>

            <div className="use-case-card">
              <div className="use-case-icon">🚀</div>
              <h3>For Businesses</h3>
              <p>Get a professional online presence without breaking the bank. Perfect for startups, small businesses, and entrepreneurs.</p>
              <ul className="use-case-benefits">
                <li>Save $40K+ vs. agencies</li>
                <li>Launch in days, not months</li>
                <li>Professional quality guaranteed</li>
                <li>Try before you commit</li>
              </ul>
            </div>

            <div className="use-case-card">
              <div className="use-case-icon">🎯</div>
              <h3>For Startups</h3>
              <p>Make a powerful first impression with a professional website. Validate your idea fast with a live site.</p>
              <ul className="use-case-benefits">
                <li>Launch MVP in 60 minutes</li>
                <li>Test market before big investment</li>
                <li>Professional brand from day 1</li>
                <li>Iterate quickly based on feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing section" id="pricing">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Pricing</div>
            <h2 className="section-title">Transparent, Fair, Revolutionary</h2>
            <p className="section-subtitle">Agency quality at a fraction of the cost. No hidden fees, ever.</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Basic</h3>
              <p className="description">Perfect for landing pages and portfolios</p>
              <div className="price">$299</div>
              <p className="price-period">one-time payment</p>
              <ul className="pricing-features">
                <li>Single-page website</li>
                <li>Mobile-responsive design</li>
                <li>60-minute preview</li>
                <li>1 revision round</li>
                <li>Same-day delivery</li>
                <li>Full code ownership</li>
                <li>SEO-optimized</li>
              </ul>
              <a href="#contact" className="pricing-cta">Get Started</a>
            </div>

            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <h3>Professional</h3>
              <p className="description">For established businesses</p>
              <div className="price">$599</div>
              <p className="price-period">one-time payment</p>
              <ul className="pricing-features">
                <li>Multi-page website (5-8 pages)</li>
                <li>Mobile-responsive design</li>
                <li>60-minute preview</li>
                <li>2 revision rounds</li>
                <li>24-hour delivery</li>
                <li>Full code ownership</li>
                <li>SEO-optimized</li>
                <li>Contact forms included</li>
                <li>Priority support</li>
              </ul>
              <a href="#contact" className="pricing-cta">Get Started</a>
            </div>

            <div className="pricing-card">
              <h3>Premium</h3>
              <p className="description">For complex sites and e-commerce</p>
              <div className="price">$999</div>
              <p className="price-period">one-time payment</p>
              <ul className="pricing-features">
                <li>Full custom website (8-12+ pages)</li>
                <li>Mobile-responsive design</li>
                <li>60-minute preview</li>
                <li>3 revision rounds</li>
                <li>24-hour delivery</li>
                <li>Full code ownership</li>
                <li>SEO-optimized</li>
                <li>E-commerce ready</li>
                <li>Advanced features</li>
                <li>Premium support</li>
              </ul>
              <a href="#contact" className="pricing-cta">Get Started</a>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">Trusted by Thousands</h2>
            <p className="section-subtitle">See what our clients say about working with us</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&quot;I was skeptical about AI-generated websites, but Verktorlabs blew me away. The quality is indistinguishable from a $20K agency site. Delivered in 3 hours!&quot;</p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <h4>Jason Davis</h4>
                  <p>Founder, TechStart Inc</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&quot;As an agency owner, this has been game-changing. We can now take on 3x more clients. Our margins are higher and clients are happier with faster delivery.&quot;</p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <h4>Sarah Mitchell</h4>
                  <p>CEO, Digital Solutions Agency</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&quot;The 'try before you buy' approach removed all risk. I saw my website, loved it, and paid immediately. Best $599 I've ever spent on my business.&quot;</p>
              <div className="testimonial-author">
                <div className="author-avatar">MR</div>
                <div className="author-info">
                  <h4>Michael Rodriguez</h4>
                  <p>Owner, Rodriguez Law Firm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="faq-container">
            <div className="faq-item">
              <div className="faq-question">How can you deliver professional websites so fast?</div>
              <div className="faq-answer">We combine cutting-edge Claude AI technology with 10+ years of web development expertise. The AI handles the heavy lifting while our human expertise ensures perfection. This allows us to deliver in hours what traditionally takes weeks.</div>
            </div>

            <div className="faq-item">
              <div className="faq-question">What if I don't like the website you build?</div>
              <div className="faq-answer">Then you don't pay. Simple as that. Our &quot;try before you buy&quot; approach means zero financial risk. You see your complete website before making any payment decision.</div>
            </div>

            <div className="faq-item">
              <div className="faq-question">Do I really own the code and files?</div>
              <div className="faq-answer">100% yes. You receive all files, all code, and have complete ownership. No subscriptions, no ongoing fees to us, no restrictions. Host it anywhere, modify it anytime. It's yours forever.</div>
            </div>

            <div className="faq-item">
              <div className="faq-question">Can you match my existing brand?</div>
              <div className="faq-answer">Absolutely. Just provide your brand guidelines, colors, fonts, and style preferences in the form. We'll match your existing brand perfectly or help you create a new one.</div>
            </div>

            <div className="faq-item">
              <div className="faq-question">What about hosting and domain setup?</div>
              <div className="faq-answer">We can guide you through self-hosting (free), or handle everything for you as an optional add-on ($50). Either way, you maintain full control and ownership.</div>
            </div>

            <div className="faq-item">
              <div className="faq-question">Is this really AI-powered?</div>
              <div className="faq-answer">Yes! We're powered by Claude AI from Anthropic, one of the world's most advanced AI systems. But we don't stop there - every website is refined by our team to ensure it meets our $50K quality standards.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta section">
        <div className="section-container">
          <div className="final-cta-content">
            <h2>Ready to Launch Your Website?</h2>
            <p>Join thousands who've transformed their business with Verktorlabs.ai</p>
            <div className="hero-cta-group">
              <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=PZnWtxiLQ0insaB_C5pAjmz9CURoBGBKjZSFZ8OMckRURjQyTE4wNkdCNTNKRFRTMEtaTllQS1pHVi4u" target="_blank" rel="noopener noreferrer" className="btn-primary">Start Your Website Now</a>
              <a href="#portfolio" className="btn-secondary">View More Examples</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">Verktorlabs.ai</div>
              <p className="footer-description">Revolutionary AI-powered web development platform. $50,000 agency quality at a fraction of the cost. See your website before you pay.</p>
            </div>

            <div className="footer-column">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#refund">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>&copy; 2026 Verktorlabs.ai. All rights reserved.</div>
            <div className="powered-by">
              <span>Powered by</span>
              <span style={{
                background: 'linear-gradient(135deg, var(--blue) 0%, var(--green) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700
              }}>Claude AI</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}