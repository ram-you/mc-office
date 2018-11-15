

<template>
  <div>
    <v-toolbar flat style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
      <v-breadcrumbs :items="breadcrumbsItems" divider="/"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mx-1">
        <v-btn icon @click="()=>{}">
          <v-icon class="blue--text text--darken-2">mdi-chart-line</v-icon>
        </v-btn>

      </div>

    </v-toolbar>

    <v-flex xs12 mb-4 mt-4>
      <div class="display-1 px-3">Statistiques</div>

      <v-layout row wrap align-center justify-start py-3 :reverse="$vuetify.rtl">

        <v-flex xs12 sm10 offset-sm1>
          <v-card style="text-align: -webkit-auto;" class="pa-4">

            <monthly-income :data="chartData1" />

          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

  </div>
</template>

<script>
import MonthlyIncome from './MonthlyIncome'
export default {
  components: { MonthlyIncome },
  data() {
    return {
      chartData1: [40, 39, 55, 40, 39, 45, 40, 50, 35, 33, 60, 32],
      breadcrumbsItems: [
        { text: this.$t('main.app.Home'), disabled: false, to: '/' },
        { text: 'Statistiques', disabled: true, to: '' }
      ]
    }
  },
}
</script>