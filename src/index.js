"use strict";
const { MessageAttachment, Client, IntentsBitField } = require("discord.js");
const { instagramGetUrl } = require("instagram-url-direct");
const { tiktokdl } = require("tiktokdl");
const fs = require("fs");
const puppeteer = require("puppeteer");
const axios = require("axios");
const getTwitterMedia = require("get-twitter-media");

const client = new Client({
        intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
        ],
});

client.login(
        "INSERT_TOKEN_HERE"
);

client.on("ready", (c) => {
        console.log("Bot radi");
});

client.on("error", (error) => {
        console.error("Discord.js Error:", error);
});

client.on("messageCreate", (msg) => {
        if (msg.author.bot) {
                return;
        }

        handleUrl(msg);
});

async function handleUrl(msg) {
        //const creep = `channel: ${msg.channel}, author: ${msg.member.user.tag}, message: ${msg.content}\n`;
        //fs.appendFileSync('creep.txt', creep, 'utf8');
//   const instagramUrlDirect = await import('./instagram-wrapper.cjs');

  // Access the function from the nested default export
//  const instagramGetUrl = instagramUrlDirect.default.default;

  if (typeof instagramGetUrl !== 'function') {
    console.error("instagramGetUrl is not a function");
    return;
  }

        let check = msg.content.match(
                /\bhttps?:\/\/(www\.)?(instagram\.com|tiktok\.com|vm\.tiktok\.com|twitter\.com|x\.com|reddit\.com|pinterest\.com|douyin\.com)\S+/gi
        );

        if (check) {
                const lok = await client.guilds.fetch(msg.guildId);
                const tier = lok.premiumTier;

                let velicina;

                switch (tier) {
                        case 0:
                        case 1:
                                velicina = 10;
                                break;
                        case 2:
                                velicina = 50;
                                break;
                        case 3:
                                velicina = 100;
                                break;
                        default:
                                velicina = 8; // Default value if none of the cases match
                                break;
                }

                console.log('velicina je'+ velicina)

                let match = msg.content.match(/(?:^|\s)\b([1-9]\d?|sve|all)\b/i);
                let author = msg.author.id;
                if (!match) {
                        match = ["nema"];  // Set match[0] to 1 if no standalone number, "sve", or "all" is found
                }
                if (check[0].includes("instagram")) {
                        console.log('match[0] je:')
                        console.log(match+ [0])
                        //let instagramPattern = /\bhttps?:\/\/(www\.)?instagram\.com\/[\w/]+\/\S*/gi;
                        let instagramPattern = /\bhttps?:\/\/(?:www\.)?instagram\.com\/(?:p|stories|tv|reel)\/[\w-]+(?:\/\S*)?/gi;
                        console.log("nasao pattern")
                        if (!instagramPattern.test(check[0])) {
                                console.log("bye bye")
                                return null;
                        }
                        console.log("prosao test check")
                        //let link = await instagramGetUrl(check[0]); //instaVideo(check[0])//instagramGetUrl(check[0]);
                        try {
                                 var link = await instagramGetUrl(check[0]);
                                 console.log("evo ga url")
                                 console.log(link)
                        } catch (error) {
                                console.error("Error fetching Instagram URL:", error);
                                return null; // Or handle the error however you need (e.g., return, skip, etc.)
                        }
                        console.log("odradio getURL")
                        let videoUrl = null;
                        console.log(link);
                        if (!link) {
                                console.error("No video URL provided.");
                                return null;
                        } else {
                                if(match[0] === "nema"){
                                        console.log("USAO SAM")
                                        let url = link.url_list[0];
                                        console.log(await checkFileType(url));
                                        if (await checkFileType(url) === 0) {
                                                videoUrl = url;
                                                let fname = "ins" + generateRandomString() + ".mp4";
                                                await downloadVideo(videoUrl, fname);
                                                const result = checkFileSize(fname, velicina);
                                                if(result === 0){
                                                        await msg.reply({content: 'Фајл је превелик јебигони'})
                                                        deleteFileAsync(fname);
                                                        return;
                                                }
                                                await msg
                                                        .channel.send({
                                                                content: "<@" + author +`> качи ` + '<'+check[0]+'>',
                                                                files: [fname],
                                                        })
                                                        .catch((err) => {
                                                                console.log("Error during Export File " + err);
                                                        });
                                                msg.delete();
                                                deleteFileAsync(fname);
                                                return;
                                        }else{
                                                console.log("usao u else")
                                                videoUrl = url;
                                                let fname = "ins" + generateRandomString() + ".jpg";
                                                await downloadImage(videoUrl, fname);
                                                const result = checkFileSize(fname, velicina);
                                                if(result === 0){
                                                        await msg.reply({content: 'Фајл је превелик јебигони'})
                                                        deleteFileAsync(fname);
                                                        return;
                                                }
                                                await msg
                                                        .channel.send({
                                                                content: "<@" + author +`> качи ` + '<'+check[0]+'>',
                                                                files: [fname],
                                                        })
                                                        .catch((err) => {
                                                                console.log("Error during Export File " + err);
                                                        });
                                                msg.delete();
                                                deleteFileAsync(fname);
                                                return;
                                        }
                                }else{
                                        let obrisan = 0;
                                        let duzina = 10;
                                        let fileList = []
                                        if(!isNaN(match[0])){
                                                let number = match[0]-1;
                                                if(number <= link.url_list.length){
                                                        videoUrl = link.url_list[number];
                                                        if (await checkFileType(videoUrl) === 0){
                                                                let fname = "ins" + generateRandomString() + ".mp4";
                                                                await downloadVideo(videoUrl, fname);
                                                                const result = checkFileSize(fname, velicina);
                                                                if(result === 0){
                                                                        await msg.reply({content: 'Фајл је превелик јебигони'})
                                                                        deleteFileAsync(fname);
                                                                        return;
                                                                }
                                                                await msg
                                                                        .channel.send({
                                                                                content: "<@" + author +`> качи ` + '<'+check[0]+'>',
                                                                                files: [fname],
                                                                        })
                                                                        .catch((err) => {
                                                                                console.log("Error during Export File " + err);
                                                                        });
                                                                msg.delete();
                                                                deleteFileAsync(fname);
                                                                return;
                                                        }else{
                                                                let fname = "ins" + generateRandomString() + ".jpg";
                                                                await downloadImage(videoUrl, fname);
                                                                const result = checkFileSize(fname, velicina);
                                                                if(result === 0){
                                                                        await msg.reply({content: 'Фајл је превелик јебигони'})
                                                                        deleteFileAsync(fname);
                                                                        return;
                                                                }
                                                                await msg
                                                                        .channel.send({
                                                                                content: "<@" + author +`> качи ` + '<'+check[0]+'>',
                                                                                files: [fname],
                                                                        })
                                                                        .catch((err) => {
                                                                                console.log("Error during Export File " + err);
                                                                        });
                                                                msg.delete();
                                                                deleteFileAsync(fname);
                                                                return;
                                                        }
                                                }else{
                                                        await msg.reply({content: 'Нема снимка са тим бројем.'})
                                                }
                                        }else{
                                                for(let i = 0; i < link.url_list.length && i < duzina; i++){
                                                        const url = link.url_list[i];
                                                        if (await checkFileType(url) === 0) {
                                                                videoUrl = url;
                                                                let fname = "ins" + generateRandomString() + ".mp4";
                                                                await downloadVideo(videoUrl, fname);
                                                                const result = checkFileSize(fname, velicina);
                                                                if(result === 0){
                                                                        deleteFileAsync(fname);
                                                                        obrisan = 1;
                                                                }else{
                                                                        fileList.push(fname)
                                                                }
                                                        }else{
                                                                videoUrl = url;
                                                                let fname = "ins" + generateRandomString() + ".jpg";
                                                                await downloadImage(videoUrl, fname);
                                                                const result = checkFileSize(fname, velicina);
                                                                if(result === 0){
                                                                        deleteFileAsync(fname);
                                                                        obrisan = 1;
                                                                }else{
                                                                        fileList.push(fname)
                                                                }
                                                        }
                                                }
                                                if(fileList.length === 0){
                                                        await msg.reply({content: 'Нисам успео извући ништа из овог поста.'})
                                                }else{
                                                        let replyFiles = fileList.map(filename => ({
                                                                attachment: filename,
                                                                name: filename.split('/').pop() // Use only the filename without path
                                                        }))
                                                        if(obrisan === 0){
                                                                await msg.channel.send({
                                                                        content: "<@" + author +`> качи `+ '<'+check[0]+'>',
                                                                        files: replyFiles
                                                                });
                                                        }else{
                                                                await msg.channel.send({
                                                                        content: "<@" + author +`> качи, али неке ствари нису ту јер су превелике` + '<'+check[0]+'>',
                                                                        files: replyFiles
                                                                });
                                                        }
                                                        msg.delete()

                                                        for (let i = 0; i < fileList.length; i++) {
                                                                deleteFileAsync(fileList[i]);
                                                        }
                                                }
                                        }

                                }
                        }
                } else if (check[0].includes("tiktok") || check[0].includes("douyin")) {
                        let data = await tiktokdl(check[0]);
                        console.log(data);
                        const videoUrl = data.video;
                        let fnamett = "ttk" + generateRandomString() + ".mp4";
                        await downloadVideo(videoUrl, fnamett);
                        const result = checkFileSize(fnamett, velicina);
                        if(result === 0){
                                await msg.reply({content: 'Фајл је превелик јебигони'})
                                deleteFileAsync(fnamett);
                                return;
                        }
                        await msg.channel.send({ content: "<@" + author + "> качи: " + '<'+check[0]+'>', files: [fnamett]})
                                .catch((err) => {
                                        console.log("Error during Export File " + err);
                                });
                        msg.delete();
                        deleteFileAsync(fnamett);
                        //let data = await tiktokdl(check[0]);
                        /*let data = await Tiktok.Downloader(check[0], {
                                version: "v3", //  version: "v1" | "v2" | "v3"
                                proxy: "https" // Support Proxy Http, Https, Socks5
                        })
                        if(data.result.type === 'image'){
                                let fileList = []
                                for(let i = 0; i < data.result.images.length && i<10; i++){
                                        const url = data.result.images[i];
                                        let fname = "ttk" + generateRandomString() + ".jpg";
                                        await downloadImage(url, fname);
                                        const result = checkFileSize(fname, velicina);
                                        if(result === 0){
                                                deleteFileAsync(fname);
                                        }
                                        fileList.push(fname)
                                }
                                let replyFiles = fileList.map(filename => ({
                                        attachment: filename,
                                        name: filename.split('/').pop() // Use only the filename without path
                                }))

                                if(data.result.images.length>10){
                                        await msg.channel.send({
                                                content: "<@" + author +`> качи првих десет слика, остатак је на: `+ '<'+check[0]+'>',
                                                files: replyFiles
                                        });
                                }else{
                                        await msg.channel.send({
                                                content: "<@" + author +`> качи `+ '<'+check[0]+'>',
                                                files: replyFiles
                                        });
                                }

                                for (let i = 0; i < fileList.length; i++) {
                                        deleteFileAsync(fileList[i]);
                                }
                                return;

                        }
                        const videoUrl = data.result.videoHD || data.result.video2 || data.result.video1;
                        let fnamett = "ttk" + generateRandomString() + ".mp4";
                        await downloadVideo(videoUrl, fnamett);
                        const result = checkFileSize(fnamett, velicina);
                        if(result === 0){
                                await msg.reply({content: 'Фајл је превелик јебигони'})
                                deleteFileAsync(fnamett);
                                return;
                        }
                        await msg.channel.send({ content: "<@" + author + "> качи: " + '<'+check[0]+'>', files: [fnamett]})
                                .catch((err) => {
                                        console.log("Error during Export File " + err);
                                });
                        msg.delete();
                        deleteFileAsync(fnamett);*/
                } else if (check[0].includes("twitter")) {
                        let media = await getTwitterMedia(check[0], {
                                buffer: true,
                        });
                        if (media.type === "video") {
                                let videoUrl = media.media[0].url;
                                let fnamex = "tw" + generateRandomString() + ".mp4";
                                await downloadVideo(videoUrl, fnamex);
                                const result = checkFileSize(fnamex, velicina);
                                if(result === 0){
                                        await msg.reply({content: 'Фајл је превелик јебигони'})
                                        deleteFileAsync(fnamex);
                                        return;
                                }
                                /*await msg
                                        .reply({ content: msg.member.user.tag + ` качи ` + '<'+check[0]+'>'+':', files: [fnamex] })
                                        .catch((err) => {
                                                console.log("Error during Export File " + err);
                                        });*/
                                await msg.channel.send({ content: "<@" + author + "> качи: " + '<'+check[0]+'>', files: [fnamex]})
                                        .catch((err) => {
                                                console.log("Error during Export File " + err);
                                        });
                                msg.delete();
                                deleteFileAsync(fnamex);
                        }
                } else if (check[0].includes("x.com")) {
                        check[0] = check[0].replace("x.com", "twitter.com");
                        let media = await getTwitterMedia(check[0], {
                                buffer: true,
                        });
                        if (media.type === "video") {
                                let videoUrl = media.media[0].url;
                                let fnametw = "tw" + generateRandomString() + ".mp4";
                                await downloadVideo(videoUrl, fnametw);
                                const result = checkFileSize(fnametw, velicina);
                                if(result === 0){
                                        await msg.reply({content: 'Фајл је превелик јебигони'})
                                        deleteFileAsync(fnametw);
                                        return;
                                }
                                /*await msg
                                        .reply({ content: msg.member.user.tag + ` качи ` + '<'+check[0]+'>'+':', files: [fnametw] })
                                        .catch((err) => {
                                                console.log("Error during Export File " + err);
                                        });*/
                                await msg.channel.send({ content: "<@" + author + "> качи: " + '<'+check[0]+'>', files: [fnametw]})
                                        .catch((err) => {
                                                console.log("Error during Export File " + err);
                                        });
                                msg.delete();
                                deleteFileAsync(fnametw);
                        }
                } else if (check[0].includes("reddit.com")) {
                        let media = await redditVideo(check[0]);
                        if (media.includes("sd.rapidsave.com")) {
                                let fnamerd = "rd" + generateRandomString() + ".mp4";
                                await downloadVideo(media, fnamerd);
                                const result = checkFileSize(fnamerd, velicina);
                                if(result === 0){
                                        await msg.reply({content: 'Фајл је превелик јебигони'})
                                        deleteFileAsync(fnamerd);
                                        return;
                                }
                                /*await msg
                                        .reply({ content: msg.member.user.tag + ` качи ` + '<'+check[0]+'>'+':', files: [fnamerd] })
                                        .catch((err) => {
                                                console.log("Error during Export File " + err);
                                        });*/
                                await msg.channel.send({ content: "<@" + author + "> качи: " + '<'+check[0]+'>', files: [fnamerd]})
                                        .catch((err) => {
                                                console.log("Error during Export File " + err);
                                        });
                                msg.delete();
                                deleteFileAsync(fnamerd);
                        }
                } else if (check[0].includes("pinterest.com")) {
                        let media = await pintVideo(check[0]);
                        if (media.includes("pinimg.com/videos/")) {
                                let fnamepn = "pint" + generateRandomString() + ".mp4";
                                await downloadVideo(media, fnamepn);
                                const result = checkFileSize(fnamepn, velicina);
                                if(result === 0){
                                        await msg.reply({content: 'Фајл је превелик јебигони'})
                                        deleteFileAsync(fnamepn);
                                        return;
                                }
                                await msg.channel.send({ content: "<@" + author + "> качи: " + '<'+check[0]+'>', files: [fnamepn]})
                                        .catch((err) => {
                                                console.log("Error during Export File " + err);
                                        });
                                msg.delete();
                                deleteFileAsync(fnamepn);
                        }
                }
        }
}

async function redditVideo(redditURL) {
        const browser = await puppeteer.launch({
                args: ["--no-sandbox"],
                executablePath: "/usr/bin/chromium-browser", // Replace this with the path you found
        });
        const page = await browser.newPage();
        let downloadHref;

        try {
                var url = "https://rapidsave.com/info?url=";
                var url = url + redditURL;
                await page.goto(url);

                await page.waitForSelector(".downloadbutton");
                downloadHref = await page.$eval(".downloadbutton", (el) =>
                        el.getAttribute("href")
                );
        } catch (error) {
                console.error("Error:", error);
        } finally {
                await browser.close();
                return downloadHref;
        }
}

async function pintVideo(redditURL) {
        const browser = await puppeteer.launch({
                args: ["--no-sandbox"],
                executablePath: "/usr/bin/chromium-browser", // Replace this with the path you found
        });
        const page = await browser.newPage();
        let videoSrc = null;

        try {
                const url = "https://ptsave.com/info?url=" + redditURL;
                await page.goto(url);

                // Check if error message appears
                const errorMessage = await page.$eval('div.text-xl', el => el.textContent.trim());
                if (errorMessage.includes('Sorry, we could not find any video on this Pin.')) {
                        console.log('Video not found on Pin.');
                        return null; // Return null if video is not found
                }

                // Wait for the video element to load
                await page.waitForSelector('video.h-80');

                // Get the src attribute of the video element
                videoSrc = await page.$eval('video.h-80', el => el.getAttribute('src'));
        } catch (error) {
                console.error("Error:", error);
        } finally {
                await browser.close();
                return videoSrc; // Return the video src or null if not found
        }
}

async function downloadVideo(videoUrl, fileName) {
        try {
                const response = await axios({
                        method: "get",
                        url: videoUrl,
                        responseType: "stream",
                });

                const writer = fs.createWriteStream(fileName);

                response.data.pipe(writer);

                return new Promise((resolve, reject) => {
                        writer.on("finish", resolve);
                        writer.on("error", reject);
                });
        } catch (error) {
                console.error("Error downloading video:", error);
                throw error;
        }
}

function generateRandomString() {
        const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomString = "";

        for (let i = 0; i < 5; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomString += characters.charAt(randomIndex);
        }

        return randomString;
}

function deleteFileAsync(filePath) {
        fs.unlink(filePath, (error) => {
                if (error) {
                        console.error(`Error deleting file ${filePath}:`, error);
                } else {
                        console.log(`File ${filePath} deleted successfully.`);
                }
        });
}

function checkFileSize(filePath, size) {
        try {
                const stats = fs.statSync(filePath);
                const fileSizeInBytes = stats.size;
                const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

                if (fileSizeInMB < size) {
                        console.log("File is under "+ size + "MB. OK");
                        return 1;
                } else {
                        console.log("File is " + size + "MB or larger.");
                        return 0;
                }
        } catch (error) {
                console.error('Error getting file size:', error);
                return null;
        }
}

async function downloadImage(imageUrl, fileName) {
        try {
                const response = await axios({
                        method: "get",
                        url: imageUrl,
                        responseType: "stream",
                });

                const writer = fs.createWriteStream(fileName);

                response.data.pipe(writer);

                return new Promise((resolve, reject) => {
                        writer.on("finish", resolve);
                        writer.on("error", reject);
                });
        } catch (error) {
                console.error("Error downloading image:", error);
                throw error;
        }
}

async function checkFileType(url) {
        try {
                // Send a HEAD request to get the headers of the file
                const headResponse = await axios.head(url);

                // Get the Content-Type from the headers
                const contentType = headResponse.headers['content-type'];

                // Return 1 if it's JPEG, 0 if it's MP4
                if (contentType === 'image/jpeg') {
                        return 1;
                } else if (contentType === 'video/mp4') {
                        return 0;
                } else {
                        throw new Error(`Unsupported file type: ${contentType}`);
                }
        } catch (error) {
                console.error('An error occurred:', error.message);
        }
}