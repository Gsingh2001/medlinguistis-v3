import fs from 'fs/promises'; // Use promises-based fs for async/await
import path from 'path';
import { NextResponse } from 'next/server';

const uploadDir = path.join(process.cwd(), 'uploads/pdfs');

// Asynchronously ensure the upload directory exists at startup
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

/**
 * Handles the HTTP POST request to upload a PDF file for a specific patient.
 * @param {Request} request - The incoming request object.
 * @param {object} context - The context object containing route parameters.
 * @param {string} context.params.patientId - The ID of the patient.
 * @returns {NextResponse} A response object.
 */
export async function POST(request, { params }) {
  const patientId = params.patientId;

  if (!patientId) {
    return NextResponse.json(
      { error: 'Missing patient ID in URL params' },
      { status: 400 }
    );
  }

  try {
    const data = await request.formData();
    const file = data.get('file');

    // --- Validation ---
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // The file object is a standard File API object
    if (!(file instanceof File) || file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Invalid file type. Only PDFs are allowed.' }, { status: 400 });
    }

    // --- Saving the file ---
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Construct the file path
    const filePath = path.join(uploadDir, `${patientId}.pdf`);

    // Write the file to the disk
    await fs.writeFile(filePath, buffer);

    console.log(`PDF saved for patient ${patientId} at ${filePath}`);

    return NextResponse.json({ message: 'PDF uploaded successfully' }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handles the HTTP GET request to retrieve a PDF file for a specific patient.
 * @param {Request} request - The incoming request object (unused).
 * @param {object} context - The context object containing route parameters.
 * @param {string} context.params.patientId - The ID of the patient.
 * @returns {Response|NextResponse} A response containing the PDF file or an error.
 */
export async function GET(request, { params }) {
    const patientId = params.patientId;

    if (!patientId) {
        return NextResponse.json(
            { error: 'Missing patient ID in URL params' },
            { status: 400 }
        );
    }

    try {
        const filePath = path.join(uploadDir, `${patientId}.pdf`);

        // Check if the file exists before trying to read it
        await fs.access(filePath);

        // Read the file into a buffer
        const fileBuffer = await fs.readFile(filePath);

        // Create a new Response object to stream the file
        return new Response(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                // This header suggests to the browser to display the file inline
                'Content-Disposition': `inline; filename="${patientId}.pdf"`,
            },
        });

    } catch (error) {
        // A common error here is 'ENOENT' (Error NO ENTry), meaning the file doesn't exist.
        if (error.code === 'ENOENT') {
            console.log(`File not found for patientId: ${patientId}`);
            return NextResponse.json({ error: 'File not found.' }, { status: 404 });
        }

        // Handle other potential errors (e.g., permissions)
        console.error('File retrieval error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve file', details: error.message },
            { status: 500 }
        );
    }
}
