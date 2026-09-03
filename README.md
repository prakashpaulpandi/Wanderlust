# ✈ Wanderlust — AI-Powered Travel Explorer

A modern, design-led travel web application built for the **Front-End Developer Assessment** at **Design Esthetics**. 

Wanderlust helps travelers explore 20 curated world destinations, check live weather, discover famous places with dynamic photos, chat with an AI travel companion, and generate personalized, day-by-day travel itineraries.

---

## 🌟 Key Features

### 01. Landing Experience with Video Hero
- Immersive hero banner featuring a looping background video.
- Smooth entrance animations powered by Framer Motion.
- Quick navigation and real-time statistics preview.

### 02. Destination Explorer
- Browse 20 world destinations across 6 continents.
- Real-time search with debounced input.
- Multi-category filtering (Continent & Trip Type: Cultural, Romantic, Beach, Historic, Modern, etc.).
- Dedicated detail pages for each destination.

### 03. Famous Places Showcase
- Notable places and landmarks presented for each destination.
- Dynamic high-resolution imagery fetched from **Pexels API**.
- Numbered badge overlay and hover interactions.

### 04. Location Awareness & Weather Integration
- Geolocation API support to detect user's current coordinates.
- City search fallback for instant weather lookups anywhere in the world.
- Integrated **OpenWeather API** showing real-time temperature, condition icons, humidity, wind speed, and visibility.
- Comprehensive handling for denied location permissions, loading states, and API failures.

### 05. AI Chatbot (Google Gemini API)
- Interactive travel assistant for every destination.
- Context-aware responses answering questions on best times to visit, local customs, budgeting, and packing lists.
- Suggested quick-prompt chips for common questions.
- Accessible keyboard shortcuts and real-time typing indicators.

### 06. AI Day-by-Day Itinerary Planner
- Generate customized travel itineraries for 2 to 10 days.
- Structured output rendered on the page as interactive, expandable day cards (not raw text).
- Includes Morning, Afternoon, and Evening activities, practical tips, accommodation areas, and estimated costs.
- Optional preference input (e.g. budget, luxury, vegetarian, family-friendly).

---

## 🛠️ Tech Stack & APIs

- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Animations**: Framer Motion
- **HTTP Client**: Axios & Fetch API
- **Styling**: Vanilla CSS with custom design tokens (dark-mode aesthetic, glassmorphic navbar)
- **APIs Used**:
  - 🌤️ **OpenWeather API**: Live weather & forecast data
  - 📸 **Pexels API**: Dynamic destination & place imagery
  - 🤖 **Google Gemini API**: AI travel chatbot & structured itinerary generator

---

## 🎨 Design Decisions & Esthetics

1. **Dark Premium Theme**: Deep navy background (`#080c14`) paired with vibrant amber/gold accents (`#f5a623`), establishing a luxury aesthetic aligned with Design Esthetics branding.
2. **Intentional Motion**: Micro-interactions, hover card elevations, glassmorphic sticky headers, and smooth tab transitions.
3. **Resilient UX**: Custom state handling for loading skeletons, empty search results, denied browser location access, and missing API keys.
4. **Accessibility (a11y)**: Semantic HTML tags (`main`, `nav`, `article`, `header`, `footer`), ARIA labels, focus states, and keyboard navigation.

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/travel-app.git
   cd travel-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the project root (copy from `.env.example`):
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   VITE_PEXELS_API_KEY=your_pexels_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 Live Deployment

Deployed on **Vercel**: `[Your Deployed URL Will Be Placed Here]`

---

## 📁 Repository Structure

```
Travel/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatBot/
│   │   ├── DestinationCard/
│   │   ├── FamousPlaces/
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── ItineraryPlanner/
│   │   ├── LocationWeather/
│   │   ├── Navbar/
│   │   └── WeatherWidget/
│   ├── data/
│   │   └── destinations.js
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   └── useGeolocation.js
│   ├── pages/
│   │   ├── DestinationDetail/
│   │   ├── Destinations/
│   │   └── Home/
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── imageService.js
│   │   └── weatherService.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── vercel.json
└── vite.config.js
```
