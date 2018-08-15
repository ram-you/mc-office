<template>
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
      submit () {
        if (this.$refs.form.validate()) { 
       
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    },
}
</script>