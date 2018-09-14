'use strict'





const debounce = require("lodash/debounce");
var i18n = new(require('./i18n'))
const Store = require('electron-store');
const _store = new Store();

var connectedUserName = _store.get('user.username')
var windowWidth = _store.get('users.' + connectedUserName + '.window.width')
var windowHeight = _store.get('users.' + connectedUserName + '.window.height')
const theme = _store.get('users.' + connectedUserName + '.theme.theme') || _store.get('global.theme.theme');
const isDarkMode = theme == "dark";
const { app, protocol, BrowserWindow, Menu, shell, dialog, globalShortcut, ipcMain } = require('electron')
const fs = require('fs')
const fse = require('fs-extra');
const os = require('os')
const path = require('path')
// import { format as formatUrl } from 'url'
const formatUrl = require('url').format

const centerOnPrimaryDisplay = require('./helpers/center-on-primary-display');

let platform = os.platform()

const isDevelopment = process.env.NODE_ENV !== 'production'



let ASSETS_DIR = path.resolve(__dirname, '../common/assets')

global.ASSETS_GLOBAL = isDevelopment ? path.resolve(__dirname, '../common/assets') : path.join(__dirname, '/../../../assets');

global.mainWindow = null
global.dbWorkerWindow = null
global.ormWorkerWindow = null
global.printWorkerWindow = null
global.pdfViewerWindow = null

global.DB_VERSION = require('../../package.json').db_version

let userDataPath = ''

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })

function createMainWindow() {
  const winPOS = centerOnPrimaryDisplay(windowWidth || 1264, windowHeight || 700);
  const shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  mainWindow = new BrowserWindow({
    title: "MEDIACEPT Office",
    useContentSize: true,
    width: windowWidth || 1264,
    height: windowHeight || 700,
    minWidth: 500,
    minHeight: 350,
    x: winPOS.x,
    y: winPOS.y,
    backgroundColor: isDarkMode ? '#303030' : '#fff',
    show: false,
    icon: ASSETS_DIR + '/icons/64x64.png', // path.join(__dirname, '../common/assets/icons/64x64.png'),
    webPreferences: { plugins: true }

  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()

    if (!isDevelopment && process.argv.indexOf('--debug') !== -1) {
      mainWindow.webContents.openDevTools()
    }
  })

  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:9080`)
    if (!process.env.IS_TEST) { mainWindow.webContents.openDevTools() }
    globalShortcut.register('f5', function() { mainWindow.reload() })
  } else {
    mainWindow.loadURL(formatUrl({ pathname: path.join(__dirname, 'index.html'), protocol: 'file', slashes: true }))
    if (platform === 'linux' || platform === 'win32') {
      globalShortcut.register('Control+Shift+R', () => {
        mainWindow.webContents.openDevTools()
      })
      globalShortcut.register('f5', function() {
        mainWindow.reload()
      })
    }
  }

  mainWindow.on('closed', () => { app.quit() })

  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.focus()
    setImmediate(() => { mainWindow.focus() })
  })

  mainWindow.on('resize', debounce(function(e) {
    e.preventDefault();
    onWindowResize();
  }, 100));

  require('./menu').init(mainWindow)
  require('./traymenu').init(mainWindow)



  return mainWindow
}

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  dbWorkerWindow = createDataBaseWorkerWindow()
  mainWindow = createMainWindow()
  printWorkerWindow = createPrintWorkerWindow()
  userDataPath = app.getPath('userData') + path.sep;
})

// =====================DATABASE================DATABASE==========DATABASE==================
function createDataBaseWorkerWindow() {
  dbWorkerWindow = new BrowserWindow({
    title: "MC-OFFICE Database",
    parent: mainWindow,
    modal: true,
    show: isDevelopment ? true : false,
    icon: ASSETS_DIR + '/icons/64x64.png',
  });
  var dbWorkerPathname = ASSETS_GLOBAL + '/database/worker.html'; // isDevelopment ? (ASSETS_DIR + '/database/worker.html') : path.join(__dirname, '/../../../assets/database/worker.html')
  dbWorkerWindow.loadURL(formatUrl({ pathname: dbWorkerPathname, protocol: 'file', slashes: true }));
  dbWorkerWindow.webContents.openDevTools();
  return dbWorkerWindow
}

// =====================~~~~~~~============================================




// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})


function makeSingleInstance() {
  if (process.mas) return false

  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
        mainWindow.show();
        mainWindow.restore();
      }
      mainWindow.focus()
    }
  })
}


function onWindowResize(event) {
  var connectedUserName = _store.get('user.username')
  if (connectedUserName) {
    var b = mainWindow.getBounds()
    _store.set('users.' + connectedUserName + '.window.width', b.width);
    _store.set('users.' + connectedUserName + '.window.height', b.height);
  }
}

ipcMain.on('update-window-size', (event) => {
  var connectedUserName = _store.get('user.username')
  var windowWidth = _store.get('users.' + connectedUserName + '.window.width')
  var windowHeight = _store.get('users.' + connectedUserName + '.window.height')
  if (windowWidth && windowHeight) { mainWindow.setSize(windowWidth, windowHeight) }
})

function createPdfViewerWindow(file) {
  pdfViewerWindow = new BrowserWindow({
    title: "MC-FFICE PDF Viewer",
    // parent: mainWindow, modal: true,
    show: false,
    icon: ASSETS_DIR + '/icons/pdf.png', //path.join(__dirname, '../common/assets/icons/pdf.png'),
    webPreferences: { plugins: true, },
    icon: ASSETS_DIR + '/icons/64x64.png',
  });
  pdfViewerWindow.setMenu(null)
  pdfViewerWindow.loadURL(formatUrl({ pathname: file, protocol: 'file', slashes: true }))
  pdfViewerWindow.on('ready-to-show', () => {
    pdfViewerWindow.show()
    pdfViewerWindow.focus()
  })
  return pdfViewerWindow
}

function createPrintWorkerWindow() {
  printWorkerWindow = new BrowserWindow({   title: "MC-FFICE Print Worker",show: isDevelopment ? true : false,  icon: ASSETS_DIR + '/icons/64x64.png', });
  var printWorkerPathname = ASSETS_GLOBAL + '/billing/worker.html'; // isDevelopment ? (ASSETS_DIR + '/billing/worker.html') : path.join(__dirname, '/../../../assets/billing/' + 'worker.html')
  printWorkerWindow.loadURL(formatUrl({ pathname: printWorkerPathname, protocol: 'file', slashes: true }))
  printWorkerWindow.webContents.openDevTools();
  return printWorkerWindow
}

ipcMain.on("printPDF", (event, ID, content, theme, silent = false) => {
  printWorkerWindow.webContents.send("printPDF", ID, content, theme, silent);
});











ipcMain.on("print", (event, ID, content, theme, printer) => {
  printWorkerWindow.webContents.send("print", ID, content, theme, printer);
});




ipcMain.on("readyToPrintPDF",  (event, ID, silent = false) => {
  let pdfPathFolder = userDataPath + 'billing' + path.sep + 'invoices' + path.sep
  fse.ensureDirSync(pdfPathFolder)
  const pdfPath = pdfPathFolder + 'invoice-' + ID + '.pdf';

  const printOptions = {
    pageSize: 'A4',
    marginsType: 0,
    printBackground: true, 
    printSelectionOnly: false,
    landscape: false
  }
  printWorkerWindow.webContents.printToPDF(printOptions,async function(error, data) {
    if (error) throw error

    if (silent) {
      mainWindow.send('data-pdf', data);
    } else {
      try {
        await fs.writeFileSync(pdfPath, data);
        // shell.openItem(pdfPath)
        pdfViewerWindow = createPdfViewerWindow(pdfPath)
        mainWindow.send('wrote-pdf', pdfPath)
      } catch (error) {
        console.log(error)
      }
    }
  })




})





ipcMain.on("readyToPrint", (event, ID, printer) => {
  const printOptions = {
    deviceName: printer,
    pageSize: 'A4',
    marginsType: 2,
    printBackground: true,
    printSelectionOnly: false,
    landscape: false
  }
  printWorkerWindow.webContents.print(printOptions, function(success) {
    if (success) { console.log('invoice-' + ID, "...printed.") } else {
      console.log('invoice-' + ID, "...NOT PRINTED")
    }
  })
});