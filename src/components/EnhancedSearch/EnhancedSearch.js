import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, X, Loader2 } from "lucide-react";
import PropertyCard from "../Card/PropertyCard";

const countries = [
  // { id: "USA", name: "USA", flag: "🇺🇸" },
  { id: "UK", name: "UK", flag: "🇬🇧" },
  // { id: "CAN", name: "Canada", flag: "🇨🇦" },
  // { id: "DEU", name: "Germany", flag: "🇩🇪" },
  { id: "AUS", name: "Australia", flag: "🇦🇺" },
];

const EnhancedSearch = ({ searchTerm, onClose, isOpen }) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [results, setResults] = useState({
    properties: [],
    loading: false,
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) {
        setResults({ properties: [], loading: false, error: null });
        return;
      }

      setResults((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URI +
            `/api/propertyauth/properties/search?title=${searchTerm}&city=${searchTerm}&country=${searchTerm}`
        );
        const data = await response.json();

        if (response.ok) {
          const groupedResults = {
            Countries: [],
            Cities: [],
            Properties: [],
          };

          if (data.properties.length === 0) {
            setResults({
              properties: groupedResults,
              loading: false,
              error: "No results found",
            });
            return;
          }

          data.properties.forEach((item) => {
            if (
              item.country?.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              groupedResults.Countries.push(item);
            }
            if (item.city?.toLowerCase().includes(searchTerm.toLowerCase())) {
              groupedResults.Cities.push(item);
            } else {
              groupedResults.Properties.push(item);
            }
          });

          setResults({
            properties: groupedResults,
            loading: false,
            error: null,
          });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setResults((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch results",
        }));
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 lg:top-full left-0 right-0 mt-2 mx-auto max-w-2xl rounded-lg shadow-lg border overflow-hidden bg-offwhite border-lightpink">
      {/* Country Selection Header */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-lightpink bg-offwhite">
        <div className="flex gap-2 overflow-x-scroll no-scrollbar">
          {countries.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country)}
              className={`${
                selectedCountry.id === country.id
                  ? "bg-lightpink text-voilet"
                  : "bg-transparent text-blue"
              } flex items-center gap-2 px-3 py-2 rounded-lg transition-colors`}
            >
              <span>{country.flag}</span>
              <span className="text-sm font-medium">{country.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full transition-colors hover:bg-opacity-80 bg-lightpink"
        >
          <X className="w-5 h-5 text-voilet" />
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {!searchTerm ? (
          <div className="p-4">
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3 text-voilet">
                Popular Cities in {selectedCountry.name}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {getCitiesForCountry(selectedCountry.id).map((city, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(`/property?city=${city}`);
                      onClose();
                    }}
                    className="flex items-center gap-2 p-3 rounded-lg transition-colors text-left hover:bg-opacity-80 bg-lightpink"
                  >
                    <MapPin className="w-4 h-4 text-voilet" />
                    <span className="text-sm text-blue">{city}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Featured Properties */}
            {/* <div>
              <h4 className="text-sm font-medium mb-3 text-voilet">
                Featured Properties
              </h4>
              <div className="space-y-2">
                {getPropertiesForCountry(selectedCountry.id)
                  .slice(0, 3)
                  .map((property, index) => (
                    <PropertyCard
                      key={index}
                      property={property}
                      onClick={onClose}
                    />
                  ))}
              </div>
            </div> */}
          </div>
        ) : (
          <div className="p-4">
            {results.loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-pink" />
              </div>
            ) : results.error ? (
              <div className="p-4 text-center text-darkpink">
                {results.error}
              </div>
            ) : (
              Object.entries(results.properties).map(
                ([category, items]) =>
                  items.length > 0 && (
                    <div key={category} className="mb-6">
                      <h4 className="text-sm font-medium mb-3 text-voilet">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <PropertyCard
                            key={index}
                            property={item}
                            onClick={onClose}
                          />
                        ))}
                      </div>
                    </div>
                  )
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const getCitiesForCountry = (countryId) => {
  const cities = {
    // USA: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
    UK: ["London", "Leicester", "Sheffield", "Manchester", "Birmingham"],
    // CAN: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
    // DEU: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne"],
    AUS: ["Canberra", "Darwin", "Brisbane", "Perth", "Adelaide","Sydney"],
  };  
  return cities[countryId] || [];
};

const getPropertiesForCountry = (countryId) => {
  const properties = {
    USA: [
      {
        title: "Luxury Condo in New York",
        city: "New York",
        country: "USA",
        price: 3500,
      },
      {
        title: "Beachfront House in LA",
        city: "Los Angeles",
        country: "USA",
        price: 5000,
      },
      {
        title: "Downtown Apartment",
        city: "Chicago",
        country: "USA",
        price: 2800,
      },
    ],
    UK: [
      {
        title: "Central London Flat",
        city: "London",
        country: "UK",
        price: 2500,
      },
      {
        title: "Student Housing",
        city: "Manchester",
        country: "UK",
        price: 1200,
      },
      {
        title: "Modern Apartment",
        city: "Birmingham",
        country: "UK",
        price: 1800,
      },
    ],
    CAN: [
      { title: "Downtown Condo", city: "Toronto", country: "CAN", price: 2800 },
      {
        title: "Waterfront Suite",
        city: "Vancouver",
        country: "CAN",
        price: 3200,
      },
      { title: "Modern Loft", city: "Montreal", country: "CAN", price: 2400 },
    ],
    DEU: [
      {
        title: "City Center Flat",
        city: "Berlin",
        country: "DEU",
        price: 1800,
      },
      { title: "Modern Studio", city: "Munich", country: "DEU", price: 2200 },
      {
        title: "Luxury Apartment",
        city: "Frankfurt",
        country: "DEU",
        price: 2500,
      },
    ],
  };
  return properties[countryId] || [];
};

export default EnhancedSearch;
