
# Upload discord

## Description

A bot can upload all your images in your folders to a channel in discord.

## Requirement

- Nodejs

## How to use

- Clone this repository
- Run `npm install` to install all package
- Create a `config.json` that looks like this:
```json
{
    "prefix" : "your prefix",
    "token" : "your bot token",
    "ownerID" : "your discord ID",
    "Path" : ["Path"]
}
```
- Create `files.txt` to know that what you have uploaded (it'll save your files' PATH)
- Run `node index.js`
- Run prefix + upload in the channel you need to upload images.

## Note
- I create this project to save my images to discord but it turned out that I don't have Discord Nitro so I can't upload images with high quality :(((.
- Update: I know that you can download the original quality by remove the size from the image link. For example:
`https://media.discordapp.net/attachments/745198778377830432/746738974181294219/1.jpg?width=1173&height=660`
to
`https://media.discordapp.net/attachments/745198778377830432/746738974181294219/1.jpg`
- You can change it to upload whatever you want by change `./commands/upload.js` file.
- It will send your files and its path.
