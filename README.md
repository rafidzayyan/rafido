# Digital Product Generator

A Next.js 14 application that generates digital products including Excel spreadsheets, children's worksheets, and ebooks using AI.

## Features

- **Excel Spreadsheet Generator**: Create custom spreadsheets with formulas based on your prompts
- **Children Worksheet Generator**: Generate PDF worksheets for kids with exercises
- **Ebook Generator**: Produce complete ebooks with cover, table of contents, and chapters

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local` and add your Anthropic API key:
     ```
     ANTHROPIC_API_KEY=your_actual_api_key_here
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This app is configured for deployment on Vercel. After pushing to GitHub, connect your repository to Vercel for automatic deployments.

## Usage

1. Navigate to the homepage and choose a generator
2. Enter your prompt describing what you want to create
3. Click generate and download your digital product

Recent generations are stored locally and displayed on the homepage.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
