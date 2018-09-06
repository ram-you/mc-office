<template>
  <div>
    <v-toolbar flat style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item to="/invoices">
          <span class="subheading">Liste des Factures </span>
        </v-breadcrumbs-item>
        <v-breadcrumbs-item disabled>
          <span class="subheading">Nouvelle Facture </span>
          <span class="subheading font-weight-medium"> </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mx-1">
        <v-btn icon >
          <v-icon class="grey--text text--darken-2">mdi-redo</v-icon>
        </v-btn>

        <v-btn icon  >
          <v-icon class="green--text text--lighten-1">mdi-check-all</v-icon>
        </v-btn>
      </div>

    </v-toolbar>

    <!-- ========================= -->

    <template>
      <v-card class="pa-4 ma-4">
        <v-layout row wrap>
          <v-flex xs12 sm4>
            <v-card>
              <v-autocomplete v-model="model" :items="items" :loading="isLoading" :search-input.sync="search" chips
                clearable hide-details hide-selected item-text="name" item-value="symbol" label="Search for a coin..."
                solo>
                <template slot="no-data">
                  <v-list-tile>
                    <v-list-tile-title>
                      Search for your favorite
                      <strong>Cryptocurrency</strong>
                    </v-list-tile-title>
                  </v-list-tile>
                </template>
                <template slot="selection" slot-scope="{ item, selected }">
                  <v-chip :selected="selected" color="blue-grey" class="white--text">
                    <v-icon left>mdi-coin</v-icon>
                    <span v-text="item.name"></span>
                  </v-chip>
                </template>
                <template slot="item" slot-scope="{ item, tile }">
                  <v-list-tile-avatar color="indigo" class="headline font-weight-light white--text">
                    {{ item.name.charAt(0) }}
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="item.name"></v-list-tile-title>
                    <v-list-tile-sub-title v-text="item.symbol"></v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon>mdi-coin</v-icon>
                  </v-list-tile-action>
                </template>
              </v-autocomplete>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4>
            <v-card>

            </v-card>
          </v-flex>
          <v-flex xs12 sm4>
            <v-card>

            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </template>

  </div>
</template>

<script>
var axios = require("axios")
export default {
  components: {

  },
  data() {
    return {
      isLoading: false,
      items: [],
      model: null,
      search: null

    }
  },
  watch: {
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return

      this.isLoading = true

      // Lazily load input items
      axios.get('https://api.coinmarketcap.com/v2/listings/')
        .then(res => {
          this.items = res.data.data
          this.isLoading = false
        })
        .catch(err => {
          console.log(err)
        })
        // .finally(() => (this.isLoading = false))
    }
  },
  methods: {

  },
}
</script>