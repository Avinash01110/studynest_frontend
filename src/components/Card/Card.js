import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useLocation } from "react-router-dom";
import { getCurrencySymbolByCountry } from "../../utils/Currency";

const ApartmentCard = ({
  _id,
  images,
  title,
  price,
  city,
  country,
  area,
  services,
  views,
}) => {
  const location = useLocation();
  const path = location.pathname;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="w-full z-0">
      <Link to={`/Property/${_id}`}>
        {/* Apartment Image Slider */}
        <div className="flex justify-center">
          <div className="bg-white w-[24rem] h-96 rounded-lg overflow-hidden border border-gray-100 shadow-lg shadow-slate-400 hover:shadow-lg hover:shadow-voilet hover:border-voilet transition-shadow duration-500 ease-in-out">
            <div className="w-[24rem] h-48 relative">
              {images.length > 0 ? (
                images.length === 1 ? (
                  // Render a single image without slider
                  <img
                    src={images[0] || "/default-image.jpg"}
                    alt={title || "Apartment"}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                ) : (
                  // Use Slider for multiple images
                  <Slider {...settings}>
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/default-image.jpg"}
                        alt={title || "Apartment"}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    ))}
                  </Slider>
                )
              ) : (
                // Render default image if no images are provided
                <img
                  src="/default-image.jpg"
                  alt="Default Apartment"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              {path === "/" && (
                <div className="absolute bottom-2 left-2 px-4 py-1 bg-black/60 rounded-xl text-sm text-white font-sans">
                  {views} views last month
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-[2px]">
              <h2 className="text-xl text-voilet font-bold truncate">{title}</h2>
              <p className="text-sm mb-1">
                {city}, {country}
              </p>
              <p className="text-sm mb-1 text-indigo-900">Area: {area}</p>
              <p className="text-sm font-semibold mb-1 text-indigo-900">
                Price: {getCurrencySymbolByCountry(country)}
                {price}/week
              </p>
              <ul className="text-xs text-gray-600 mt-2 grid grid-cols-3">
                {services.slice(0, 2).map((service, index) => (
                  <li
                    key={index}
                    className="border-2 border-gray-200 bg-gray-50 px-2 py-1 list-inside mr-1 rounded-lg"
                  >
                    {service}
                  </li>
                ))}
                {services.length > 2 && (
                  <li className="italic border-2 border-gray-200 bg-gray-50 px-2 py-1 rounded-lg">
                    + more services
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ApartmentCard;
