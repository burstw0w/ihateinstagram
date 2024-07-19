"use strict";
const { MessageAttachment, Client, IntentsBitField } = require("discord.js");
const instagramGetUrl = require("instagram-url-direct");
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

	let check = msg.content.match(
		/\bhttps?:\/\/(www\.)?(instagram\.com|tiktok\.com|vm\.tiktok\.com|twitter\.com|x\.com|reddit\.com|pinterest\.com|youtube\.com\/shorts)\S+/gi
	);

	if (check) {
		let match = msg.content.match(/(?:^|\s)\b([1-9]\d?|sve|all)\b/i);
		if (!match) {
			match = ["nema"];  // Set match[0] to 1 if no standalone number, "sve", or "all" is found
		}
		if (check[0].includes("instagram")) {
			console.log('match[0] je:')
			console.log(match[0])
			let instagramPattern = /\bhttps?:\/\/(www\.)?instagram\.com\/[\w/]+\/\S*/gi;
			if (!instagramPattern.test(check[0])) {
				return null;
			}
			let link = await instagramGetUrl(check[0]); //instaVideo(check[0])//instagramGetUrl(check[0]);
			let videoUrl = null;
			console.log(link);
			if (!link) {
				console.error("No video URL provided.");
				return null;
			} else {
				if(match[0] === "nema"){
						let url = link.url_list[0];
						if (!url.includes("scontent.cdninstagram.com")) {
							videoUrl = url;
							let fname = "ins" + generateRandomString() + ".mp4";
							await downloadVideo(videoUrl, fname);
							const result = checkFileSize(fname);
							if(result === 0){
								await msg.reply({content: 'File is too large, sorry.'})
								deleteFileAsync(fname);
								return;
							}
							await msg
								.reply({
									content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':',
									files: [fname],
								})
								.catch((err) => {
									console.log("Error during Export File " + err);
								});
							msg.delete();
							deleteFileAsync(fname);
							return;
						}else{
							videoUrl = url;
							let fname = "ins" + generateRandomString() + ".jpg";
                                                                await downloadImage(videoUrl, fname);
                                                                const result = checkFileSize(fname);
                                                                if(result === 0){
                                                                        await msg.reply({content: 'File is too large, sorry.'})
                                                                        deleteFileAsync(fname);
                                                                        return;
                                                                }
                                                                await msg
                                                                        .reply({
                                                                                content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':',
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
							if (!videoUrl.includes("scontent.cdninstagram.com")){
								let fname = "ins" + generateRandomString() + ".mp4";
								await downloadVideo(videoUrl, fname);
								const result = checkFileSize(fname);
								if(result === 0){
									await msg.reply({content: 'File is too large, sorry.'})
									deleteFileAsync(fname);
									return;
								}
								await msg
									.reply({
										content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':',
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
								const result = checkFileSize(fname);
								if(result === 0){
									await msg.reply({content: 'File is too large, sorry.'})
									deleteFileAsync(fname);
									return;
								}
								await msg
									.reply({
										content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':',
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
							if (!url.includes("scontent.cdninstagram.com")) {
								videoUrl = url;
								let fname = "ins" + generateRandomString() + ".mp4";
								await downloadVideo(videoUrl, fname);
								const result = checkFileSize(fname);
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
								const result = checkFileSize(fname);
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
								await msg.reply({
									content: `${msg.member.user.tag} uploads `+ '<'+check[0]+'>'+':',
									files: replyFiles
								});
							}else{
								await msg.reply({
									content: `${msg.member.user.tag} uploads, али неке ствари нису ту јер су превелике` + '<'+check[0]+'>'+':',
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
		} else if (check[0].includes("tiktok")) {
			let data = await tiktokdl(check[0]);
			console.log(data);
			const videoUrl = data.video;
			let fnamett = "ttk" + generateRandomString() + ".mp4";
			await downloadVideo(videoUrl, fnamett);
			const result = checkFileSize(fnamett);
			if(result === 0){
				await msg.reply({content: 'File is too large, sorry.'})
				deleteFileAsync(fnamett);
				return;
			}
			await msg
				.reply({ content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':', files: [fnamett] })
				.catch((err) => {
					console.log("Error during Export File " + err);
				});
			msg.delete();
			deleteFileAsync(fnamett);
		} else if (check[0].includes("twitter")) {
			let media = await getTwitterMedia(check[0], {
				buffer: true,
			});
			if (media.type === "video") {
				let videoUrl = media.media[0].url;
				let fnamex = "tw" + generateRandomString() + ".mp4";
				await downloadVideo(videoUrl, fnamex);
				const result = checkFileSize(fnamex);
				if(result === 0){
					await msg.reply({content: 'File is too large, sorry.'})
					deleteFileAsync(fnamex);
					return;
				}
				await msg
					.reply({ content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':', files: [fnamex] })
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
				const result = checkFileSize(fnametw);
				if(result === 0){
					await msg.reply({content: 'File is too large, sorry.'})
					deleteFileAsync(fnametw);
					return;
				}
				await msg
					.reply({ content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':', files: [fnametw] })
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
				const result = checkFileSize(fnamerd);
				if(result === 0){
					await msg.reply({content: 'File is too large, sorry.'})
					deleteFileAsync(fnamerd);
					return;
				}
				await msg
					.reply({ content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':', files: [fnamerd] })
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
				const result = checkFileSize(fnamepn);
				if(result === 0){
					await msg.reply({content: 'File is too large, sorry.'})
					deleteFileAsync(fnamepn);
					return;
				}
				await msg
					.reply({ content: msg.member.user.tag + ` uploads ` + '<'+check[0]+'>'+':', files: [fnamepn] })
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

function checkFileSize(filePath) {
	try {
		const stats = fs.statSync(filePath);
		const fileSizeInBytes = stats.size;
		const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

		if (fileSizeInMB < 25) {
			console.log("File is under 25MB. OK");
			return 1;
		} else {
			console.log("File is 25MB or larger.");
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
