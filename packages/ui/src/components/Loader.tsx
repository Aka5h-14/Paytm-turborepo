"use client";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAppSelector } from "@repo/store/hooks";

export default function Loader() {
  const loading = useAppSelector((state) => state.loading.value);

  return (
    loading && (
      <Box
        sx={{
          position: "fixed",  // Fixed positioning to overlay on page
          top: 0,             // Align to top of page
          left: 0,            // Align to left of page
          width: "100vw",     // Take full width
          height: "100vh",    // Take full height
          display: "flex",    // Use flexbox to center
          justifyContent: "center",  // Center horizontally
          alignItems: "center",     // Center vertically
          zIndex: 50,         // Set z-index
          backgroundColor: "rgba(0, 0, 0, 0.5)",  // Optional: semi-transparent background
        }}
      >
        <CircularProgress size="4rem" />
      </Box>
    )
  );
}
