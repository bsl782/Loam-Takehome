import { isValidFeatureCollection } from '../utils/validation'
import type { FeatureCollection } from 'geojson';

describe('validation utils', () => {
    describe('isValidFeatureCollection', () => {
        it('should return true for valid FeatureCollection', () => {
            const validFeatureCollection: FeatureCollection = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
                        },
                        properties: {
                            Project__Name: 'Test Project',
                            area_acres: 100
                        }
                    }
                ]
            }

            expect(isValidFeatureCollection(validFeatureCollection)).toBe(true)
        })
    })
})
