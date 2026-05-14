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
    fontFamily: 'Times-Roman',
  },
  coverPage: {
    padding: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  coverAuthor: {
    fontSize: 18,
    textAlign: 'center',
  },
  tocPage: {
    padding: 50,
  },
  tocTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  tocItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  chapterPage: {
    padding: 50,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chapterBody: {
    fontSize: 12,
    lineHeight: 1.6,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert ebook writer. Generate a JSON object with the following structure: { "title": "Ebook Title", "subtitle": "Subtitle", "author": "Author Name", "chapters": [{"heading": "Chapter Title", "body": "Chapter content paragraphs"}] }. Create engaging, well-structured content based on the prompt.`;

    const userMessage = `Create an ebook based on: ${prompt}\n\nReturn only valid JSON, no additional text.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
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
        {/* Cover Page */}
        <Page size="A4" style={styles.coverPage}>
          <Text style={styles.coverTitle}>{data.title}</Text>
          <Text style={styles.coverSubtitle}>{data.subtitle}</Text>
          <Text style={styles.coverAuthor}>by {data.author}</Text>
        </Page>

        {/* Table of Contents */}
        <Page size="A4" style={styles.tocPage}>
          <Text style={styles.tocTitle}>Table of Contents</Text>
          {data.chapters.map((chapter: any, index: number) => (
            <Text key={index} style={styles.tocItem}>
              {index + 1}. {chapter.heading}
            </Text>
          ))}
        </Page>

        {/* Chapters */}
        {data.chapters.map((chapter: any, index: number) => (
          <Page key={index} size="A4" style={styles.chapterPage}>
            <Text style={styles.chapterTitle}>Chapter {index + 1}: {chapter.heading}</Text>
            <Text style={styles.chapterBody}>{chapter.body}</Text>
          </Page>
        ))}
      </Document>
    );

    const buffer = await renderToBuffer(<MyDocument />);

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="ebook.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating ebook:', error);
    return NextResponse.json({ error: 'Failed to generate ebook' }, { status: 500 });
  }
}