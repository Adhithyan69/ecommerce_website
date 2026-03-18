import React from "react";

const FeaturedProductBanner = () => (
  <section className="container mx-auto px-6 md:px-10 lg:px-16 py-12 bg-yellow-100 rounded-lg text-center">
    <h3 className="text-xl font-bold mb-2">Deal of the Day</h3>
    <p className="mb-4">Get up to 40% off on select items!</p>
    <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400">
      Grab Offer
    </button>
  </section>
);

export default FeaturedProductBanner;
