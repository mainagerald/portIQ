import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import hero from "./hero.png";
import heroBg from "./stock-bg.jpg";
import "./Hero.css";
import { initHeroAnimations } from "./HeroMotion";

interface Props {}

const Hero = (props: Props) => {
  const heroImageRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);
  const bgImageRef = useRef(null);

  useEffect(() => {
    initHeroAnimations(heroImageRef, headingRef, paragraphRef, buttonRef, bgImageRef);
  }, []);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-300">
  <div ref={bgImageRef} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})`, opacity:0.98 }}></div>
  <div className="container mx-auto p-8 lg:flex lg:items-center lg:justify-between relative z-10">
        <div className="lg:w-1/2">
          <div className="flex flex-col space-y-10 mb-44 m-10 lg:m-10 xl:m-20 lg:mt:16">
            <h1 ref={headingRef} className="text-5xl font-bold text-center lg:text-6xl lg:max-w-md lg:text-left text-blue">
              Financial data with custom news.
            </h1>
            <p ref={paragraphRef} className="text-2xl text-center text-white lg:max-w-md lg:text-left">
              Search relevant financial documents without fear mongering and fake news.
            </p>
            <div className="mx-auto lg:mx-0">
              <Link
              ref={buttonRef}
                to="/search"
                className="py-5 px-10 text-2xl font-bold text-white bg-indigo-600 rounded lg:py-4 hover:bg-indigo-700 transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-300 rounded-full blur-3xl opacity-50"></div>
            <div ref={heroImageRef} className="relative z-10 mx-auto md:w-180 md:px-10">
              <img src={hero} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;