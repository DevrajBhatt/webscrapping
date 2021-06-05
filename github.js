let url = "https://github.com/topics";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
const PDFDocument = require("pdfkit");
request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.log(error);
    } else {
        // console.log(html);
        extractData(html);
    }
}

function extractData(html) {
    let selectorTool = cheerio.load(html);
    let topicsArr = selectorTool(".col-12.col-sm-6.col-md-4.mb-4 a");
    for (let i = 0; i < topicsArr.length; i++) {
        let links = selectorTool(topicsArr[i]).attr("href");
        let fullLinks = "https://github.com" + links;
        // console.log(fullLinks);
        topicsPage(fullLinks);
    }
}

function topicsPage(fullLinks) {
    request(fullLinks, cb);

    function cb(error, response, html) {
        if (error) {
            console.log(error);
        } else {
            extractRepoLink(html);
        }
    }
}

function extractRepoLink(html) {
    let selectorTool = cheerio.load(html);
    let topicsNameELem = selectorTool(".h1").text();
    let topicName = topicsNameELem.trim();
    // console.log(topicName);
    dirCreater(topicName);
    let topicsRepoArr = selectorTool("a.text-bold");
    for (let i = 0; i < 8; i++) {
        let repoLink = selectorTool(topicsRepoArr[i]).attr("href");
        let repoName = repoLink.split("/").pop();
        repoName = repoName.trim();
        // createFile(repoName, topicName);
        // console.log(repoLink);
        let fullRepoLink = "https://github.com" + repoLink + "/issues";
        getIssues(repoName, topicName, fullRepoLink);
    }
    console.log("`````````````````````````````````````````````````");
}

function dirCreater(topicName) {
    let pathOfFolder = path.join(__dirname, topicName);
    if (fs.existsSync(pathOfFolder) === false) {
        fs.mkdirSync(pathOfFolder);
    }
}

function createFile(repoName, topicName) {
    let pathOfFile = path.join(__dirname, topicName, repoName + ".json");
    if (fs.existsSync(pathOfFile) === false) {
        var createStream = fs.createWriteStream(pathOfFile);
        createStream.end();
    }
}

function getIssues(repoName, topicName, fullRepoLink) {
    request(fullRepoLink, cb);

    function cb(error, response, html) {
        if (error) {
            if (response.statusCode === 404) {
                console.log("issue page not found");
            } else {
                console.log(error);
            }
        } else {
            extractIssue(html, topicName, repoName);
        }
    }
}

function extractIssue(html, topicName, repoName) {
    let selectorTool = cheerio.load(html);
    let issueAnchorArr = selectorTool(
        ".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title"
    );
    let arr = [];
    for (let i = 0; i < issueAnchorArr.length; i++) {
        let name = selectorTool(issueAnchorArr[i]).text();
        let link = selectorTool(issueAnchorArr[i]).attr("href");
        arr.push({
            Name: name,
            Link: "https://github.com" + link,
        });
    }
    let filePath = path.join(__dirname, topicName, repoName + ".pdf");
    let pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.text(JSON.stringify(arr));
    pdfDoc.end();
    // fs.writeFileSync(filePath, JSON.stringify(arr));
    // console.table(arr);
}