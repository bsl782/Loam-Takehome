import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileInput from '../components/FileInput'
import { toast } from 'react-toastify'

// Mock toast
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}))

describe('FileInput', () => {
    const mockOnFileParsed = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders file input with correct attributes', () => {
        render(<FileInput onFileParsed={mockOnFileParsed} />)

        const fileInput = screen.getByLabelText(/Upload GeoJSON File/i)
        expect(fileInput).toBeInTheDocument()
        expect(fileInput).toHaveAttribute('type', 'file')
        expect(fileInput).toHaveAttribute('accept', '.json, .geojson')
    })

    it('calls onFileParsed with file content when valid JSON file is uploaded', async () => {
        const user = userEvent.setup()
        render(<FileInput onFileParsed={mockOnFileParsed} />)

        const fileInput = screen.getByLabelText(/Upload GeoJSON File/i)
        const validGeoJSON = {
            type: 'FeatureCollection',
            features: []
        }

        // Create a file with proper text() method implementation
        const fileContent = JSON.stringify(validGeoJSON)
        const file = new File([fileContent], 'test.geojson', {
            type: 'application/json',
        })

        // Mock file.text() to ensure it works properly in tests
        Object.defineProperty(file, 'text', {
            value: jest.fn().mockResolvedValue(fileContent),
            writable: false,
        })

        await user.upload(fileInput, file)

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('File selected successfully. Processing...')
        })

        await waitFor(() => {
            expect(mockOnFileParsed).toHaveBeenCalledWith(fileContent)
        })
    })

    it('shows error when invalid JSON file is uploaded', async () => {
        render(<FileInput onFileParsed={mockOnFileParsed} />)

        const fileInput = screen.getByLabelText(/Upload GeoJSON File/i)
        const invalidJSON = 'invalid json content'

        const file = new File([invalidJSON], 'test.json', {
            type: 'application/json',
        })

        // Mock file.text() to reject, simulating an error
        Object.defineProperty(file, 'text', {
            value: jest.fn().mockRejectedValue(new Error('Failed to read file')),
            writable: false,
        })

        // Trigger the change event directly
        fireEvent.change(fileInput, { target: { files: [file] } })

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('An error occurred while processing the file. Please try again.')
            expect(mockOnFileParsed).not.toHaveBeenCalled()
        })
    })

    it('shows error when unsupported file type is uploaded', async () => {
        render(<FileInput onFileParsed={mockOnFileParsed} />)

        const fileInput = screen.getByLabelText(/Upload GeoJSON File/i)
        
        const file = new File(['some content'], 'test.txt', {
            type: 'text/plain',
        })

        // Trigger the change event directly
        fireEvent.change(fileInput, { target: { files: [file] } })

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid file type. Please upload a valid GeoJSON file.')
            expect(mockOnFileParsed).not.toHaveBeenCalled()
        })
    })

    it('shows error when no file is selected', async () => {
        render(<FileInput onFileParsed={mockOnFileParsed} />)

        const fileInput = screen.getByLabelText(/Upload GeoJSON File/i)
        
        // Trigger change event with no files
        fireEvent.change(fileInput, { target: { files: [] } })

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('No file selected. Please upload a valid GeoJSON file.')
            expect(mockOnFileParsed).not.toHaveBeenCalled()
        })
    })
})
