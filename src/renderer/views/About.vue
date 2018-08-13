<template>
<div>
  <v-container fluid class="about-container">
    <v-slide-y-transition mode="out-in">

      <div>
        <v-layout column align-center>
          <img src="../../common/assets/img/logo/128x128.png" alt="mediacept.com" class="mb-2">
          <blockquote>
            <span class="display-2 font-weight-bold light-blue--text text--darken-3"> {{ $t('main.app.Title_Long') }}</span>
            <footer>
              <small>
                <em class="subheading grey--text text--lighteen-1 font-weight-regular font-italic">The desktop application</em>
              </small>
            </footer>
          </blockquote>
        </v-layout>

        <v-layout column class="my-4">

          <v-card>
            <v-card-title primary-title>
              <v-list three-line style="width:100%">
                <template v-for="(item, index) in items">
                  <v-subheader v-if="item.header" :key="item.header">
                    {{ item.header }}
                  </v-subheader>

                  <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>

                  <v-list-tile v-else :key="item.title" avatar>
                    <v-list-tile-avatar>
                      <img :src="item.avatar">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.title"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>

            </v-card-title>
          </v-card>

        </v-layout>






      </div>
    </v-slide-y-transition>
  </v-container>
                <v-layout column align-center class="mt-4">
          <v-card class="weatherwidget">
            <a class="weatherwidget-io" data-icons="Climacons Animated" :href="'https://forecast7.com/'+userShortLocale+'/35d8210d63/sousse/'"
              data-label_1="Sousse" data-label_2="Tunisie" data-font="Ubuntu" :data-theme="(userTheme.theme=='dark')?'dark':'pure'">Sousse, Tunisie</a>
          </v-card>
        </v-layout>

        <v-layout column align-center class="mt-4">
          <v-card class="elevation-1 pa-1">
          <video style="display:block" src="../../common/assets/videos/big_buck_bunny.mp4"   controls></video>
          </v-card>
        </v-layout>
  </div>
</template> 

<script>
var _app = require('electron').remote.app
const electronVersion = process.versions.electron
const chromeVersion = process.versions.chrome
const v8Version = process.versions.v8
const nodeVersion = process.versions.node
const os = require('os');
const appPath = _app.getPath('exe')
const appVersion = _app.getVersion()
export default {
  data() {
    var appTitle = this.$i18n.t('main.app.Title')
    return {
       localesItems: [{ name: 'العربية', locale: 'ar-tn' }, { name: 'English', locale: 'en-gb' }, { name: 'Français', locale: 'fr-fr' }],
      themesItems: this.$colorThemeItems,
      items: [
        { header: 'Installed Versions' },
        {
          avatar: require("../../common/assets/img/logo/256x256.png"),
          title: appTitle,
          subtitle: appVersion
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/electron-icon.png"),
          title: 'Electron',
          subtitle: electronVersion
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/chrome-icon.png"),
          title: 'Chrome',
          subtitle: chromeVersion
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/v8-icon.png"),
          title: 'Google V8 engine',
          subtitle: v8Version
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/nodejs-icon.png"),
          title: 'Node.js®',
          subtitle: nodeVersion
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/os-icon.png"),
          title: 'Operating System',
          subtitle: `${os.platform()}, ${os.type()}  (${os.arch()})` + `, <b>version:</b>  ${os.release()}`
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/data_floppy_disk-icon.png"),
          title: 'Application path',
          subtitle: appPath
        }
      ]
    }
  },
  computed: {
    appTitle() { return this.$i18n.t('main.app.Title') },
       _userLocale() { return this.$store.state.User.userLocale; },
    userLocale() { return this.localesItems.filter((item) => { return item.locale == this._userLocale; })[0] },
    userShortLocale() { return (this._userLocale).substring(0, 2); },

    _userTheme() { return this.$store.state.User.userTheme; },
    userTheme() { return this.themesItems.filter((item) => { return item.theme == this._userTheme; })[0] },

  },
  mounted() {
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
    methods: {
    removejscssfile(filename, filetype) {
      var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
      var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
      var allsuspects = document.getElementsByTagName(targetelement)
      for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
          allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
      }
    }

  },
}
</script>
<style>
.about-container * {
  direction: ltr !important;
}
div.weatherwidget {
  width: 100%;
  max-width: 1200px;
  text-align: center;
  margin: 0 auto;
}
</style>

