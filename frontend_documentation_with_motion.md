# Frontend Documentation – Cognify Companion

This documentation describes the frontend architecture and components used in the `cognify-companion` folder of the Cognify Companion research assistant project.

## Overview

The frontend is built using **Next.js 13+ (App Router)** and **TypeScript**, styled with **Tailwind CSS**, and enhanced with **Framer Motion** for smooth UI animations. It provides an interactive and responsive interface for uploading research PDFs and displaying AI-generated insights.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Axios (for backend API calls)
- Framer Motion (for animations)
- Modular Component Design

## Project Structure

```
cognify-companion/
└── src/
    └── app/
        ├── components/
        │   ├── FeatureCard.tsx
        │   ├── FeaturesSection.tsx
        │   ├── Footer.jsx
        │   ├── HeroSection.tsx
        │   ├── HowItWorksSection.tsx
        │   ├── IntroVideoSection.tsx
        │   └── Navbar.tsx
        ├── result/
        │   └── page.tsx
        ├── upload/
        │   └── page.tsx
        ├── layout.tsx
        ├── page.tsx
        └── global.css
```

## Key Pages

### `/upload/page.tsx`
- Allows users to upload a research paper (PDF)
- Sends `POST` request to backend endpoint `/uploadfile/`
- On success, redirects or displays result

### `/result/page.tsx`
- Displays the output: summary, keywords, project ideas, and methodology
- Reads result from state or context (or local storage)

### `layout.tsx`
- Global layout and structure for the App Router

## Main Components

| Component              | Description                                              |
|------------------------|----------------------------------------------------------|
| `Navbar.tsx`           | Top navigation bar with links to sections                |
| `HeroSection.tsx`      | Intro section with heading and call-to-action            |
| `FeaturesSection.tsx`  | Lists benefits or capabilities of the app                |
| `HowItWorksSection.tsx`| Describes steps to use the app                           |
| `IntroVideoSection.tsx`| Optionally embed walkthrough or explanation video        |
| `Footer.jsx`           | Footer with copyright or links                           |

## Animations

This project uses [Framer Motion](https://www.framer.com/motion/) to animate components such as cards, page transitions, and interactive sections.

**Example usage in a component:**
```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <FeatureCard />
</motion.div>
```

## API Communication

All API requests are handled using Axios (or native `fetch`) to:

```
POST http://localhost:8000/uploadfile/
```

**Upload Example:**
```ts
const formData = new FormData();
formData.append("file", file);

const res = await fetch("http://localhost:8000/uploadfile/", {
  method: "POST",
  body: formData
});
const data = await res.json();
```

## Styling

- Styled using **Tailwind CSS**
- Configured via `tailwind.config.js`
- Global styles defined in `global.css`

## Running the Frontend

### 1. Install dependencies
```bash
cd cognify-companion
npm install
npm install framer-motion
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Visit in browser
```
http://localhost:3000
```

## Deployment Notes

- This project is ready for deployment to **Vercel**, **Netlify**, or any static host with Next.js support.
- Make sure to define the backend API base URL using `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Author

Sherone Namasivayam  
GitHub: https://github.com/NSherone

## License

MIT License © 2025 Sherone Namasivayam