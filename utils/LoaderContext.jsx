// context/LoaderContext.jsx
import { createContext, useContext, useState, useRef } from "react";
import Loader from "./Loader";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const requestCount = useRef(0); // 👈 handle multiple calls
  const startTime = useRef(0);
  const timerRef = useRef(null);

  const showLoader = () => {
    requestCount.current += 1;

    if (requestCount.current === 1) {
      startTime.current = Date.now();

      timerRef.current = setTimeout(() => {
        setLoading(true);
      }, 200); // 👈 fast calls pe loader avoid
    }
  };

  const hideLoader = () => {
    if (requestCount.current > 0) {
      requestCount.current -= 1;
    }

    if (requestCount.current === 0) {
      const elapsed = Date.now() - startTime.current;
      const minTime = 800; // 👈 realistic value (0.8 sec)

      clearTimeout(timerRef.current);

      if (elapsed < minTime) {
        setTimeout(() => {
          setLoading(false);
        }, minTime - elapsed);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <Loader visible={loading} />
    </LoaderContext.Provider>
  );
};