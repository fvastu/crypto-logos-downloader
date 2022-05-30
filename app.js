import fetch from "node-fetch";
import fs from 'fs';

const baseUrl = 'https://cryptologos.cc/logos/';
const extensionChosen = "png";
const destinationFolder = './logos/'
const cryptoSource = 'crypto.json';
let coins;

createDirectory();
parseCryptos();
downloadLogos();

function parseCryptos() {
    let rawdata = fs.readFileSync(cryptoSource);
    coins = JSON.parse(rawdata);
}

function createDirectory() {
    fs.access(destinationFolder, function(notExists) {
        if (notExists) {
            fs.mkdirSync(destinationFolder)
        }
      })
}

function buildUrl(name, symbol) {
    return baseUrl + name + '-' + symbol + '-logo' + '.' + extensionChosen + '?v=022';
}

function downloadLogos() {
    for (const coin in coins) {
        const url = buildUrl(coin, coins[coin].symbol.toLowerCase());
        console.log('Downloading Logo of', coin);
        download(url, destinationFolder, coin, 'png');
    }
}

function download(uri, folder, filename, extensionChosen) {
    fetch(uri)
	.then(res =>
		res.body.pipe(fs.createWriteStream(folder + filename + '.' + extensionChosen))
	).catch((e) => console.log('Error during the download', e));
};  

