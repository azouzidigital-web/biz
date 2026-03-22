// This route serves as an alternative handler for form submissions
// in case the Netlify forms functionality doesn't work as expected

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Log form data for debugging
    const formEntries: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        formEntries[key] = value;
      }
    }
    
    console.log('Form submission received in API route:', formEntries);
    
    // You could store form data in a database or send an email here
    
    // For development/debug purposes, log all headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('Request headers:', headers);
    
    // Return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      data: formEntries
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process form submission' 
      },
      { status: 500 }
    );
  }
}
