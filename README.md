# Özgür Filistin - Free Palestine Türkiye

A solidarity platform supporting Palestine from Turkey. This website provides current information about the humanitarian crisis in Gaza, Turkey's aid efforts, and ways for Turkish citizens to show support for Palestine.

## About the Project

This platform aims to:
- Raise awareness about the ongoing humanitarian crisis in Palestine
- Provide current statistics and news updates
- Showcase Turkey's solidarity and humanitarian aid efforts
- Offer actionable ways for supporters to help (sharing, petitions, BDS movement)
- Create a Turkish-language resource for Palestine solidarity

## Features

- **Current Crisis Data**: Real-time statistics from UN, WHO, and other reliable sources
- **Turkish Content**: Fully localized for Turkish audience
- **News Updates**: Latest developments from Gaza and international solidarity efforts
- **Action Center**: Ways to support Palestine through sharing, petitions, and economic resistance
- **Responsive Design**: Works on desktop and mobile devices
- **Bilingual Support**: Turkish/English language toggle

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans and Geist Mono
- **Build Tool**: Turbopack

## Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Project Structure

```
app/
├── page.tsx          # Main homepage
├── layout.tsx        # Root layout with metadata
├── globals.css       # Global styles
├── bilgilendirme/    # Information pages
├── haberler/         # News pages
└── eylemler/         # Actions pages

public/
├── logo.svg          # Palestinian flag logo
└── hero.jpg          # Hero background image
```

## Data Sources

The website uses current data from:
- United Nations (UN) reports
- World Health Organization (WHO)
- Turkish government humanitarian aid statistics
- Reliable international news sources

## Contributing

This is a community-driven project supporting Palestine. Contributions are welcome for:
- Content updates and translations
- Technical improvements
- Design enhancements
- Additional features for solidarity actions

## Deployment

The application can be deployed on:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

For Vercel deployment:
```bash
npm run build
```

## License

This project is created to support humanitarian causes and promote awareness about Palestine.
