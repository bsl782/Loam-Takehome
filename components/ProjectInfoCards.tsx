import type { Feature } from 'geojson';
import dynamic from 'next/dynamic';

// Dynamically import PaddockMap with no SSR to avoid "window is not defined" error
const PaddockMap = dynamic(() => import('./PaddockMap'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-200 animate-pulse rounded">Loading map...</div>
});

export default function ProjectInfoCards({ groupedProjects }: { groupedProjects: { [projectName: string]: Feature[] } }) {

    const calculateTotalArea = (features: Feature[]) => {
        return features.reduce((total, feature) => {
            return total + (feature?.properties?.area_acres || 0);
        }, 0);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-left">Projects</h1>
            {Object.entries(groupedProjects).map(([projectName, features]) => (
                <div key={projectName} className="mb-5">
                    <h2 className="text-lg font-semibold mb-2">{projectName}</h2>
                    <div className='border rounded p-2'>
                        <p>
                            <span className="font-semibold text-lg">Total Area: </span>
                            <span>{calculateTotalArea(features).toFixed(2)} acres</span>
                        </p>
                        <p>
                            <span className="font-semibold text-lg">Number of Paddocks: </span>
                            <span>{features.length}</span>
                        </p>
                        <p className="mb-2"> </p>
                        <p className="font-semibold text-lg">Paddocks:</p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {features.map((feature: Feature) => (
                                <div className='mb-5' key={feature?.properties?.id}>
                                    <p>
                                        <span className="font-semibold">Property Name: </span>
                                        <span>{feature?.properties?.name ? feature?.properties?.name : "Unknown"}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold">Owner: </span>
                                        <span>{feature?.properties?.owner ? feature?.properties?.owner : "Unknown"}</span>
                                    </p>
                                    <p className='mb-2'>
                                        <span className="font-semibold">Area: </span>
                                        <span>{feature?.properties?.area_acres ? feature?.properties?.area_acres.toFixed(2) : 'Unknown'} acres</span>
                                    </p>
                                    <div>
                                        <p className="font-semibold text-lg mb-2">Paddock Map:</p>
                                        <PaddockMap feature={feature} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}