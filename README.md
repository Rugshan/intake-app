# Intake Tracker

A modern desktop application for tracking daily protein and water intake, built with Tauri + React + TypeScript.

## Features

- **Daily Progress Tracking**: Monitor your protein and water intake with beautiful progress bars
- **Goal Setting**: Set and customize daily goals for both protein and water
- **Weekly Overview**: View your intake patterns with interactive charts
- **Entry Management**: Add and remove intake entries throughout the day
- **Data Persistence**: All data is stored locally using localStorage
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations

## Screenshots

The app features:
- Progress cards showing daily intake vs goals
- Weekly bar charts for trend analysis
- Goal setting with intuitive controls
- Entry list with timestamps
- Modal for adding new entries

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Desktop**: Tauri (Rust backend)
- **Styling**: Modern CSS with CSS Variables
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Rust (for desktop builds)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd intake-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:1420/`

### Building for Desktop

To build the desktop application, you'll need Rust installed:

1. Install Rust: https://www.rust-lang.org/learn/get-started
2. Build the desktop app:
```bash
npm run tauri build
```

## Usage

### Adding Entries
1. Click the "Add Entry" button
2. Enter protein amount (in grams) and/or water amount (in ml)
3. Click "Save Entry"

### Setting Goals
1. Use the +/- buttons or type directly in the goal inputs
2. Goals are automatically saved and persist between sessions

### Viewing Progress
- Progress bars show current intake vs daily goals
- Weekly chart displays intake patterns over the past 7 days
- Entry list shows all today's entries with timestamps

## Data Storage

All data is stored locally in the browser's localStorage:
- `intakeEntries`: Array of all intake entries
- `intakeGoals`: Current daily goals

## Development

### Project Structure
```
src/
├── App.tsx          # Main application component
├── App.css          # Styles
├── main.tsx         # Application entry point
└── assets/          # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run tauri dev` - Run desktop app in development
- `npm run tauri build` - Build desktop app

## Future Enhancements

- [ ] Export data to CSV/PDF
- [ ] Multiple user profiles
- [ ] Advanced analytics and insights
- [ ] Mobile app version
- [ ] Cloud sync
- [ ] Meal planning integration
- [ ] Barcode scanning for food items

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue on GitHub.
