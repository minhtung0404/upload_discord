const { Command } = require('discord-akairo');
const { MessageAttachment } = require('discord.js');
const fs = require('fs');
var isImage = require('is-image');

let Path = [
    '/home/minhtung0404/Pictures/nani/'
]; // paths of folders containing images

var walkSync = function(dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            walkSync(dir + file + '/', filelist);
        }
        else {
            if (isImage(file)) {
                filelist.push(dir + file);
            }
        }
    });
};

class UploadCommand extends Command {
    constructor() {
        super('upload', {
            aliases: ['upload'],
            channel: 'guild'
        });
    }

    exec(message) {
        let images = [], uploaded = fs.readFileSync('./files.txt',
    'utf8').split('\n');
        Path.forEach(function(path){
            walkSync(path, images);
        });
        var file = fs.createWriteStream('./files.txt');
        file.on('error', function(err){
            if (err) throw err;
        });
        message.delete();
        for (let id in uploaded){
            if (uploaded[id] === '') continue;
            file.write(uploaded[id] + '\n');
        }
        let l = 0, r = 3;
        for (let id = l; id < r && id < images.length; id++){
            if (uploaded.includes(images[id])) continue;
            let attachment = new MessageAttachment(images[id]);
            message.channel.send(images[id], attachment);
            console.log("Send " + images[id]);
            file.write(images[id] + '\n');
        }
        file.end();
    }
}

module.exports = UploadCommand;
