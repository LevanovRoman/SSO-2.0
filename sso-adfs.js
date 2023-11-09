const { app, BrowserWindow, Tray, Menu} = require('electron')
const EventEmitter = require('events')
const loadingEvents = new EventEmitter()
const positioner = require('electron-traywindow-positioner');
const path = require('path');
var net = require('net');
const kill = require("kill-port");
const user_port = 8000;

const appURL = "http://127.0.0.1:8000/";
let window = null;
let tray = null;

const showWindow = () => {
  positioner.position(window, tray.getBounds());
  window.show();
};

const toggleWindow = () => {
  if (window.isVisible()) return window.hide();
  return showWindow();
};

const createTray = () => {
  tray = new Tray('icon2.ico');
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Show App', click: function () {
                showWindow()}},
    {label: 'Quit', click: function () {
                app.isQuiting = true
                app.quit()}}
  ]);
  tray.setToolTip('SSO-auth');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    toggleWindow();
  });
};

const createWindow = () => {
  window = new BrowserWindow({
    width: 1600,
    height: 600,
    // show: false,
    icon:'./icon2.ico',
     title: "SSO - auth",
    webPreferences: {
      nodeIntegration: true,
    },
  });
 window.removeMenu()
 window.loadFile('loading.html');

    // Our loadingEvents object listens for 'finished'
    loadingEvents.on('open', () => {
    window.loadURL(appURL);
 })
    portInUse(8000);

 
 window.on('close', function (event) {
    if(!app.isQuiting){
        event.preventDefault();
        window.hide();
        event.returnValue = false;
    }
});
};



app.on('ready', () => {
  createWindow();
  createTray();
});


app.on('before-quit', function () {
  isQuiting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    kill(user_port, "tcp");
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


 loadingEvents.on('not_open', () => {
    setTimeout(() => {portInUse(8000);}, 1000);
 })

 var portInUse = function(port) {
    var server = net.createServer(function(socket) {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
    });

    server.on('error', function(e) {
             loadingEvents.emit('open')
    });
    server.on('listening', function (e) {
    server.close();
    loadingEvents.emit('not_open')
    });

    server.listen(port, '127.0.0.1');
};


