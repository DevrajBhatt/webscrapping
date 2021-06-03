let url =
    "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
const { find } = require("cheerio/lib/api/traversing");
// console.log("Before");
request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.log(error);
    } else {
        // console.log(html)
        extractHtml(html);
    }
}

function extractHtml(html) {
    let selectorTool = cheerio.load(html);
    let bothBatsmanTable = selectorTool(".table.batsman");
    let teamNameArrElem = selectorTool(".Collapsible__trigger");
    let teamNameArr = [];
    for (let i = 0; i < teamNameArrElem.length; i++) {
        let teamName = selectorTool(teamNameArrElem[i]).text();
        teamName = teamName.split("INNINGS")[0];
        teamNameArr.push(teamName);
    }
    // console.log(bothBatsmanTable.length);
    // let tableHtml = "";
    // for (let i = 0; i < bothBatsmanTable.length; i++) {
    //     tableHtml += selectorTool(bothBatsmanTable[i]).html();
    // }
    for (let i = 0; i < bothBatsmanTable.length; i++) {
        let batsmanNameElem = selectorTool(bothBatsmanTable[i]).find(
            "tbody tr .batsman-cell"
        );
        for (let j = 0; j < batsmanNameElem.length; j++) {
            let batsmanName = selectorTool(batsmanNameElem[j]).text();
            console.log(batsmanName, "plays for", teamNameArr[i]);
        }

        console.log("```````````````````````");
    }
    // console.log(tableHtml);
}