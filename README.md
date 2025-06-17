# Office Location Planner

A Next.js application that helps businesses optimize office location selection by analyzing employee commute times. The app allows users to upload a CSV of employee addresses, visualizes them on an interactive map, and calculates both walking and driving commute times to potential office locations.

## Features

- **CSV Upload**: Import employee addresses and names
- **Interactive Map**: Visualize employee locations and potential office sites
- **Dual Transport Modes**: Calculate both walking and driving commute times
- **Real-time Updates**: Instantly see commute impacts when moving the office location
- **Address Search**: Enter specific addresses to evaluate as office locations
- **Office Location Optimization**: Automatically calculate the optimal office location based on employee distribution
- **Visual Analytics**: Color-coded commute times for quick analysis
- **Detailed Statistics**: View average commute times and individual employee metrics

## Office Location Optimization

The application includes a smart optimization feature that can automatically suggest an optimal office location based on employee distribution:

- **Centroid Calculation**: Computes the geographic center point of all employee locations
- **One-Click Optimization**: Simply click the "Optimize Office Location" button after uploading employee data
- **Visual Feedback**: The map animates to show the suggested optimal location
- **Instant Analysis**: Commute times are immediately recalculated for the suggested location
- **Balanced Approach**: Provides a reasonable approximation that minimizes overall commute distances

## Getting Started

First, set up your environment:

1. Create a `.env.local` file with your Mapbox access token:
   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter an office address or drag the red marker on the map
2. Upload a CSV file with employee addresses (format: address,name)
3. View the commute statistics and employee list
4. Click "Optimize Office Location" to find the optimal location
5. Explore different locations by dragging the marker or entering new addresses

## Potential Improvements

### Enhanced Optimization Algorithms
- Weighted optimization based on employee roles or frequency of office visits
- Grid search for more precise location optimization
- Multi-office optimization for distributed teams
- Integration with public transit options

### Advanced Analytics
- Heat maps showing commute time zones
- Cost analysis incorporating commercial real estate prices
- Accessibility scoring for public amenities
- Traffic pattern analysis for different times of day

### Additional Features
- Save/load different scenarios
- Export reports as PDF or Excel
- Historical analysis tracking
- Employee preference surveys

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript and React 19
- **Mapping**: Mapbox GL JS
- **Styling**: Tailwind CSS
- **APIs**: Mapbox Geocoding and Directions APIs

## License

This project is open source and available under the [MIT License](LICENSE).
