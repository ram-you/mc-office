 // Get mainWindow Object 
 let mainWindow

 const path = require('path')
 const { Menu, ipcMain } = require('electron')
 const electron = require('electron')
 const app = electron.app
 var i18n = new(require('./i18n'))
 const isDevelopment = process.env.NODE_ENV !== 'production'
 let assetsFolder = isDevelopment ? '../common/assets/' : '/../../../assets/'

 function init(window) {
   mainWindow = window;
   const fileMenu = {
     label: 'File',
     submenu: [{
         label: 'Home',
         icon: path.join(__dirname, assetsFolder + 'icons/menu/home.png'),
         accelerator: 'CmdOrCtrl+H',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'home');
         },
       }

     ],
   };

   const viewHiddenWindowsMenu = {
     label: 'View',
     submenu: [{
         label: 'Print Worker',
         icon: path.join(__dirname, assetsFolder + 'icons/menu/file-invoice.png'),
         click() {
           global.printWorkerWindow.isVisible() ? global.printWorkerWindow.hide() : global.printWorkerWindow.show();
         },
       },
       { type: 'separator' },
       {
         label: 'Database Worker',
         icon: path.join(__dirname, assetsFolder + 'icons/menu/database.png'),
         click() {
           global.dbWorkerWindow.isVisible() ? global.dbWorkerWindow.hide() : global.dbWorkerWindow.show();
         },
       },
       { type: 'separator' },
       { role: 'forcereload' },
       { role: 'togglefullscreen' },
     ]
   };

   const invoiceMenu = {
     label: 'Invoice',
     submenu: [{
         label: 'New',
         accelerator: 'CmdOrCtrl+N',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'new-invoice');
         },
       },
       {
         label: 'Save',
         accelerator: 'CmdOrCtrl+S',
         click() {
           mainWindow.webContents.send('menu-form-save');
         },
       },
       {
         label: 'Reset',
         accelerator: 'CmdOrCtrl+R',
         click() {
           mainWindow.webContents.send('menu-form-clear');
         },
       },
       { type: 'separator' },
       {
         label: 'Add Item',
         accelerator: 'CmdOrCtrl+I',
         click() {
           mainWindow.webContents.send('menu-form-add-item');
         },
       },
       { type: 'separator' },
       {
         label: 'Toggle',
         submenu: [{
             label: 'Toggle Form Settings',
             accelerator: 'Alt+S',
             click() {
               mainWindow.webContents.send('menu-form-toggle-settings');
             },
           },
           {
             label: 'Toggle Due Date',
             accelerator: 'Alt+T',
             click() {
               mainWindow.webContents.send('menu-form-toggle-dueDate');
             },
           },
           {
             label: 'Toggle Currency',
             accelerator: 'Alt+C',
             click() {
               mainWindow.webContents.send('menu-form-toggle-currency');
             },
           },
           {
             label: 'Toggle VAT',
             accelerator: 'Alt+V',
             click() {
               mainWindow.webContents.send('menu-form-toggle-vat');
             },
           },
           {
             label: 'Toggle Discount',
             accelerator: 'Alt+D',
             click() {
               mainWindow.webContents.send('menu-form-toggle-discount');
             },
           },
           {
             label: 'Toggle Note',
             accelerator: 'Alt+N',
             click() {
               mainWindow.webContents.send('menu-form-toggle-note');
             },
           },
         ],
       }
     ],
   };

   const goMenu = {
     label: 'Go',
     submenu: [{
         label: 'Invoices',
         accelerator: 'CmdOrCtrl+Shift+A',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'invoices');
         },
       },
       {
         label: 'Contacts',
         accelerator: 'CmdOrCtrl+Shift+D',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'contacts');
         },
       },
       {
         label: 'Settings',
         icon: path.join(__dirname, assetsFolder + 'icons/menu/wrench.png'),
         accelerator: 'CmdOrCtrl+Shift+S',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'settings');
         },
       },
     ],
   };

   const editMenu = {
     label: 'Edit',
     submenu: [
       { role: 'undo' },
       { role: 'redo' },
       { type: 'separator' },
       { role: 'cut' },
       { role: 'copy' },
       { role: 'paste' },
       { role: 'pasteandmatchstyle' },
       { role: 'deconste' },
       { role: 'selectall' },
     ],
   };

   const viewMenu = {
     label: 'View...',
     submenu: [
       { role: 'forcereload' },
       { role: 'toggledevtools' },
       { type: 'separator' },
       { role: 'togglefullscreen' },
     ],
   };

   const windowsMenu = {
     role: 'window',
     submenu: [{ role: 'minimize' }, { role: 'close' }],
   };

   const helpMenu = {
     role: 'help',
     submenu: [{
         label: 'Show Tutorial',
         accelerator: 'CmdOrCtrl+T',
         click() {
           ipc.send('start-tour');
         },
       },
       { type: 'separator' },
       {
         label: 'MEDIACEPT Technology',
         click() {
           require('electron').shell.openExternal('http://mediacept.com');
         },
       },
       {
         label: 'About MEDIACEPT Office',
         icon: path.join(__dirname, assetsFolder + 'icons/menu/info-circle.png'),
         accelerator: 'CmdOrCtrl+A',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'about');
         },
       },
     ],
   };

   // Add additional menu item on Windows & Linux
   if (process.platform !== 'darwin') {
     // Add Quit to invoiceMenu
     fileMenu.submenu.push({ type: 'separator' }, {
       icon: path.join(__dirname, assetsFolder + 'icons/menu/power-off.png'),
       role: 'close',
       label: i18n.__('Close')
     }, );
     // Add check for update to helpMenu
     helpMenu.submenu.unshift({
       label: 'Check For Updates',
       accelerator: 'CmdOrCtrl+U',
       click() {
         ipc.send('check-for-updates');
       },
     });
   }
   // Base menu
   const menuTemplate = [
     fileMenu,
     invoiceMenu,
     goMenu,
     viewHiddenWindowsMenu,
     editMenu,
     windowsMenu,
     helpMenu,
   ];
   // Add About menu on Mac
   if (process.platform === 'darwin') {
     menuTemplate.unshift(aboutMenu);
   }
   // Developer Tools Menu
   if (isDevelopment) menuTemplate.splice(3, 0, viewMenu);
   // Build the menu
   const menu = Menu.buildFromTemplate(menuTemplate);
  //  Menu.setApplicationMenu(menu);


   mainWindow.setMenu(menu)

 }



 module.exports.init = init;