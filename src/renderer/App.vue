<template>
  <v-app id="app" :dark="dark=='dark'">
    <header-section v-if="isConnected"></header-section>

    <v-content v-if="isConnected">
      <!-- <transition-slide-up :duration="300"> -->
  <transition-page>
        <router-view/>
  </transition-page>
      <!-- </transition-slide-up> -->

    </v-content>

    <v-content v-else>
      <login-form v-if="isAppInited" />
    </v-content>

    <footer-section></footer-section>

  </v-app>
</template>

<script>   
const Store = require('electron-store');
const _store = new Store();

import LoginForm from './views/Login'
import Header from './views/Header'
import Footer from './views/Footer'
import TransitionSlideUp from "./components/TransitionSlideUp";
import TransitionPage from './components/TransitionPage.vue';
import { setTimeout } from 'timers';
export default {
  name: 'App',
  components: {
    'login-form': LoginForm,
    'header-section': Header,
    'footer-section': Footer,
    'transition-slide-up': TransitionSlideUp,
    TransitionPage
  },
  data() {
    return {
      isHomePage: true,

    }
  },
  computed: {
    dark() { return this.$store.state.User.userTheme; },
    isConnected() { return this.$store.state.User.user; },
    isAppInited() { return this.$store.state.User.appInited; },
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : ""; },
  },
  watch: {
    '$route': function () {
      this.isHomePage = this.$route.name == "home";
    },
    connectedUserName: function (userName) {
      if (userName.length > 0) { this.setUserLocale(); this.setUserTheme() }
    }
  },
  mounted() {
    var vm = this
    this.$root.$on("themeToogle", function (theme) {
      vm.dark = (theme == 'dark');
    });
    this.$store.dispatch('isConnected');
    this.$vuetify.lang.current = (this.$root.$i18n.locale).substring(0, 2);
    this.$vuetify.rtl = (this.$vuetify.lang.current == "ar");

    const ipc = require('electron').ipcRenderer
    ipc.send('put-in-tray')
    ipc.on('tray-removed', function () {
      ipc.send('remove-tray')
    })
    ipc.on('menu-change-tab', function (event, tab) {
      vm.$router.push({ name: tab });
    })
 
  
 

  },
  methods: {
    setUserLocale() {
      var vm = this
      var connectedUserName = this.connectedUserName
      var userLocale = _store.get('users.' + connectedUserName + '.locale.locale') || _store.get('global.locale.locale')
      if (userLocale) {
        this.$root.$i18n.locale = userLocale
        this.$vuetify.lang.current = (this.$root.$i18n.locale).substring(0, 2);
        this.$vuetify.rtl = this.$vuetify.lang.current == "ar"
        this.$store.dispatch('setUserLocale', userLocale)
      }
    },
    setUserTheme() {
      var connectedUserName = this.connectedUserName
      var userTheme = _store.get('users.' + connectedUserName + '.theme.theme') || _store.get('global.theme.theme')
      if (userTheme) {
        this.$store.dispatch('setUserTheme', userTheme)
      }
    },

  },
}
</script>


<style>
.application {
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
}

.application.application--is-rtl .v-navigation-drawer *,
.application.application--is-rtl .v-menu__content * {
  text-align: right;
}

.application.application--is-rtl .v-input__prepend-outer {
  margin-left: 9px;
  margin-right: 0px;
}

.v-card {
  text-align: initial;
}
.hidden-div {
  display: none !important;
  height: 0px !important;
  width: 0px !important;
  visibility: hidden !important;
  opacity: 0 !important;
  position: absolute !important;
  top: -10000px !important;
  overflow: hidden !important;
}

/* ================================ */

/* .application:not(.application--is-rtl) {
  font-family: "Ubuntu" !important;
}
 .application.application--is-rtl {
  font-family: "Tajawal" !important;
  direction: rtl;
}
.ar-fontFamily {
  font-family: "Tajawal" !important;
}
.en-fontFamily,
.fr-fontFamily {
  font-family: "Ubuntu" !important;
} */

/* ================================ */
/* ================================ */

.application:not(.application--is-rtl),
.ar-fontFamily,
.en-fontFamily,
.fr-fontFamily,
.application.application--is-rtl {
  font-family: "Cairo", "Ubuntu", "Tajawal" !important;
}
.application.application--is-rtl {
  direction: rtl;
}

/* ================================ */
</style>