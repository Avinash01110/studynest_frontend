import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2 } from "lucide-react";
import {getCurrencySymbolByCountry} from "../../utils/Currency";

const PropertyCard = ({ property, onClick }) => {
    const navigate = useNavigate();
  
    return (
      <button
        onClick={() => {
          navigate(`/property/${property._id}`);
          onClick();
        }}
        className="w-full flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-opacity-80 bg-lightpink"
      >
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-16 h-16 object-cover rounded-lg bg-no-repeat"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-offwhite">
            <Building2 className="w-8 h-8 text-voilet" />
          </div>
        )}
        <div className="flex-1 text-left">
          <h5 className="font-medium text-voilet">{property.title}</h5>
          <div className="flex items-center gap-2 mt-1 text-sm text-blue">
            <MapPin className="w-4 h-4" />
            <span>
              {property.city}, {property.country}
            </span>
          </div>
          {property.price && (
            <p className="mt-1 text-sm font-medium text-pink">
              {getCurrencySymbolByCountry(property.country)}{property.price}/week
            </p>
          )}
        </div>
      </button>
    );
  };

export default PropertyCard