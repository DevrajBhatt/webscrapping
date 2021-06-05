let url =
    "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.log(error);
    } else {
        extractData(html);
    }
}

function extractData(html) {
    let selectorTool = cheerio.load(html);
    let bothBatsmanTable = selectorTool(".table.batsman");
    // console.log(bothBatsmanTable.length);
    // let tableHtml = "";
    // for (let i = 0; i < bothBatsmanTable.length; i++) {
    //     tableHtml += selectorTool(bothBatsmanTable[i]).html();
    // }

    for (let i = 0; i < bothBatsmanTable.length; i++) {
        let batsmanNameElem = selectorTool(bothBatsmanTable[i]).find(
            "tbody tr .batsman-cell a"
        );
        for (let j = 0; j < batsmanNameElem.length; j++) {
            let link = selectorTool(batsmanNameElem[j]).attr("href");
            let fullLink = "https://www.espncricinfo.com" + link;
            let name = selectorTool(batsmanNameElem[j]).text();
            printBirthday(fullLink, name);
        }
        console.log("```````````````````````````````");
    }
}

function printBirthday(fullLink, name) {
    request(fullLink, cb);

    function cb(error, response, html) {
        if (error) {
            console.log(error);
        } else {
            extractBirthday(html);
        }
    }

    function extractBirthday(html) {
        let selectorTool = cheerio.load(html);
        let birthdayElem = selectorTool(".player-card-description");
        let birthday = selectorTool(birthdayElem[1]).text();
        console.log(name + " was born on " + birthday);
    }
}