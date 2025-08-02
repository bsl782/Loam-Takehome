import "@testing-library/jest-dom";
import React from 'react';

// Mock `next/dynamic` to avoid SSR/dynamic import issues in tests
jest.mock("next/dynamic", () => {
  return (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
    return function MockDynamicComponent(props: any) {
      return React.createElement('div', { 'data-testid': 'mock-dynamic-component', ...props });
    };
  };
});

// Mock `react-leaflet` components for jsdom environment
jest.mock("react-leaflet", () => {
  return {
    MapContainer: ({ children, ...props }: any) => 
      React.createElement('div', { 'data-testid': 'map-container', ...props }, children),
    TileLayer: (props: any) => 
      React.createElement('div', { 'data-testid': 'tile-layer', ...props }),
    GeoJSON: (props: any) => 
      React.createElement('div', { 'data-testid': 'geojson', ...props }),
    useMap: () => ({
      setView: jest.fn(),
    }),
  };
});

// Mock `@turf/centroid`
jest.mock("@turf/centroid", () => {
  return jest.fn(() => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [150.647, -34.3935],
    },
    properties: {},
  }));
});
