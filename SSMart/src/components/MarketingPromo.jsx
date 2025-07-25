import React from 'react';
import bgHero from '../img/bg_hero.svg';
import womenHero from '../img/woman_hero.png';

const MarketingPromo = () => {
  return (
    <section
      className="h-auto min-h-[300px] py-2 px-2 bg-no-repeat bg-fit bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-2 md:gap-0 h-full">
        {/* Text Section */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#EB5757] leading-tight">
            Women New Arrivals
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-md mb-1">
            Discover our latest offers and exclusive deals. Shop now and save big on your favorite products!
          </p>
          <button className="mt-2 px-2 py-2 bg-[#EB5757] text-white rounded-full font-semibold shadow hover:bg-[#d13b3b] transition">
            Shop Now
          </button>
        </div>
        {/* Image Section */}
        <div className="flex-1 flex justify-center items-center mb-1 md:mb-0">
          <img 
            src={womenHero} 
            alt="Woman Hero" 
            className="w-48 h-auto sm:w-64 md:w-80 max-h-[362px] object-contain" 
          />
        </div>
      </div>
    </section>
  )
};

export default MarketingPromo;
