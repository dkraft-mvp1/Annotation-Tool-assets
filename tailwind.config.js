// https://tailwindcss.com/docs/guides/create-react-app

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      height: { '1/10': '10%', '9/10': '90%', '7/8': '97%', '1/8': '8%' },
      width: {
        '1/8': '12.5%',
        '7/8': '97%'
      },
      colors: {
        'app-primary': '#3C38CD',
        'app-secondary': '#785BD4',
        'app-pink': '#CE8CDD',
        'app-red': '#F3636E',
        'app-green': '#48B979',
        'app-grey': '#BCBCBC',
        'app-dark-grey': '#5E5E5E',
        'app-light-green': '#EBFAF6',
        'app-text-primary': '#1A1A1A',
        'app-purple-heading': '#6042D1',
        'app-button-primary-disabled': '#DADADA'
      },
      backgroundImage: {
        'app-gradient-setting':
                'linear-gradient(0deg, #FAFAFA, #FAFAFA), linear-gradient(180deg, #FFE9FB 0%, #E9F4FF 52.08%, #9E9FFF 100%);'
      },
      borderWidth: {
        'app-w-1.5': '1.5px',
        'app-w-3': '3px'
      },
      fontFamily: {
        plex: ['IBM Plex Sans', 'sans-serifs']
      }
    }

  },
  plugins: []
}
