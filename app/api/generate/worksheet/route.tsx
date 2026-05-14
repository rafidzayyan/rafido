import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2563eb',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 30,
    lineHeight: 1.5,
  },
  exercise: {
    fontSize: 18,
    marginBottom: 15,
    lineHeight: 2,
  },
  problem: {
    fontWeight: 'bold',
  },
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert at creating educational worksheets for children. Generate a JSON object with the following structure: { "title": "Worksheet Title", "instructions": "Clear instructions for the child", "exercises": [{"problem": "Problem text with ___ for blanks"}] }. Make it age-appropriate, fun, and educational. Use large, clear text suitable for kids.`;

    const userMessage = `Create a worksheet based on: ${prompt}\n\nReturn only valid JSON, no additional text.`;

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

    const data = JSON.parse(content.text.trim());

    // Create PDF
    const MyDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.instructions}>{data.instructions}</Text>
          {data.exercises.map((exercise: any, index: number) => (
            <View key={index} style={styles.exercise}>
              <Text style={styles.problem}>{index + 1}. {exercise.problem}</Text>
            </View>
          ))}
        </Page>
      </Document>
    );

    const buffer = await renderToBuffer(<MyDocument />);

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="worksheet.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating worksheet:', error);
    return NextResponse.json({ error: 'Failed to generate worksheet' }, { status: 500 });
  }
}