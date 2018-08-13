<template>
  <div id="billing-container" class="billing-container my-2">

    <div class="clearfix header" style="padding: 1.32cm 1.32cm 10px;">
      <div id="logo">
        <img :src="base64">
      </div>
      <div id="company">
        <h2 class="name">Company Name</h2>
        <div>455 Foggy Heights, AZ 85004, US</div>
        <div>(602) 519-0450</div>
        <div>
          <a href="mailto:company@example.com">company@example.com</a>
        </div>
      </div>

    </div>
    <main style="padding: 0 1.32cm 0px;">
      <div id="details" class="clearfix">
        <div id="client">
          <div class="to">INVOICE TO:</div>
          <h2 class="name">John Doe</h2>
          <div class="address">796 Silver Harbour, TX 79273, US</div>
          <div class="email">
            <a href="mailto:john@example.com">john@example.com</a>
          </div>
        </div>
        <div id="invoice">
          <h1>INVOICE {{invoice.number}}</h1>
          <div class="date">Date of Invoice: {{invoice.date}}</div>
          <div class="date">Due Date: {{invoice.due}}</div>
        </div>
      </div>
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th class="no">#</th>
            <th class="desc">DESCRIPTION</th>
            <th class="unit">UNIT PRICE</th>
            <th class="qty">QUANTITY</th>
            <th class="total">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="no">01</td>
            <td class="desc">
              <h3>Website Design</h3>Creating a recognizable design solution based on the company's existing
              visual identity</td>
            <td class="unit">$40.00</td>
            <td class="qty">30</td>
            <td class="total">$1,200.00</td>
          </tr>
          <tr>
            <td class="no">02</td>
            <td class="desc">
              <h3>Website Development</h3>Developing a Content Management System-based Website</td>
            <td class="unit">$40.00</td>
            <td class="qty">80</td>
            <td class="total">$3,200.00</td>
          </tr>
          <tr>
            <td class="no">03</td>
            <td class="desc">
              <h3>Search Engines Optimization</h3>Optimize the site for search engines (SEO)</td>
            <td class="unit">$40.00</td>
            <td class="qty">20</td>
            <td class="total">$800.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">SUBTOTAL</td>
            <td>$5,200.00</td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">TAX 25%</td>
            <td>$1,300.00</td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">GRAND TOTAL</td>
            <td>$6,500.00</td>
          </tr>
        </tfoot>
      </table>
      <div id="thanks">Thank you!</div>
      <div id="notices">
        <div>NOTICE:</div>
        <div class="notice">A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
      </div>
    </main>
    <footer>
      Invoice was created on a computer and is valid without the signature and seal.
    </footer>
  </div>
</template>
<script>
const Store = require('electron-store');
const _store = new Store();

const fs = require('fs')
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production';

export default {
  props: ['id', 'number',],
  data() {
    return {
      url2pdf: false,
      theme: 'default',
      logoImg: require("../../../../common/assets/img/logo/256x256.png"),
      base64: '',
      invoice: {}
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },

  },
  watch: {
    id() {
      this.invoice.id = this.id
    },
    number() {
      this.invoice.number = this.number
    },


  },
  mounted() {
    var vm = this
    this.invoice = {
      id: this.id,
      number: this.number,
      date: "2018.07.20",
      due: "2018.07.21",
    }
    var connectedUserName = this.connectedUserName;
    var invoiceUserTheme = _store.get('users.' + connectedUserName + '.invoice.theme') || 'default'
    this.theme = invoiceUserTheme
    require("../../../../common/assets/billing/theme/" + invoiceUserTheme + "/index.css")
    this.generateBase64() 

  },
  methods: {

    generateBase64() {
      let canvas = document.createElement('CANVAS')
      let img = document.createElement('img')
      img.src = this.logoImg
      img.onload = () => {
        canvas.height = img.height
        canvas.width = img.width
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        this.base64 = canvas.toDataURL('image/png')
        canvas = null
      }

      img.onerror = error => {
        this.error = 'Could not load image, please check that the file is accessible and an image!'
      }
    },

 

  },

}

</script> 

