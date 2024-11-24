import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#6A1B9A',
          secondary: '#8E24AA',
          accent: '#B39DDB',
          error: '#FF5252',
          info: '#D5D3D7FF',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
})

export default vuetify
