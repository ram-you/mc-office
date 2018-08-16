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
        <v-btn icon   @click="clear">
          <v-icon class="grey--text text--darken-2">mdi-redo</v-icon>
        </v-btn>

        <v-btn icon @click="submit">
          <v-icon class="green--text text--lighten-1">mdi-check-all</v-icon>
        </v-btn>
      </div>

    </v-toolbar>

<!-- ========================= -->

    <template>
  <div>
    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <div class="display-1 mb-2">Selection Controls</div>
        <p>Selection control components allow a user to select options. These components must be used with
          the v-model prop as they do not maintain their own state.</p>
        <v-checkbox :label="`Checkbox 1: ${checkbox.toString()}`" v-model="checkbox"></v-checkbox>
        <v-radio-group v-model="radioGroup">
          <v-radio v-for="n in 3" :key="n" :label="`Radio ${n}`" :value="n"></v-radio>
        </v-radio-group>
        <v-switch :label="`Switch 1: ${switch1.toString()}`" v-model="switch1"></v-switch>
      </v-card>
    </v-flex>

    <v-flex xs12 mt-4>
      <v-card class="pa-4 ma-4">
        <div class="title mb-2">Checkboxes - Array</div>
        <p>{{ selected }}</p>
        <v-checkbox v-model="selected" label="John" value="John"></v-checkbox>
        <v-checkbox v-model="selected" label="Jacob" value="Jacob"></v-checkbox>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Checkboxes - Colors</div>
          <p>Checkboxes can be colored by using any of the builtin colors and contextual names using the
            color prop.</p>
          <v-layout row wrap style="max-width: 900px;">
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="red" color="red" value="red" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="red darken-3" color="red darken-3" value="red darken-3" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="indigo" color="indigo" value="indigo" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="indigo darken-3" color="indigo darken-3" value="indigo darken-3" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="orange" color="orange" value="orange" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="orange darken-3" color="orange darken-3" value="orange darken-3" hide-details></v-checkbox>
            </v-flex>
          </v-layout>

          <v-layout row wrap class="mt-5" style="max-width: 900px;">
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="primary" color="primary" value="primary" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="secondary" color="secondary" value="secondary" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="success" color="success" value="success" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="info" color="info" value="info" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="warning" color="warning" value="warning" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="error" color="error" value="error" hide-details></v-checkbox>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Checkboxes - Inline with a textfield</div>
          <v-layout align-center>
            <v-checkbox v-model="includeFiles" hide-details class="shrink mr-2"></v-checkbox>
            <v-text-field label="Include files"></v-text-field>
          </v-layout>
          <v-layout align-center>
            <v-checkbox v-model="enabled" hide-details class="shrink mr-2"></v-checkbox>
            <v-text-field :disabled="!enabled" label="I only work if you check the box"></v-text-field>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Switches - Boolean</div>
          <v-switch :label="`Switch 1: ${switch1.toString()}`" v-model="switch1"></v-switch>
          <v-switch :label="`Switch 2: ${switch2.toString()}`" v-model="switch2"></v-switch>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Switches - Array</div>
          <p>{{ people }}</p>
          <v-switch v-model="people" label="John" value="John"></v-switch>
          <v-switch v-model="people" label="Jacob" value="Jacob"></v-switch>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Switches - Colors</div>
          <p>Switches can be colored by using any of the builtin colors and contextual names using the color
            prop.
          </p>
          <v-layout row wrap style="max-width: 900px;">
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="red" color="red" value="red" hide-details></v-switch>
              <v-switch v-model="ex11" label="red darken-3" color="red darken-3" value="red darken-3" hide-details></v-switch>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="indigo" color="indigo" value="indigo" hide-details></v-switch>
              <v-switch v-model="ex11" label="indigo darken-3" color="indigo darken-3" value="indigo darken-3" hide-details></v-switch>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="orange" color="orange" value="orange" hide-details></v-switch>
              <v-switch v-model="ex11" label="orange darken-3" color="orange darken-3" value="orange darken-3" hide-details></v-switch>
            </v-flex>
          </v-layout>

          <v-layout row wrap class="mt-5" style="max-width: 900px;">
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="primary" color="primary" value="primary" hide-details></v-switch>
              <v-switch v-model="ex11" label="secondary" color="secondary" value="secondary" hide-details></v-switch>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="success" color="success" value="success" hide-details></v-switch>
              <v-switch v-model="ex11" label="info" color="info" value="info" hide-details></v-switch>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="warning" color="warning" value="warning" hide-details></v-switch>
              <v-switch v-model="ex11" label="error" color="error" value="error" hide-details></v-switch>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

  </div>
  
</template>

    <v-layout row wrap align-center justify-start pa-1 :reverse="$vuetify.rtl">

        <v-flex xs12  >
          <v-card style="text-align: -webkit-auto;" class="py-2 px-4">

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="name" :rules="nameRules" :counter="10" label="Name" required></v-text-field>
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
          <v-select v-model="select" :items="items" :rules="[v => !!v || 'Item is required']" label="Item" required></v-select>
          <v-checkbox v-model="checkbox" :rules="[v => !!v || 'You must agree to continue!']" label="Do you agree?"
            required></v-checkbox>

          <v-btn :disabled="!valid" @click="submit">
            submit
          </v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-form>
   
          </v-card>
        </v-flex>
    </v-layout>

  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      checkbox: false,



      checkbox: true,
      radioGroup: 1,
      switch1: true,
      selected: ['John'],
      ex4: ['red', 'indigo', 'orange', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'red darken-3', 'indigo darken-3', 'orange darken-3'],
      includeFiles: true,
      enabled: false,
      switch1: true,
      switch2: false,
      people: ['John'],
      ex11: ['red', 'indigo', 'orange', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'red darken-3', 'indigo darken-3', 'orange darken-3'],


      model: {
        id: 1,
        name: "John Doe",
        password: "J0hnD03!x4",
        skills: ["Javascript", "VueJS"],
        email: "john.doe@gmail.com",
        status: true,
        usePassword: true
      },
      schema: {
        fields: [{
          type: "number",
          label: "ID (disabled text field)",
          model: "id",
          readonly: true,
          disabled: true
        }, {
          type: "text",
          label: "Name",
          model: "name",
          placeholder: "Your name",
          featured: true,
          required: true
        },
        {
          type: "checkbox",
          label: "Use password?",
          model: "usePassword"
        }, {
          type: "password",
          label: "Password",
          model: "password",
          disabled: false,
          min: 6,
          required: true,
          hint: "Minimum 6 characters",
          passwordVisible: false
        }, {
          type: "select",
          label: "Skills",
          model: "skills",
          values: ["Javascript", "VueJS", "CSS3", "HTML5"]
        }, {
          type: "email",
          label: "E-mail",
          model: "email",
          placeholder: "User's e-mail address"
        }, {
          type: "checkbox",
          label: "Status",
          model: "status",
          default: true
        }],
        groups: [
          {
            key: "userDetails",
            legend: "User Details",
            fields: [
              {
                type: "textarea",
                label: "My story",
                model: "story"
              },
              {
                type: "email",
                id: "email",
                label: "Email Address",
                model: "email"
              }
            ]
          },
          {
            key: "preferences",
            legend: "Preferences",
            fields: [
              {
                type: "select",
                label: "Color",
                model: "color",
                values: [
                  "Red",
                  "Green",
                  "Blue"
                ]
              },
              {
                type: "number",
                id: "timeout",
                label: "Timeout in Seconds",
                model: "timeout"
              }
            ]
          }
        ]
      },
      options: {

      }
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {

      }
    },
    clear() {
      this.$refs.form.reset()
    }
  },
}
</script>