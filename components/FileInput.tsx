import { ChangeEvent } from "react";
import { toast } from 'react-toastify';

type FileInputProps = {
    onFileParsed: (data: string) => void;
}

export default function FileInput({ onFileParsed }: FileInputProps) {
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            toast.error("No file selected. Please upload a valid GeoJSON file.");
            return;
        }
        else if (file.type !== "application/json" && file.type !== "application/geo+json") {
            toast.error("Invalid file type. Please upload a valid GeoJSON file.");
            return;
        }
        else {
            toast.success("File selected successfully. Processing...");
            try {
                onFileParsed(await file.text());
            }
            catch {
                toast.error("An error occurred while processing the file. Please try again.");
            }
        }
    }
    return (
        <form>
            <label htmlFor="geojson-file-input" className="block mb-2 font-medium">
                Upload GeoJSON File
            </label>
            <input
                id="geojson-file-input"
                type="file"
                accept=".json, .geojson"
                onChange={handleFileChange}
                className="cursor-pointer p-2 border rounded"
            />
        </form>
    );
};