/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-bg': '#F5F7F9',           // Exact light gray/blue background
        'agri-surface': '#FFFFFF',      // White cards
        'agri-primary': '#06291C',      // Exact very dark green for buttons
        'agri-primary-hover': '#093B28',
        'agri-secondary': '#A4C6B1',    
        'agri-secondary-light': '#D6E5DB', 
        'agri-icon-bg': '#E2EBE5',      // Light green circle bg
        'agri-icon-color': '#21513B',
        'agri-warning-bg': '#FCEAE8',   // Light red bg
        'agri-warning-color': '#D0342C', // Exact Red icon/text
        'agri-text-main': '#171A1F',    // Almost black text
        'agri-text-muted': '#565D6D',   // Gray text
        'agri-border': '#EAECEF',       // Light border
        'agri-today-bg': '#F1F4F2',     // Weather today bg
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
