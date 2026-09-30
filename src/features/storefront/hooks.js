import { useMutation, useQuery } from "@tanstack/react-query";
import { getAbout, getCatalog, getGallery, getStorefrontReviews, getTestimonials, getTourDetail, sendContactMessage } from "./api";

/** Shared by Home and Tours, so navigating between them reuses the cached catalogue. */
export const useCatalog = () => useQuery({ queryKey: ["storefront", "catalog"], queryFn: getCatalog, staleTime: 60_000 });

export const useTestimonials = () => useQuery({ queryKey: ["storefront", "testimonials"], queryFn: getTestimonials, staleTime: 60_000 });

export const useGallery = () => useQuery({ queryKey: ["storefront", "gallery"], queryFn: getGallery, staleTime: 60_000 });

export const useStorefrontReviews = () => useQuery({ queryKey: ["storefront", "reviews"], queryFn: getStorefrontReviews, staleTime: 60_000 });

export const useAbout = () => useQuery({ queryKey: ["storefront", "about"], queryFn: getAbout, staleTime: 60_000 });

export const useContactMessage = () => useMutation({ mutationFn: sendContactMessage });

export const useTourDetail = (id) => useQuery({ queryKey: ["storefront", "tour", id], queryFn: () => getTourDetail(id), enabled: Boolean(id), staleTime: 60_000 });
