# 🏢 Office Location Planner

A powerful web application for optimizing office locations based on employee commute data. Calculate driving and public transit times, visualize commute patterns, and find the optimal office placement to minimize travel time for your team.

![Office Location Planner](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Mapbox](https://img.shields.io/badge/Mapbox-GL%20JS-orange)

## ✨ Features

### 🗺️ **Interactive Mapping**
- **Draggable office marker**: Move the red marker to test different office locations
- **Real-time recalculation**: Commute times update instantly when office location changes
- **Employee home markers**: Blue markers show where your employees live
- **Client office markers**: Orange markers for employees with satellite/client offices
- **Stable map rendering**: No more black screen issues during interactions

### 🚗🚇 **Comprehensive Commute Analysis**
- **Dual transport modes**: Driving and public transit calculations
- **Door-to-door accuracy**: Transit includes walking to/from stops and waiting times
- **Route details**: See actual bus/train lines and stops for transit routes
- **Distance and duration**: Complete metrics for informed decision-making
- **Color-coded results**: Green (good), Yellow (moderate), Red (poor) commute times

### 🏢 **Multiple Office Support**
- **Main office**: Primary headquarters location (red marker)
- **Client offices**: Secondary locations where employees work part-time
- **Dual calculations**: See commute times to BOTH main and client offices
- **Flexible assignment**: Some employees can have client offices, others don't

### 📊 **Smart Analytics & Business Intelligence**
- **Average commute times**: Driving and transit averages across all employees
- **Employee ranking**: Sorted by commute duration for easy analysis
- **Office optimization**: AI-powered suggestion for optimal office placement
- **Real-time statistics**: Updates as you move the office location
- **Excel export**: Comprehensive business reports with 3 detailed sheets
- **Interactive charts**: Employee distribution, bell curve analysis, transport preferences
- **Business insights**: Data-driven recommendations for office location decisions

### 📁 **CSV Data Import**
- **Simple format**: Address, Name, Client Office (optional)
- **Automatic geocoding**: Converts addresses to precise coordinates
- **Sydney-focused**: Optimized for Sydney metropolitan area
- **Error handling**: Graceful handling of invalid addresses

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Mapbox API key
- Google Maps API key (for transit directions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/office-planner-claude.git
   cd office-planner-claude
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

   **Get your API keys:**
   - **Mapbox**: [mapbox.com](https://mapbox.com) → Account → Access Tokens
   - **Google Maps**: [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage Guide

### CSV File Format

Create a CSV file with your employee data using this format:

```csv
Employee Address,Name,Client Office Address
123 George Street Sydney,John Doe,456 Pitt Street Sydney
456 Pitt Street Sydney,Jane Smith,
789 Elizabeth Street Sydney,Bob Wilson,100 Miller Street Sydney
```

**Important notes:**
- **Column 1**: Employee home address (required)
- **Column 2**: Employee name (required)
- **Column 3**: Client office address (optional - leave empty if not applicable)
- **Header row**: Not required, will be automatically skipped
- **Location**: All addresses should be in Sydney, Australia

### Step-by-Step Workflow

1. **📍 Set office location**
   - Enter an address in the search box, OR
   - Drag the red marker on the map

2. **📁 Upload employee data**
   - Click "Choose file" and select your CSV
   - Wait for automatic geocoding and commute calculations

3. **📊 Analyze results**
   - Review statistics panel for average commute times
   - Check individual employee commute details
   - Compare driving vs. transit options

4. **🎯 Optimize location**
   - Click "Optimize Office Location" for AI-suggested placement
   - Manually drag the red marker to test alternatives
   - Watch real-time updates to commute calculations

5. **🏢 Review client offices**
   - See orange markers for employees with client/satellite offices
   - Compare commute times to both main and client locations
   - Make informed decisions about multi-location strategies

6. **📊 Generate business reports**
   - Click "Export to Excel" for comprehensive analysis
   - Review interactive charts for visual insights
   - Use business intelligence data for strategic planning

## 🎨 Visual Guide

### Map Elements
- 🔴 **Red Marker**: Main office location (draggable)
- 🔵 **Blue Markers**: Employee home locations
- 🟠 **Orange Markers**: Client/satellite office locations

### Commute Time Color Coding
- **Driving**: 🟢 ≤10 min • 🟡 10-20 min • 🔴 >20 min
- **Transit**: 🟢 ≤40 min • 🟡 40-60 min • 🔴 >60 min

### Employee List Display
```
Rachel Smith
📍 16 Rafferty St Chapman ACT

🔴 Main Office:
   🚗 11 min drive • 3.8 km
   🚇 25 min transit • 3.6 km
   Route: T1 (Central → Town Hall)

🟠 Client Office:
   456 Pitt Street Sydney
   🚗 8 min drive • 2.1 km
   🚇 15 min transit • 1.8 km
   Route: 304 (Circular Quay-Alfred St → Martin Place Station)
```

## 🛠️ Technical Architecture

### Frontend
- **Next.js 15.3.3**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Mapbox GL JS**: Interactive mapping
- **Recharts**: Interactive data visualization
- **XLSX**: Excel export functionality

### APIs & Services
- **Mapbox Geocoding API**: Address → coordinates conversion
- **Mapbox Directions API**: Driving route calculations
- **Google Directions API**: Public transit routing
- **Next.js API Routes**: CORS-free backend integration

### Key Features
- **Real-time calculations**: No page refreshes needed
- **Responsive design**: Works on desktop and mobile
- **Error handling**: Graceful degradation for API failures
- **Rate limiting**: Respectful API usage patterns
- **Map stability**: No black screen issues during interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The app works on any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 API Configuration

### Mapbox Setup
1. Create account at [mapbox.com](https://mapbox.com)
2. Generate access token with these scopes:
   - `styles:read`
   - `fonts:read` 
   - `datasets:read`
   - `geocoding:read`
   - `directions:read`

### Google Maps Setup
1. Create project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable these APIs:
   - Directions API
   - Geocoding API (optional backup)
3. Create API key and restrict to your domain

## 📊 Use Cases

### Corporate Relocation
- **Scenario**: Company moving to new city/area
- **Solution**: Upload employee addresses, find optimal office location
- **Benefit**: Minimize average commute time across entire team

### Multi-Location Strategy
- **Scenario**: Employees split time between main office and client sites
- **Solution**: Add client office addresses to see dual commute patterns
- **Benefit**: Optimize both primary and secondary office locations

### Hybrid Work Planning
- **Scenario**: Determining which employees should come to office which days
- **Solution**: Identify employees with longest commutes for remote work priority
- **Benefit**: Data-driven hybrid work policies

### Site Selection
- **Scenario**: Choosing between multiple potential office locations
- **Solution**: Test each location by dragging the red marker
- **Benefit**: Quantitative comparison of commute impact

## 🏷️ Version History

### v3.0 - Analytics & Business Intelligence (Current)
- ✅ Excel export with 3 comprehensive sheets
- ✅ Interactive charts (Employee Distribution, Bell Curve, Transport Preferences)
- ✅ Business insights dashboard
- ✅ Data-driven office location recommendations
- ✅ Visual analytics for strategic planning

### v2.0 - Client Offices
- ✅ Client office support via CSV
- ✅ Dual commute calculations 
- ✅ Orange client office markers
- ✅ Removed walking functionality
- ✅ Enhanced UI with hierarchical display

### v1.0 - Transit Integration
- ✅ Google Directions API integration
- ✅ Public transport routing
- ✅ Map stability fixes
- ✅ Walking, driving, and transit modes

### v0.1 - Initial Release  
- ✅ Basic office location planning
- ✅ Employee geocoding
- ✅ Mapbox integration
- ✅ CSV upload functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
```bash
git clone https://github.com/your-username/office-planner-claude.git
cd office-planner-claude
npm install
cp .env.local.example .env.local  # Add your API keys
npm run dev
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mapbox** for excellent mapping APIs and documentation
- **Google Maps** for comprehensive transit data
- **Next.js team** for the amazing React framework
- **Claude AI** for development assistance and code generation

---

## 💡 Future Ideas & Enhancements

### 🎯 Advanced Analytics
- **Cost analysis**: Factor in rent prices, utilities, and regional costs
- **Commute cost calculator**: Include fuel, parking, and transit fares
- **Time-of-day optimization**: Account for peak hour traffic variations
- **Weather impact**: Seasonal commute time adjustments
- **Employee satisfaction surveys**: Integrate preference data beyond commute time

### 🚀 Scale & Performance
- **Multi-city support**: Expand beyond Sydney to other major cities
- **Bulk processing**: Handle thousands of employees efficiently
- **API rate optimization**: Implement smart caching and batching
- **Real-time traffic data**: Live commute time updates
- **Historical trend analysis**: Track commute patterns over time

### 🏢 Enterprise Features
- **Multiple office locations**: Compare 3+ potential sites simultaneously
- **Department-based analysis**: Segment employees by team/department
- **Flexible work schedules**: Model hybrid work patterns
- **Accessibility analysis**: Public transport wheelchair accessibility
- **Environmental impact**: Carbon footprint calculations

### 📱 User Experience
- **Mobile-first design**: Optimize for smartphone usage
- **Offline mode**: Cache data for areas with poor connectivity
- **Dark mode**: Professional appearance for extended use
- **Collaborative planning**: Share analyses with stakeholders
- **Custom branding**: White-label solution for consultants

### 🔗 Integrations
- **HR systems**: Import employee data from Workday, BambooHR
- **Real estate platforms**: Integrate with commercial property listings
- **Calendar systems**: Factor in meeting schedules and office requirements
- **Slack/Teams**: Share insights directly in workplace chat
- **Power BI/Tableau**: Export data for advanced business intelligence

### 🌐 Global Expansion
- **International support**: Routing for London, NYC, Tokyo, etc.
- **Multi-language**: Localized interface and address parsing
- **Currency conversion**: Cost analysis in local currencies
- **Cultural factors**: Region-specific commute preferences
- **Compliance**: GDPR, privacy regulations by jurisdiction

### 🤖 AI & Machine Learning
- **Predictive modeling**: Forecast future commute trends
- **Smart recommendations**: AI-powered office location suggestions
- **Anomaly detection**: Identify unusual commute patterns
- **Natural language queries**: "Find offices near the subway"
- **Automated reporting**: Generate insights via AI analysis

---

**Built with ❤️ using Claude Code**

For support or questions, please open an issue on GitHub.
