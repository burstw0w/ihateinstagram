"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReelInfo = void 0;
const {MessageAttachment, Client, IntentsBitField} = require('discord.js');
const puppeteer_1 = require("puppeteer");
const cheerio = require("cheerio");
const axios = require('axios');
const fs = require('fs');

const base_url = [
    "https://api-va.tiktokv.com",
    "https://api16-core-c-useast1a.tiktokv.com",
    "https://api16-core-c-useast2a.tiktokv.com",
    "https://api16-core-va.tiktokv.com",
    "https://api16-normal-c-useast1a.tiktokv.com",
    "https://api16-normal-c-useast2a.tiktokv.com",
    "https://api16-va.tiktokv.com",
    "https://api19-core-c-useast1a.tiktokv.com",
    "https://api19-core-c-useast2a.tiktokv.com",
    "https://api19-core-va.tiktokv.com",
    "https://api19-normal-c-useast1a.tiktokv.com",
    "https://api19-normal-c-useast2a.tiktokv.com",
    "https://api19-va.tiktokv.com",
];

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.login(INSERT_TOKEN_HERE);

client.on('ready', (c) =>{
    console.log('Bot radi')
});

client.on('error', (error) => {
    console.error('Discord.js Error:', error);
});

client.on('messageCreate', (msg) => {
    if (msg.author.bot){
        return;
    };

    handleUrl(msg);
});

async function getHTML(url) {
    console.log("usao u getHTML");
    const browser = await puppeteer_1.default.launch({
        headless: "true",
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("video");
    const html = await page.content();
    await page.close();
    await browser.close();
    return html;
}

async function getReelInfo(url) {
    console.log("Usao u getReelInfo");
    const html = await getHTML(url);
    const $ = cheerio.load(html);
    const videoDirectLink = $("video").attr("src");
    return videoDirectLink;
}

async function getTikTok(url){
    url = url.match(/\/video\/(\d+)/);;
    console.log(url)
    url = base_url[Math.floor(Math.random() * 13)] + '/aweme/v1/feed/?aweme_id=' + url[1];
    console.log(url);
    try {
        const response = await axios.get(url);

        if (!response.data) {
            throw new Error('Network response was not ok');
        }

        const data = response.data;
        const link = data.aweme_list[0]?.video?.play_addr?.url_list[0];
        return link;
    } catch (error) {
        console.error('Error during fetch operation:', error);
        throw error;
    }
}

async function getHTML(url) {
    console.log("usao u getHTML");
    const browser = await puppeteer_1.default.launch({
        headless: "true",
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("video");
    const html = await page.content();
    await page.close();
    await browser.close();
    return html;
}

async function getTiktokInfo(inputUrl) {
    const browser = await puppeteer_1.default.launch({
        headless: "true",
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    try {
        await page.goto(inputUrl);
        await page.waitForNavigation();
        const redirectedUrl = page.url();
        return redirectedUrl;
    } finally {
        await browser.close();
    }
}

async function handleUrl(msg) {

    let check = msg.content.match(/\bhttps?:\/\/(www\.)?(instagram\.com|tiktok\.com|vm\.tiktok\.com)\S+/gi);

    if (check) {
        if(check[0].includes('instagram')){
            let link = await getReelInfo(check[0]);
            let fname = "ins" + generateRandomString() + ".mp4";
            await downloadVideo(link, fname);
            await msg.reply({content: msg.member.user.tag + ` качи `, files: [fname]}).catch((err) => {console.log("Error during Export File " + err);});
            deleteFileAsync(fname);
        }
        else if(check[0].includes('tiktok')){
            let link;
            if(check[0].includes('vm')){
                console.log(check[0]);
                link = await getTiktokInfo(check[0]);
                link = await getTikTok(link);
            }else{
                link = await getTikTok(check[0]);
            }
            let fname = "ttk" + generateRandomString() + ".mp4";
            await downloadVideo(link, fname)
            await msg.reply({content: msg.member.user.tag + ` качи `, files: [fname]}).catch((err) => {console.log("Error during Export File " + err);});
            deleteFileAsync(fname);
        }
    }
}

async function downloadVideo(videoUrl, fileName) {

    try {
        const response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(fileName);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading video:', error);
        throw error;
    }
}

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

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

