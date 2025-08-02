import type { Feature } from 'geojson';

export type GroupedProjectFeatures = { 
    [projectName: string]: Feature[] 
}
