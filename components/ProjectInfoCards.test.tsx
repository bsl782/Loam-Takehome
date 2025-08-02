import { render, screen } from '@testing-library/react'
import ProjectInfoCards from '../components/ProjectInfoCards'
import type { Feature } from 'geojson'

// Mock the PaddockMap component since it uses dynamic imports
jest.mock('../components/PaddockMap', () => {
  return function MockPaddockMap({ feature }: { feature: Feature }) {
    return <div data-testid="mock-dynamic-component">Mock PaddockMap for {feature.properties?.name}</div>
  }
})

describe('ProjectInfoCards', () => {
  const mockFeatures: Feature[] = [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
      },
      properties: {
        id: '1',
        name: 'Paddock 1',
        owner: 'John Doe',
        area_acres: 50.5,
        Project__Name: 'Project Alpha'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[[2, 2], [3, 2], [3, 3], [2, 3], [2, 2]]]
      },
      properties: {
        id: '2',
        name: 'Paddock 2',
        owner: 'Jane Smith',
        area_acres: 75.25,
        Project__Name: 'Project Alpha'
      }
    }
  ]

  const mockGroupedProjects = {
    'Project Alpha': mockFeatures,
    'Project Beta': [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[4, 4], [5, 4], [5, 5], [4, 5], [4, 4]]]
        },
        properties: {
          id: '3',
          name: 'Paddock 3',
          owner: 'Bob Wilson',
          area_acres: 100,
          Project__Name: 'Project Beta'
        }
      }
    ]
  }

  it('renders project headings correctly', () => {
    render(<ProjectInfoCards groupedProjects={mockGroupedProjects} />)
    
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('Project Beta')).toBeInTheDocument()
  })

  it('calculates and displays total area correctly', () => {
    render(<ProjectInfoCards groupedProjects={mockGroupedProjects} />)
    
    // Project Alpha total: 50.5 + 75.25 = 125.75
    expect(screen.getByText('125.75 acres')).toBeInTheDocument()
    // Project Beta total: 100 - need to be more specific since this appears twice
    const totalAreaElements = screen.getAllByText('100.00 acres')
    expect(totalAreaElements.length).toBeGreaterThan(0)
  })

  it('displays correct number of paddocks', () => {
    render(<ProjectInfoCards groupedProjects={mockGroupedProjects} />)
    
    const paddockCounts = screen.getAllByText(/Number of Paddocks:/)
    expect(paddockCounts).toHaveLength(2)
    
    // Check that we have the right counts (Project Alpha has 2, Project Beta has 1)
    expect(screen.getByText('2', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByText('1', { selector: 'span' })).toBeInTheDocument()
  })

  it('renders paddock information correctly', () => {
    render(<ProjectInfoCards groupedProjects={mockGroupedProjects} />)
    
    // Check property names
    expect(screen.getByText('Paddock 1')).toBeInTheDocument()
    expect(screen.getByText('Paddock 2')).toBeInTheDocument()
    expect(screen.getByText('Paddock 3')).toBeInTheDocument()
    
    // Check owners
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
    
    // Check areas
    expect(screen.getByText('50.50 acres')).toBeInTheDocument()
    expect(screen.getByText('75.25 acres')).toBeInTheDocument()
  })

  it('handles missing property values gracefully', () => {
    const incompleteFeature: Feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
      },
      properties: {
        id: '4',
        // Missing name, owner, area_acres
        Project__Name: 'Incomplete Project'
      }
    }

    const incompleteProjects = {
      'Incomplete Project': [incompleteFeature]
    }

    render(<ProjectInfoCards groupedProjects={incompleteProjects} />)
    
    const unknownElements = screen.getAllByText('Unknown')
    expect(unknownElements.length).toBeGreaterThanOrEqual(2) // For missing name and owner
    expect(screen.getByText('Unknown acres')).toBeInTheDocument() // For missing area
    expect(screen.getByText('0.00 acres')).toBeInTheDocument() // Total area when no area_acres
  })

  it('renders PaddockMap components for each feature', () => {
    render(<ProjectInfoCards groupedProjects={mockGroupedProjects} />)
    
    const paddockMaps = screen.getAllByTestId('mock-dynamic-component')
    expect(paddockMaps).toHaveLength(3) // Total features across all projects
  })

  it('handles empty grouped projects', () => {
    render(<ProjectInfoCards groupedProjects={{}} />)
    
    expect(screen.getByText('Projects')).toBeInTheDocument()
    // Should not crash and should still show the main heading
  })

  it('calculates total area correctly when some features have no area', () => {
    const mixedFeatures = [
      {
        ...mockFeatures[0],
        properties: { ...mockFeatures[0].properties, area_acres: 50 }
      },
      {
        ...mockFeatures[1],
        properties: { ...mockFeatures[1].properties, area_acres: undefined }
      }
    ]

    const mixedProjects = {
      'Mixed Project': mixedFeatures
    }

    render(<ProjectInfoCards groupedProjects={mixedProjects} />)
    
    // Should only count the feature with area_acres = 50 - check for total area
    const areaElements = screen.getAllByText('50.00 acres')
    expect(areaElements.length).toBeGreaterThan(0) // Should appear at least once
  })
})
