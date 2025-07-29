import { NextResponse } from 'next/server';
import { readJson } from '@/components/lib/jsonDb';
import path from 'path';

const DATA_PATH = path.join('src/components/data/report.json');

function getEarliestSurgeryDate(surgeries = []) {
  if (!surgeries.length) return '';
  const years = surgeries.map(s => {
    const match = s.match(/\((\d{4}),/);
    return match ? parseInt(match[1], 10) : null;
  }).filter(y => y !== null);
  if (!years.length) return '';
  return Math.min(...years).toString();
}

export async function GET() {
  try {
    const patientsData = await readJson(DATA_PATH);

    if (!Array.isArray(patientsData)) {
      throw new Error('Expected patientsData to be an array');
    }

    const patients = patientsData.map(({ Patient_ID, report }) => {
      const meta = report.metadata || {};
      const surgeries = meta.Medical_History?.Prior_Major_Surgeries || [];

      return {
        patient_id: Patient_ID,
        name: meta.Name || '',
        phoneNumber: '',  // no phone in your data yet
        email: '',        // no email in your data yet
        age: meta.Age || '',
        gender: meta.Gender || '',
        dateOfSurgery: getEarliestSurgeryDate(surgeries),
        typeOfSurgery: surgeries.join(', '),
        priorityLevel: '', // empty or compute if available
      };
    });

    return NextResponse.json(patients);

  } catch (error) {
    console.error('Error reading patients data:', error);
    return NextResponse.json({ error: 'Failed to read patient data' }, { status: 500 });
  }
}
