"use client";

import { useEffect } from "react";
import Notiflix from "notiflix";

interface NotiflixLoadingProps {
  isLoading: boolean;
  message?: string;
}

const LoadingLayer = ({ isLoading, message = "Loading..." }: NotiflixLoadingProps) => {
  useEffect(() => {
    Notiflix.Loading.init({
      backgroundColor: "rgba(0,0,0,0.3)",
      svgColor: "#ffff",
      messageColor: "#ffff",
      svgSize: "50px",
      messageFontSize: "16px",
    });

    if (isLoading) {
      Notiflix.Loading.hourglass(message);
    } else {
      Notiflix.Loading.remove();
    }

    return () => {
      Notiflix.Loading.remove();
    };
  }, [isLoading, message]);

  return null;
};

export default LoadingLayer;
