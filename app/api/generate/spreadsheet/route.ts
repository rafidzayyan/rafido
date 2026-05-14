import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import * as XLSX from 'xlsx';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, reference } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert at creating Excel spreadsheets. Generate a JSON array of objects representing the rows of an Excel spreadsheet based on the user's prompt. Each object should have keys as column headers and values as cell data. Include formulas where appropriate using Excel formula syntax (e.g., =SUM(A1:A10)). Ensure the data is structured and useful.`;

    const userMessage = `Prompt: ${prompt}\n${reference ? `Reference: ${reference}` : ''}\n\nReturn only a valid JSON array of objects, no additional text.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonData = JSON.parse(content.text.trim());

    if (!Array.isArray(jsonData)) {
      throw new Error('Response is not a valid JSON array');
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write to buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return as downloadable file
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="spreadsheet.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error generating spreadsheet:', error);
    return NextResponse.json({ error: 'Failed to generate spreadsheet' }, { status: 500 });
  }
}