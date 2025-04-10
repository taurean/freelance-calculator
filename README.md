# Freelance Rate Calculator

A React-based tool for freelancers to calculate recommended rates based on current compensation, with adjustable parameters for different scenarios.

🚀 [Live Demo](https://taurean.github.io/freelance-calculator/)

![Freelance Calculator Screenshot](https://placehold.co/600x400?text=Freelance+Calculator)

## Features

- Calculate rates based on current salary/compensation package
- Convert annual salary to hourly, daily, and weekly rates
- Apply adjustable multipliers for freelance pricing
- Create different rates for standard, friends & family, and mission-based work
- Project cost estimator with tax calculation
- Responsive design works on any device
- Settings automatically saved in your browser

## Usage

1. Enter current compensation details (salary, bonus, stock, etc.)
2. Adjust multipliers based on your business needs
3. View calculated rates for different client types
4. Use the project estimator to calculate costs for specific projects

## Development

### Prerequisites
- Node.js 16+ installed

### Local Setup

```bash
# Clone the repository
git clone https://github.com/taurean/freelance-calculator.git
cd freelance-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the app
npm run build

# Preview the production build locally
npm run preview
```

## Deployment

This project uses GitHub Actions to automatically deploy to GitHub Pages when changes are pushed to the main branch. The workflow:

1. Builds the React application with Vite
2. Deploys the built files to GitHub Pages
3. Makes the app available at the project's GitHub Pages URL

## Credits

Created with [Claude Code](https://claude.ai/code) by Anthropic

## License

ISC License