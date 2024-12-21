import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  console.log("Data received in /analyzebody:", data);

  try {
    const response = await fetch('https://flask-production-d9a7.up.railway.app/analyzebody', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.conversations),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Flask server:', errorData);
      throw new Error('Failed to analyze data');
    }

    const analyzeData = await response.json();
    console.log("Analyze data received in /analyze!!:", analyzeData);
    return NextResponse.json(analyzeData);
  } catch (error) {
    console.error('Error sending data to Flask server:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
