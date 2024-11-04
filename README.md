# Random Utility Apps

This is a [Next.js](https://nextjs.org) project consisting of various mini apps designed for utility purposes. The project is bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview

This project currently includes the following mini apps:

- **QR Generator**: Generate QR codes from text input.
- **SGPA Calculator**: Calculate your SGPA based on your course grades and credits.
- **Dictionary**: Search for the meaning of words. Some words may not be present depending on their availability in Free Dictionary API.
- **Currency Converter**: Convert currency from one unit to another. The exchange rates are fetched from Freecurrency API.
- **Color Picker**: Pick colors from a color palette and copy the hex code to clipboard. Also allows to check different palettes.
- **Weather App**: Get the current weather of a city. The weather data is fetched from OpenWeather API. Only works for cities in India for now.

More mini apps will be added in the future to enhance the utility of this project.

## Getting Started

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/shrey715/utility_apps.git
cd utility_apps
```

Then, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages by modifying the files in the `app` directory. The pages auto-update as you edit the files.

## Deployment

This project is deployed on Vercel. You can access the live version at the following link:

[https://utility-apps-psi.vercel.app/](https://utility-apps-psi.vercel.app/)