import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl font-bold'>About Us</h2>
            <p className='text-gray-600'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl font-bold'>About Us</h2>
            <p className='text-gray-600'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
