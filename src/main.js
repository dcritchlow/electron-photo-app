const electron = require('electron')

const images = require('./images')
const menuTemplate = require('./menu')

const { app, BrowserWindow, ipcMain: ipc, Menu } = electron

app.on('ready', _ => {
    let mainWindow
    mainWindow = new BrowserWindow({
        height: 725,
        width: 893,
        resizeable: false
    })

    mainWindow.loadURL(`file://${__dirname}/capture.html`)

    images.mkdir(images.getPicturesDir(app))

    mainWindow.on('closed', _ => {
        mainWindow = null
    })

    const menuContents = Menu.buildFromTemplate(menuTemplate(mainWindow))
    Menu.setApplicationMenu(menuContents)
})

ipc.on('image-captured', (evt, contents) => {
    images.save(images.getPicturesDir(app), contents, (err, imgPath) => {
        images.cache(imgPath)
    })
})

ipc.on('image-remove', (evt, index) => {
    images.rm(index, _ => {
        evt.sender.send('image-removed', index)
    })
})