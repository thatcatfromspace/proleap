import Lottie from "lottie-react";
import notFound from "./assets/notFound.json";

export const NotFound = () => (
  <div className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[50%]">
    <Lottie animationData={notFound} loop={true} className="h-[30vh]"/>
    <p className="text-lg text-center "> {"The page you requested could not be found :("} </p>
  </div>
);