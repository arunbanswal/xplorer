const fs = require('fs');
const path = require('path');
const filterHidden = require('../Filter/hiddenFiles');

const IGNORE_FILE = ['desktop.ini']

// Function to get all files and directory inside a directory
const getFilesAndDir = async (dir, callback) => {
    let result = []
    // Get files of the dir
    const files = await fs.readdirSync(dir)
    for(const file of files){
        if(IGNORE_FILE.indexOf(file) !== -1) continue
        // Check if the file is a dir
        try{
            const isDir = fs.lstatSync(path.join(dir, file)).isDirectory()  
            result.push({ filename: file, isDir })
        }catch(e){}
    }
    // Filter hidden files
    filterHidden(result, dir, result => {
        callback(result)
    })
    // Watch the directory
    fs.watch(dir, async (eventType, filename) => {
        let result = []
        // Get files of the dir
        const files = await fs.readdirSync(dir)
        files.forEach(file => {
            // Check if the file is a dir
            const isDir = fs.lstatSync(path.join(dir, file)).isDirectory()
            result.push({ filename: file, isDir })
        })
        // Filter hidden files
        filterHidden(result, dir, result => {
            callback(result)
        })  
    })
}

module.exports = { getFilesAndDir }