<template>
  <div>
    <v-navigation-drawer :value="drawerState" :clipped="isDesktop" app :right="$vuetify.rtl" :absolute="isDesktop"
      :mini-variant="miniVariant">
      <v-list>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon class="red white--text">mdi-home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('main.app.Home') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="!isConnected" to="/login">
          <v-list-tile-action>
            <v-icon class="green white--text">mdi-login-variant</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('main.app.Login') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-else to="/login">
          <v-list-tile-action>
            <v-icon class="green white--text">mdi-logout-variant</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('main.app.Logout') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/about">
          <v-list-tile-action>
            <v-icon class="blue white--text">mdi-information-variant</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ $t('main.app.About') }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Data Tables -->
        <v-list-tile to="/data-tables">
          <v-list-tile-action>
            <v-icon class="orange white--text">mdi-table-large</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Data table</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Data Tables -->

        <!-- Actions  -->
        <v-divider class="my-3"></v-divider>
        <v-list-tile @click="openHomeDir()">
          <v-list-tile-action>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Votre dossier personnel
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="openAppDataDir()">
          <v-list-tile-action>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Dossier Données de l'application
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="printToPDF()">
          <v-list-tile-action>
            <v-icon>mdi-file-pdf</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Prendre une copie PDF
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-3"></v-divider>
        <!-- ======== -->

        <v-subheader class="mt-3">Billing</v-subheader>

        <v-list-tile to="/invoices">
          <v-list-tile-action>
            <v-icon class="orange white--text">mdi-table-large</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Invoices list</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/invoice/22/?number=FAC-2017-005">
          <v-list-tile-action>
            <v-icon class="green white--text">mdi-file-document-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Invoice</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

             <v-list-tile to="/charts">
          <v-list-tile-action>
            <v-icon class="blue white--text">mdi-chart-line</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Charts</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>

      <v-divider class="my-3"></v-divider>

      <div :class="$vuetify.rtl?'text-xs-right':'text-xs-left'">
        <v-menu offset-x open-on-hover transition="slide-x-transition" open-delay="500" close-delay="300">
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-icon>mdi-earth</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-show="isDesktop?(drawer==1):true" :class="isDarkTheme?'white--text':''">
              {{ $t('main.app.Application_Locale')}}</v-list-tile-title>
          </v-list-tile>
          <v-list dense subheader>
            <v-subheader style="border-bottom:1px solid"> {{ $t('main.app.Application_Locale')}}</v-subheader>
            <v-list-tile v-for="item in localesItems" :key="item.locale" @click="updateUserLocale(item)">
              <v-list-tile-title v-text="item.name" :class="(item.name==userLocale.name)? getLocaleFontClass(item)+'font-weight-bold primary--text':getLocaleFontClass(item)"
                style="overflow: unset;"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>

      <div :class="$vuetify.rtl?'text-xs-right':'text-xs-left'">
        <v-menu offset-x open-on-hover transition="slide-x-transition" open-delay="500" close-delay="300">
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-show="isDesktop?(drawer==1):true" :class="isDarkTheme?'theme--dark':'theme--light'">
              {{ $t('main.app.Color_theme')}}</v-list-tile-title>
          </v-list-tile>
          <v-list dense subheader   :class="isDarkTheme?'theme--dark':'theme--light'">
            <v-subheader style="border-bottom:1px solid"> {{ $t('main.app.Color_theme')}}</v-subheader>
            <v-list-tile v-for="item in themesItems" :key="item.theme" @click="updateUserTheme(item)"   :class="isDarkTheme?'theme--dark':'theme--light'">
              <v-list-tile-title v-text="item.name" :class="(item.name==userTheme.name)?'font-weight-bold primary--text':''"
                style="overflow: unset;"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-navigation-drawer>

    <v-toolbar :dark="isDarkTheme" app fixed clipped-left :clipped-right="$vuetify.rtl">
      <v-toolbar-side-icon @click.stop="toggleMenuDrawer()" :style="{'margin-left':$vuetify.rtl?'0':'','margin-right':$vuetify.rtl?'-6px':''}"></v-toolbar-side-icon>
      <img src="../../common/assets/img/logo/32x32.png" alt="MC-Office" style="width:32px; height:32px;">
      <v-toolbar-title class="mx-2 align-center">
        <span class="title font-weight-bold light-blue--text text--darken-3">{{ $t('main.app.Title_Long') }} </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout v-if="!isHomePage" row align-center style="max-width: 650px">
        <v-text-field @click:append="() => {}" :placeholder="$t('main.app.Search')+'...'" single-line append-icon="mdi-magnify"
          color="white" hide-details></v-text-field>
      </v-layout>
    </v-toolbar>

  </div>

</template>

<script>    
const Store = require('electron-store');
const _store = new Store();

const fs = require('fs')
const os = require('os')
const path = require('path')

const { shell, ipcRenderer, ipcMain } = require('electron')
const remote = require("electron").remote

import TransitionSlideUp from "../components/TransitionSlideUp";
export default {
  name: 'Header',
  components: { TransitionSlideUp, },
  data() {
    return {
      isHomePage: this.$route.name == "home",
      miniVariant: false,
      drawerState: false,
      drawer: -1,
      localesItems: this.$localesItems,
      themesItems: this.$colorThemeItems,

      items2: [
        { picture: 28, text: 'Joseph', src: 'http://mediacept.com/images/logos/mediacept_128.png' },
        { picture: 38, text: 'Apple', src: 'https://randomuser.me/api/portraits/men/38.jpg' },
        { picture: 48, text: 'Xbox Ahoy', src: 'https://randomuser.me/api/portraits/men/48.jpg' },
        { picture: 58, text: 'Nokia', src: 'https://randomuser.me/api/portraits/men/58.jpg' },
        { picture: 78, text: 'MKBHD', src: 'https://randomuser.me/api/portraits/men/78.jpg' }
      ],
      items3: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' }
      ]
    }
  },
  computed: {
    _userLocale() { return this.$store.state.User.userLocale; },
    userLocale() { return this.localesItems.filter((item) => { return item.locale == this._userLocale; })[0] },


    _userTheme() { return this.$store.state.User.userTheme; },
    userTheme() { return this.themesItems.filter((item) => { return item.theme == this._userTheme; })[0] },

    isDesktop() { return this.$vuetify.breakpoint.lgAndUp; },
    isTablet() { return this.$vuetify.breakpoint.smAndDown; },
    isMobile() { return this.$vuetify.breakpoint.xsOnly; },
    isConnected() { return this.$store.state.User.user; },
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : ""; },
    isDarkTheme() { return this.userTheme.theme == 'dark'; }
  },
  watch: {
    '$route': function () {
      this.isHomePage = this.$route.name == "home";
    },
    "$vuetify.rtl": function () {
      const { getCurrentWindow } = require('electron').remote;
      getCurrentWindow().reload()
    },
    "$vuetify.lang.current": function () {
      var vm = this
      !function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          vm.removejscssfile("weatherwidget-io-js", "js")
          setTimeout(() => {
            js = d.createElement(s);
            js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js';
            fjs.parentNode.insertBefore(js, fjs);
          }, 100);
        } else {
          js = d.createElement(s);
          js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js';
          fjs.parentNode.insertBefore(js, fjs);
        }
      }(document, 'script', 'weatherwidget-io-js');

    },

    "isDesktop": function (val) {
      if (val) {
        var connectedUserName = this.connectedUserName
        var menuDrawerState = _store.get('users.' + connectedUserName + '.menu.drawer.state')
        var _menuDrawerState = Number.isInteger(menuDrawerState) ? menuDrawerState : -1;
        this.drawer = _menuDrawerState;
        this.miniVariant = (this.drawer == 0)
        this.drawerState = (this.drawer > -1)
      }
    }
  },
  mounted() {
    var vm = this
    var connectedUserName = this.connectedUserName
    var menuDrawerState = _store.get('users.' + connectedUserName + '.menu.drawer.state')
    var _menuDrawerState = Number.isInteger(menuDrawerState) ? menuDrawerState : -1;
    var breakPoint = this.isDesktop;
    this.drawer = breakPoint ? _menuDrawerState : -1;
    this.miniVariant = breakPoint ? (_menuDrawerState == 0) : false

    this.drawerState = breakPoint ? (this.drawer > -1) : false
    _store.onDidChange('users.' + connectedUserName + '.locale', (newValue, oldValue) => {
      ipcRenderer.send('update-menu')
    })
    this.themesItems = this.$colorThemeItems.map(function (e) {
      e.name = vm.$i18n.t('main.app.' + e.theme)
      return e;
    });
  },
  methods: {
    getLocaleFontClass(item) {
      return item.locale.substring(0, 2) + '-fontFamily ';
    },
    updateUserLocale(locale) {
      var vm = this
      var connectedUserName = this.connectedUserName
      this.$root.$i18n.locale = locale.locale
      this.$vuetify.lang.current = (this.$root.$i18n.locale).substring(0, 2);
      this.$vuetify.rtl = this.$vuetify.lang.current == "ar"
      this.$store.dispatch('setUserLocale', locale.locale).then(() => {
        if (connectedUserName == 'admin') _store.set('global.locale', locale);
        _store.set('users.' + connectedUserName + '.locale', locale);
      })
      this.themesItems = this.$colorThemeItems.map(function (e) {
        e.name = vm.$i18n.t('main.app.' + e.theme)
        return e;
      });
    },
    updateUserTheme(theme) {
      var connectedUserName = this.connectedUserName
      this.$store.dispatch('setUserTheme', theme.theme).then(() => {
        if (connectedUserName == 'admin') _store.set('global.theme', theme);
        _store.set('users.' + connectedUserName + '.theme', theme);
      })

      var vm = this
      !function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          vm.removejscssfile("weatherwidget-io-js", "js")
          setTimeout(() => {
            js = d.createElement(s);
            js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js';
            fjs.parentNode.insertBefore(js, fjs);
          }, 100);
        } else {
          js = d.createElement(s);
          js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js';
          fjs.parentNode.insertBefore(js, fjs);
        }
      }(document, 'script', 'weatherwidget-io-js');
    },

    toggleMenuDrawer() {
      var vm = this
      var breakPoint = this.isDesktop
      var x
      if (breakPoint) {
        x = this.drawer + 1
        if (x == 2) x = -1;
        this.miniVariant = (x == 0)
        this.drawer = x
        this.drawerState = (this.drawer > -1)
      } else {
        this.miniVariant = false
        this.drawerState = false
        setTimeout(() => {
          vm.drawerState = true
        }, 100);

      }


      var connectedUserName = this.connectedUserName
      if (breakPoint) _store.set('users.' + connectedUserName + '.menu.drawer.state', this.drawer);
    },
    openHomeDir(event) {
      var _app = require('electron').remote.app
      const userHomePath = _app.getPath('home')
      shell.showItemInFolder(userHomePath)
    },
    openAppDataDir(event) {
      var _app = require('electron').remote.app
      const appDataPath = _app.getPath('userData') + path.sep + _app.getName()
      shell.showItemInFolder(appDataPath)
    },
    printToPDF(event) {
      const pdfPath = path.join(os.tmpdir(), 'print.pdf')
      const win = remote.getCurrentWindow()
      // Use default printing options
      win.webContents.printToPDF({}, (error, data) => {
        if (error) throw error
        fs.writeFile(pdfPath, data, (error) => {
          if (error) throw error
          shell.openExternal(`file://${pdfPath}`)
          // event.sender.send('wrote-pdf', pdfPath)
        })
      })



    },
    removejscssfile(filename, filetype) {
      var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
      var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
      var allsuspects = document.getElementsByTagName(targetelement)
      for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
          allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
      }
    },
  },
}
</script>

<style scoped>
.v-list__tile__action i {
  padding: 4px;
  border-radius: 50%;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
  background: rgba(0, 0, 0, 0.13);
}
.v-avatar {
  background: #fff;
}
.v-navigation-drawer {
  overflow-y: auto;
  max-height: calc(100% - 48px) !important;
}
.v-navigation-drawer--temporary:not(.v-navigation-drawer--close),
.v-navigation-drawer--is-mobile:not(.v-navigation-drawer--close) {
  max-height: initial !important;
}
</style>
