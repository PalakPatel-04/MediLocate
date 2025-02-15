# MediLocate

MediLocate is a platform designed to help users quickly find nearby medical facilities, including hospitals, clinics, and pharmacies, based on their location. The application provides real-time location-based results, ensuring users can access healthcare services conveniently.

## Features
- **Real-time Location Tracking**: Automatically detects the user's location to show nearby medical facilities.
- **Detailed Information**: Displays details like contact information, address, and distance of medical facilities.
- **User-friendly Interface**: Easy-to-navigate UI with a clean and responsive design.
- **Google Maps Integration**: View locations directly on a map for better navigation.

## Tech Stack
- **Frontend**: React.js / Vite.js (for UI components, for handling API requests and user interactions)
- **Database**: Supabase (for Google authentication)
- **Maps & Location Services**: OpenStreetMap API (for Map), OverPass API (for nearby hospitals), OpenRouteService(for distance calculation)

## Installation & Setup
To set up the project locally, follow these steps:

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/PalakPatel-04/MediLocate.git
   cd MediLocate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_SUPABASE_URL=your_url
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```
   The application should now be running at `http://localhost:5173/`.

## Usage
- Open the app in a web browser (preferablly chrome).
- Allow location access when prompted.
- It automatically search for hospitals.
- View details and directions to the facility.

## Contribution
Contributions are welcome! If you'd like to contribute:
1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Make your changes and commit them.
4. Push to your fork and submit a Pull Request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

