import { createContext, useState } from "react";

export const GeoContext = createContext();

export function GeoProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <GeoContext.Provider value={{ location, error, setError, updateLocation }}>
      {children}
    </GeoContext.Provider>
  );
}