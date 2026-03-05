import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './styles/**/*.css'],
  theme: {
    extend: {
      colors: {
        mab: {
          darkBlue: '#071A2D',
          slate: '#1A2E45',
          gold: '#C9A24E',
          offWhite: '#F6F5EF'
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(201, 162, 78, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
