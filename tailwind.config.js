export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-gentle': 'bounce 1s infinite',
        'pulse-slow': 'pulse 2s infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'search-pulse': 'searchPulse 2s ease-in-out infinite',
        'delete-pulse': 'deletePulse 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { 
            'box-shadow': '0 0 5px rgba(59, 130, 246, 0.5)' 
          },
          '100%': { 
            'box-shadow': '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)' 
          },
        },
        searchPulse: {
          '0%, 100%': {
            'background-color': 'rgba(34, 197, 94, 0.3)',
            'box-shadow': '0 0 10px rgba(34, 197, 94, 0.5)',
          },
          '50%': {
            'background-color': 'rgba(34, 197, 94, 0.6)',
            'box-shadow': '0 0 20px rgba(34, 197, 94, 0.8)',
          },
        },
        deletePulse: {
          '0%, 100%': {
            'background-color': 'rgba(239, 68, 68, 0.3)',
            'box-shadow': '0 0 10px rgba(239, 68, 68, 0.5)',
          },
          '50%': {
            'background-color': 'rgba(239, 68, 68, 0.6)',
            'box-shadow': '0 0 20px rgba(239, 68, 68, 0.8)',
          },
        },
      },
      colors: {
        'dark-blue': {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a5b8ff',
          400: '#8191ff',
          500: '#5f6bff',
          600: '#4c4fff',
          700: '#4038eb',
          800: '#3530c7',
          900: '#2f2da0',
          950: '#1a1a2e',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'gradient-intro': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-concepts': 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
        'gradient-types': 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
        'gradient-text': 'linear-gradient(45deg, #ffd700, #ff6b6b)',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-blue': 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
        'gradient-pink': 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
        'gradient-amber': 'linear-gradient(to bottom right, #f59e0b, #ea580c, #dc2626)',
        'gradient-dark': 'linear-gradient(to bottom right, #1e293b, #7c3aed, #1e40af)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      screens: {
        xs: '475px',
      },
    },
  },
}