module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  variants: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],

  corePlugins: {
    // ...
    preflight: false,
  },
  unknownAtRules: 'ignore',
  unknownAtRules: 'throw',
  unknownAtRules: (atRule, { }) => {
    // Custom handler logic here
    // ...
  },


}
