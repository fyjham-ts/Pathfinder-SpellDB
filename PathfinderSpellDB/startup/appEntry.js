const path = require("path");
var appRoot = path.join(__dirname, "..");

require('electron-compile').init(appRoot, require.resolve('./app'));
