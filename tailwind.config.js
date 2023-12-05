export default {
  corePlugins: {
    preflight: false,
  },
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  variants: {
    extend: {
      borderColor: ['focus-visible'],
      outline: ['focus-visible'],
      ringColor: ['focus-visible'],
      ringOffsetColor: ['focus-visible'],
      ringOffsetWidth: ['focus-visible'],
      ringOpacity: ['focus-visible'],
      ringWidth: ['focus-visible'],
      opacity: ['disabled'],
    },
  },
}
