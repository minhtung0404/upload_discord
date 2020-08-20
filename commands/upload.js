const { Command } = require('discord-akairo');
const { MessageAttachment } = require('discord.js');
const fs = require('fs');
const { Path } = require('../config.json');
var isImage = require('is-image');

var walkSync = function(dir, filelist) { // read all images in your directory recursively
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            walkSync(dir + file + '/', filelist);
        }
        else {
            if (isImage(file)) { // change this to upload whatever you want
                filelist.push(dir + file);
            }
        }
    });
};

class UploadCommand extends Command {
    constructor() {
        super('upload', {
            aliases: ['upload'],
            channel: 'guild',
            args: [
                {
                    id: 'numberofMessage',
                    type: 'number',
                    default: 100
                }
            ],
            description: "`Upload your files`"
        });
    }

    usage = "`upload [number of message]`\n`Default: 100 files`";
    example = "`upload 10`";

    exec(message, args) {
        let images = [], uploaded = fs.readFileSync('./files.txt', 'utf8').split('\n');

        Path.forEach(function(path){
            walkSync(path, images);
        }); // read PATH of all images

        //Prepare to write to file.txt
        var file = fs.createWriteStream('./files.txt');
        file.on('error', function(err){
            if (err) throw err;
        });

        //delete your command
        message.delete();

        //add uploaded files to files.txt
        for (let id in uploaded){
            if (uploaded[id] === '') continue;
            file.write(uploaded[id] + '\n');
        }

        // upload your files
        for (let id = 0; id < images.length; id++){

            // check whether file is uploaded or not
            if (uploaded.includes(images[id])) continue;

            // Send file
            let attachment = new MessageAttachment(images[id]);
            message.channel.send(images[id], attachment).catch(err => {
                console.log(`Can't send your files`);
                file.end();
                return message.channel.send(`Fail to send files`);
            });
            console.log("Send " + images[id]);

            // write it to files.txt
            file.write(images[id] + '\n');

            // check whether you have uploaded enough
            args.numberofMessage--;
            if (args.numberofMessage == 0) break;
        }

        if (args.numberofMessage > 0){
            console.log("Not enough files");
            message.channel.send("Not enough files");
        }

        // close write on files.txt
        file.end();
    }
}

module.exports = UploadCommand;
