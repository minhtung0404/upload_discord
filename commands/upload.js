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

    async exec(message, args) {
        let images = [], uploaded = fs.readFileSync('./files.txt', 'utf8').split('\n');

        Path.forEach(function(path){
            walkSync(path, images);
        }); // read PATH of all images

        //delete your command
        message.delete();

        // upload your files
        for (let id = 0; id < images.length; id++){

            // check whether file is uploaded or not
            if (uploaded.includes(images[id])) continue;

            // Send file
            let attachment = new MessageAttachment(images[id]);
            await message.channel.send(images[id], attachment).catch(err => {
                console.log(`Can't send your files`);
                file.end();
                return message.channel.send(`Fail to send files`);
            });
            console.log("Send " + images[id]);

            // append it to files.txt
            fs.appendFileSync('files.txt', images[id] + '\n', function(err, ){
                if (err) throw err;
                console.log(`Save ${images[id]} into files.txt`);
            });

            // check whether you have uploaded enough
            args.numberofMessage--;
            if (args.numberofMessage == 0) break;
        }

        if (args.numberofMessage > 0){
            console.log("Not enough files");
            await message.channel.send("Not enough files");
        }
        return 0;
    }
}

module.exports = UploadCommand;
