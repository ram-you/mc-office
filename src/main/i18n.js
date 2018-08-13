const path = require("path")
const electron = require('electron')
const fs = require('fs');

const Store = require('electron-store');
const _store = new Store();
const isDevelopment = process.env.NODE_ENV !== 'production'

let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app

let localeFolder = isDevelopment ? '../common/locales/' : '../../../locales/'


module.exports = i18n;

function i18n() {
  var connectedUserName = _store.get('user.username')
  var userLocale = _store.get('users.'+connectedUserName+'.locale.locale') || _store.get('global.locale.locale') 
  if (fs.existsSync(path.join(__dirname, localeFolder + userLocale + '.json'))) {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, localeFolder + userLocale + '.json'), 'utf8'));
  } else {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, localeFolder + 'en-gb.json'), 'utf8'));
  }
}

i18n.prototype.__ = function (phrase) {
  let translation = loadedLanguage[phrase]
  if (translation === undefined) {
    translation = phrase
  }
  return translation
}