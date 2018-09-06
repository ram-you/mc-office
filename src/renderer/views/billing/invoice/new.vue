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
        <v-btn icon>
          <v-icon class="grey--text text--darken-2">mdi-redo</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon class="green--text text--lighten-1">mdi-check-all</v-icon>
        </v-btn>
      </div>

    </v-toolbar>

    <!-- ========================= -->

    <template>
      <v-card class="ma-4">
        <v-layout row wrap>
          <v-flex xs12 md4>

            <v-card class="ma-2">
              <v-card-text>
                <v-subheader class="pa-0">Where do you live?</v-subheader>
                <v-autocomplete v-model="model" :search-input.sync="search" hint="Choisir un client" :items="items" :readonly="false"
                  label="Choisir un client" persistent-hint item-text="name" item-value="symbol">
                </v-autocomplete>
              </v-card-text>
            </v-card>

          </v-flex>
          <v-flex xs12 md4>
            <v-card class="ma-2">
              <v-card-text>
                <v-subheader class="pa-0">Where do you live?</v-subheader>

                <v-menu ref="invoiceDate" :close-on-content-click="false" v-model="invoiceDate" :nudge-right="40" :return-value.sync="date1"
                  lazy transition="scale-transition" offset-y full-width min-width="290px">
                  <v-text-field slot="activator" v-model="date1" label="Invoice Date" prepend-icon="mdi-calendar" readonly></v-text-field>
                  <v-date-picker v-model="date1" @input="$refs.invoiceDate.save(date1)"></v-date-picker>
                </v-menu>

                <v-menu ref="dueDate" :close-on-content-click="false" v-model="dueDate" :nudge-right="40" :return-value.sync="date2"
                  lazy transition="scale-transition" offset-y full-width min-width="290px">
                  <v-text-field slot="activator" v-model="date2" label="Due Date" prepend-icon="mdi-calendar" readonly></v-text-field>
                  <v-date-picker v-model="date2" @input="$refs.dueDate.save(date2)"></v-date-picker>
                </v-menu>

              </v-card-text>

            </v-card>
          </v-flex>
          <v-flex xs12 md4>
            <v-card class="ma-2">
              <v-container grid-list-xl fluid>
                <v-layout wrap>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="form.first" :rules="rules.name" color="purple darken-2" label="First name" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="form.last" :rules="rules.name" color="blue darken-2" label="Last name" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea v-model="form.bio" color="teal">
                      <div slot="label">
                        Bio
                        <small>(optional)</small>
                      </div>
                    </v-textarea>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-select v-model="form.favoriteAnimal" :items="animals" :rules="rules.animal" color="pink" label="Favorite animal"
                      required></v-select>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-slider v-model="form.age" :rules="rules.age" color="orange" label="Age" hint="Be honest" min="1" max="100"
                      thumb-label></v-slider>
                  </v-flex>

                </v-layout>
              </v-container>
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
    const defaultForm = Object.freeze({
      first: '',
      last: '',
      bio: '',
      favoriteAnimal: '',
      age: null,
      terms: false
    })
    return {
      date1: null,
       date2: null,
      invoiceDate: false,
      dueDate: false,
      isLoading: false,
      items: [],
      model: null,
      search: null,

      form: Object.assign({}, defaultForm),
      rules: {
        age: [
          val => val < 10 || `I don't believe you!`
        ],
        animal: [val => (val || '').length > 0 || 'This field is required'],
        name: [val => (val || '').length > 0 || 'This field is required']
      },
      animals: ['Dog', 'Cat', 'Rabbit', 'Turtle', 'Snake'],
      snackbar: false,
      terms: false,
      defaultForm

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