"use client";

import { useState } from 'react'

import FileInput from "@/components/FileInput";
import ProjectInfoCards from "@/components/ProjectInfoCards";
import { ToastContainer, toast } from 'react-toastify';

import type { FeatureCollection, Feature } from 'geojson';
import type { GroupedProjectFeatures } from '@/types/GeoJson'

import { isValidFeatureCollection } from '@/utils/validation';

export default function Home() {
  const [groupedProjects, setGroupedProjects] = useState<GroupedProjectFeatures | null>(null);

  const handleFileChange = (geojson: string) => {
    const parsedJson = JSON.parse(geojson);

    if (isValidFeatureCollection(parsedJson)) {
      const filteredFeatures = filterInvalidFeatures(parsedJson.features);
      const groupedProjects = groupProjects(filteredFeatures);
      setGroupedProjects(groupedProjects);
    } else {
      toast.error("Invalid GeoJSON format");
    }
  };

  const filterInvalidFeatures = (features: Feature[]) => {
    const filteredFeatures = features.filter((feature) =>
      feature &&
      feature.geometry &&
      feature.properties &&
      feature.geometry.type === 'Polygon' &&
      Array.isArray(feature.geometry.coordinates) &&
      feature.geometry.coordinates[0].length > 4 // Ensure at least 4 points for a polygon
    );
    return filteredFeatures;
  };

  const groupProjects = (features: FeatureCollection['features']) => {
    const projectMap = {} as GroupedProjectFeatures;

    features.forEach((feature) => {
      const projectName = feature.properties?.Project__Name || 'Unknown Projects';
      if (!projectMap[projectName]) {
        projectMap[projectName] = [];
      }
      projectMap[projectName].push(feature);
    });

    const sortedProjectMap = {} as GroupedProjectFeatures;
    Object.keys(projectMap)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        sortedProjectMap[key] = projectMap[key];
      });

    return sortedProjectMap;
  };

  return (
    <>
      <ToastContainer autoClose={3000} pauseOnHover={false} />
      <main className="flex flex-col gap-4 items-center min-h-screen pt-10 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Paddock Analyser</h1>
        <div>
          <FileInput onFileParsed={handleFileChange}></FileInput>
        </div>
        {groupedProjects ? (
          <div className="w-full max-w-6xl p-4">
            <ProjectInfoCards groupedProjects={groupedProjects} />
          </div>

        ) : (
          <p>No GeoJSON loaded yet.</p>
        )}
      </main >
    </>

  );
}
