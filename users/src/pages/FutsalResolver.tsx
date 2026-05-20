import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFutsalById, getFutsalByName } from "@/lib/futsalApi";
import { Loader2 } from "lucide-react";

/**
 * Resolver component that handles both ID and name-based futsal URLs
 * Automatically redirects to the proper ID-based URL
 */
const FutsalResolver = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect which page type is being requested
  const getPageFromPath = (path: string) => {
    if (path.endsWith('/bookings')) return 'bookings';
    if (path.endsWith('/reviews')) return 'reviews';
    if (path.endsWith('/gallery')) return 'gallery';
    return null;
  };

  const page = getPageFromPath(location.pathname);

  // Skip if slug is not provided
  if (!slug) {
    return null;
  }

  // Try to get futsal by ID first (if slug is numeric)
  const isNumeric = /^\d+$/.test(slug);
  const { data: idData, isLoading: idLoading, error: idError } = useQuery({
    queryKey: ['futsal-resolve-id', slug],
    queryFn: () => getFutsalById(slug),
    enabled: isNumeric,
    retry: false,
  });

  // If not a number or ID not found, try by name
  const shouldTryName = !isNumeric || (isNumeric && idError);
  const { data: nameData, isLoading: nameLoading, error: nameError } = useQuery({
    queryKey: ['futsal-resolve-name', slug],
    queryFn: () => getFutsalByName(slug),
    enabled: shouldTryName,
    retry: false,
  });

  useEffect(() => {
    const futsalId = idData?.data?.id || nameData?.data?.id;
    
    if (futsalId) {
      // Determine the redirect path based on detected page type
      let redirectPath = `/futsals/${futsalId}`;
      if (page === "bookings") {
        redirectPath = `/futsals/${futsalId}/bookings`;
      } else if (page === "reviews") {
        redirectPath = `/futsals/${futsalId}/reviews`;
      } else if (page === "gallery") {
        redirectPath = `/futsals/${futsalId}/gallery`;
      }
      
      navigate(redirectPath, { replace: true });
    }
  }, [idData, nameData, navigate, page]);

  // Loading state
  const isLoading = idLoading || nameLoading;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading futsal...</p>
        </div>
      </div>
    );
  }

  // Error state - check if both queries failed
  const hasBothErrors = (isNumeric && idError) || (!isNumeric && nameError) || (shouldTryName && nameError);
  const notFound = (idError || nameError) && !idData?.data && !nameData?.data;
  
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">Futsal Not Found</h1>
          <p className="text-muted-foreground mb-2">
            We couldn't find a futsal matching <strong>"{slug}"</strong>
          </p>
          <p className="text-sm text-slate-400 mb-6">
            Make sure the futsal name is correct and try again.
          </p>
          <button
            onClick={() => navigate('/futsals')}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
          >
            View All Futsals
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default FutsalResolver;
