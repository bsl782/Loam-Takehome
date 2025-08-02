import type { FeatureCollection } from 'geojson';

export function isValidFeatureCollection(data: FeatureCollection): data is FeatureCollection {
    return (
        data &&
        data.type === "FeatureCollection" &&
        Array.isArray(data.features)
    );
}
