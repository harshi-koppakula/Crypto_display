# Crypto Dashboard

A React TypeScript application that displays cryptocurrency market data using the CoinGecko API.

## Features

- View top cryptocurrencies with market data
- Search and sort functionality
- Highlights section with top gainers, losers, and trending coins
- Responsive design using Bootstrap
- Pagination for browsing through coins
- Detailed coin information in modal view

## Tech Stack

- React 18 with TypeScript
- Vite as build tool
- Bootstrap and React Bootstrap for UI
- Axios for API requests
- Repository pattern for data management

## Design Patterns Used

1. **Repository Pattern**: Separated data access logic into a dedicated `CoinGeckoRepository` class
2. **Custom Hooks**: Created `useCoinGecko` for centralized state management
3. **Component Composition**: Built reusable UI components
4. **Separation of Concerns**: Clear separation between UI, business logic, and data layers

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and add your CoinGecko API key
4. Start the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) to view the app

## API Key Setup

1. Sign up for a free API key at [CoinGecko](https://www.coingecko.com/api/documentation)
2. Create a `.env` file in the root directory
3. Add your API key: `VITE_COINGECKO_API_KEY=your_api_key_here`

## Assumptions and Limitations

- Using the free tier of CoinGecko API which has rate limits
- Pagination is implemented but limited to 10 pages for demonstration
- Error handling is basic but functional
- No user authentication implemented

## Future Improvements

- Implement real-time updates using WebSockets
- Add more advanced charting for price history
- Implement portfolio tracking features
- Add more comprehensive error handling and retry mechanisms
- Implement testing with Jest and React Testing Library
- Add service worker for offline functionality"# Crypto_display" 
