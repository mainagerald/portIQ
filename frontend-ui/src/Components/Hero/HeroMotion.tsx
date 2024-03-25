import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initHeroAnimations = (heroImageRef:any, headingRef:any, paragraphRef:any, buttonRef:any, bgImageRef:any) => {
  gsap.fromTo(
    heroImageRef.current,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: heroImageRef.current, start: 'top 80%' } }
  );

  gsap.fromTo(
    headingRef.current,
    { opacity: 0, y: -50 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5, scrollTrigger: { trigger: headingRef.current, start: 'top 80%' } }
  );

  gsap.fromTo(
    paragraphRef.current,
    { opacity: 0, y: -50 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8, scrollTrigger: { trigger: paragraphRef.current, start: 'top 80%' } }
  );

  gsap.fromTo(
    buttonRef.current,
    { opacity: 0, y: -50 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.1, scrollTrigger: { trigger: buttonRef.current, start: 'top 80%' } }
  );
  gsap.fromTo(
    bgImageRef.current,
    { scale: 1.2 },
    { scale: 1, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: bgImageRef.current, start: 'top bottom' } }
  );
};