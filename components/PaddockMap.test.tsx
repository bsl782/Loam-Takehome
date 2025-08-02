import { render, screen } from '@testing-library/react'
import PaddockMap from '../components/PaddockMap'
import type { Feature } from 'geojson'

describe('PaddockMap', () => {
  const mockFeature: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[[150.647, -34.3935], [150.648, -34.3935], [150.648, -34.3936], [150.647, -34.3936], [150.647, -34.3935]]]
    },
    properties: {
      id: '1',
      name: 'Test Paddock',
      area_acres: 100
    }
  }

  it('renders map container with correct props', () => {
    render(<PaddockMap feature={mockFeature} />)
    
    const mapContainer = screen.getByTestId('map-container')
    expect(mapContainer).toBeInTheDocument()
  })

  it('renders tile layer', () => {
    render(<PaddockMap feature={mockFeature} />)
    
    const tileLayer = screen.getByTestId('tile-layer')
    expect(tileLayer).toBeInTheDocument()
  })

  it('renders GeoJSON component with feature data', () => {
    render(<PaddockMap feature={mockFeature} />)
    
    const geoJsonComponent = screen.getByTestId('geojson')
    expect(geoJsonComponent).toBeInTheDocument()
  })

  it('handles feature with point geometry', () => {
    const pointFeature: Feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [150.647, -34.3935]
      },
      properties: {
        id: '3',
        name: 'Point Feature'
      }
    }

    render(<PaddockMap feature={pointFeature} />)
    
    const mapContainer = screen.getByTestId('map-container')
    expect(mapContainer).toBeInTheDocument()
    
    const geoJsonComponent = screen.getByTestId('geojson')
    expect(geoJsonComponent).toBeInTheDocument()
  })

  it('uses correct map configuration', () => {
    render(<PaddockMap feature={mockFeature} />)
    
    const mapContainer = screen.getByTestId('map-container')
    
    // Check that the map container has the expected styling
    expect(mapContainer).toHaveStyle('height: 400px')
    expect(mapContainer).toHaveStyle('width: 100%')
  })
})
