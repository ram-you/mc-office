import './main.styl'

import Vue from 'vue'

import {
  Vuetify,
  VApp,
  VCard,
  VMenu,
  VBreadcrumbs,
  VForm,
  VNavigationDrawer,
  VFooter,
  VList,
  VSubheader,
  VTextField,
  VDialog,
  VCheckbox,
  VDataTable,
  VTabs,
  VDivider,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,VChip,VSwitch,VStepper,VRadioGroup,VTooltip,VProgressLinear,VProgressCircular,VAvatar,VSelect,
  transitions
} from 'vuetify'

import {
  Ripple
} from 'vuetify/es5/directives'



Vue.use(Vuetify, {
  components: {
    VApp,
    VCard,
    VMenu,
    VBreadcrumbs,
    VForm,
    VNavigationDrawer,
    VFooter,
    VList,
    VSubheader,
    VTextField,
    VDialog,
    VCheckbox,
    VDataTable,
    VTabs,
    VDivider,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,VChip,VSwitch,VStepper,VRadioGroup,VTooltip,VProgressLinear,VProgressCircular,VAvatar,VSelect,
    transitions
  },
  theme: {
    primary: "#0583d2",
    secondary: "#e57373",
    accent: "#9c27b0",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50"
  },
  iconfont: 'mdi',
  icons: {
    'product': 'mdi-dropbox',
    'support': 'mdi-lifebuoy',
    'steam': 'mdi-steambox',
    'pc': 'mdi-desktop-classic',
    'xbox': 'mdi-xbox',
    'playstation': 'mdi-playstation',
    'switch': 'mdi-nintendo-switch'
  },
  directives: {
    Ripple
  },
  options: {
    minifyTheme: function(css) {
      return process.env.NODE_ENV === 'production' ?
        css.replace(/[\s|\r\n|\r|\n]/g, '') :
        css
    }
  },
})