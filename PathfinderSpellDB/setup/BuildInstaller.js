const electronPackager = require('electron-packager');
const electronInstaller = require('electron-winstaller');
const path = require('path');

electronPackager({
    "dir": ".",
    "arch": "x64",
    "overwrite": true,
    "platform": "win32",
    "afterCopy": [
        (buildPath, electronVersion, platform, arch, callback) => {
            console.log("Build Path: " + buildPath);
            resultPromise = electronInstaller.createWindowsInstaller({
                appDirectory: path.resolve(buildPath, '../../'),
                outputDirectory: '../installer/',
                authors: 'Tim Schneider',
                exe: 'electron.exe',
                noMsi: true
            });
            resultPromise.then(() =>
                console.log("Installer created successfully."),
                (e) => console.log(`Error building Installer: ${e.message}`)
            );
        }
    ]
})