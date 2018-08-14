<template>
  <v-container fluid style="height:100%"> 
    <v-slide-y-transition mode="out-in">
      <div>

        <v-layout column align-center>
          <img src="../../../common/assets/img/logo/128x128.png" alt="mediacept.com" class="mb-2">
          <blockquote>
            <span class="display-2 font-weight-bold light-blue--text text--darken-3"> {{ $t('main.app.Title_Long') }}</span>
            <footer>
              <small>
                <em class="subheading grey--text text--lighteen-1 font-weight-regular font-italic">The desktop application</em>
              </small>
            </footer>
          </blockquote>

          <v-layout row align-center class="mt-4 mb-5" style="max-width: 650px; width:100%">
            <v-text-field @click:append="() => {}" :placeholder="$t('main.app.Search')+'...'" single-line append-icon="mdi-magnify"
              color="white" hide-details solo></v-text-field>
          </v-layout>

        </v-layout>

        <v-layout column align-center class="mt-4">
          <dashboard :theme="_userTheme"/> 
        </v-layout>

        <!-- <v-layout column align-center class="mt-4">
          <v-card class="weatherwidget">
            <a class="weatherwidget-io" data-icons="Climacons Animated" :href="'https://forecast7.com/'+userShortLocale+'/35d8210d63/sousse/'"
              data-label_1="Sousse" data-label_2="Tunisie" data-font="Ubuntu" :data-theme="(userTheme.theme=='dark')?'dark':'pure'">Sousse, Tunisie</a>
          </v-card>
        </v-layout>

        <v-layout column align-center class="mt-4">
          <v-card class="elevation-1 pa-1">
          <video style="display:block" src="../../common/assets/videos/big_buck_bunny.mp4"   controls></video>
          </v-card>
        </v-layout> -->

  
      </div>
    </v-slide-y-transition>
  </v-container>
</template>


<script>  
import Dashboard from './Dashboard.vue' 

export default {
  components: { Dashboard },
  data() {
    return {
      localesItems: [{ name: 'العربية', locale: 'ar-tn' }, { name: 'English', locale: 'en-gb' }, { name: 'Français', locale: 'fr-fr' }],
      themesItems: this.$colorThemeItems,
    }
  },
  computed: {
    _userLocale() { return this.$store.state.User.userLocale; },
    userLocale() { return this.localesItems.filter((item) => { return item.locale == this._userLocale; })[0] },
    userShortLocale() { return (this._userLocale).substring(0, 2); },

    _userTheme() { return this.$store.state.User.userTheme; },
    userTheme() { return this.themesItems.filter((item) => { return item.theme == this._userTheme; })[0] },
  },
  mounted() {
 
  },
  methods: {
  

  },
}
</script> 