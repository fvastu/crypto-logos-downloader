import fetch from "node-fetch";
import fs from 'fs';
import compress_images from "compress-images";

const baseUrl = 'https://cryptologos.cc/logos/';
const extensionChosen = "png";
const destinationFolder = './logos/'
const inputImagePath = destinationFolder + '*.png';
const destinationFolderCompressed = './logos_compressed/';
const cryptoSource = 'crypto.json';
const compressionVerbose = true;
const compressionDelay = 3000;
const useCompression = true;
let coins;

main();

/**
 * Download an image and after a delay compress it
 */
function main() {
    createDirectory();
    parseCryptos();
    downloadLogos();
    if (!useCompression) return;
    setTimeout(() => compress(compressionVerbose), compressionDelay);
}

function parseCryptos() {
    let rawdata = fs.readFileSync(cryptoSource);
    coins = JSON.parse(rawdata);
}

function createDirectory() {
    fs.access(destinationFolder, function(notExists) {
        if (notExists) fs.mkdirSync(destinationFolder)
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
    fetch(uri).then(res => res.body.pipe(fs.createWriteStream(folder + filename + '.' + extensionChosen)))
              .catch((e) => console.log('Error during the download', e));
};

function compress(withInfo) {
    console.log('Starting Compression...');
    compress_images(inputImagePath, destinationFolderCompressed, 
        { compress_force: false, statistic: true, autoupdate: true }, 
        false,
        { jpg: { engine: false, command: false } },
        { png: { engine: "pngquant", command: ["--quality=0-10", "-o"] } },
        { svg: { engine: false, command: false } },
        { gif: { engine: false, command: false } },
        function (error, completed, statistic) {
            if (withInfo) {
                console.log("-------------");
                console.log(error);
                console.log(completed);
                console.log(statistic);
                console.log("-------------");
            }
        }
    );
}
