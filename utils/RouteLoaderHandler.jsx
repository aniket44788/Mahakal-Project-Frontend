import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoader } from "./LoaderContext";


const RouteLoaderHandler = () => {
  const location = useLocation();
  const { hideLoader } = useLoader();

  useEffect(() => {
    const timer = setTimeout(() => {
      hideLoader();
    }, 300000); // smooth UX

    return () => clearTimeout(timer);
  }, [location]);
  return null;
};

export default RouteLoaderHandler;