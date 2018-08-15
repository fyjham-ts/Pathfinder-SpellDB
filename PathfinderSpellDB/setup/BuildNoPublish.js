"use strict";

const builder = require("electron-builder")
const Platform = builder.Platform

// Promise is returned
builder.build({
    "targets": Platform.WINDOWS.createTarget(),
    config: {
        'win': {
            "publish": ["github"]
        }
    }
})
    .then(() => {
        console.log("Installer created successfully.");
    })
    .catch((e) => console.log(`Error building: ${e.message}`));