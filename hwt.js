let url =
    "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
const { first } = require("cheerio/lib/api/traversing");
console.log("Before");
request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.log(error);
    } else {
        // console.log(html);
        extractHtml(html);
    }
}

function extractHtml(html) {
    let selectorTool = cheerio.load(html);
    let bowlersTable = selectorTool(".table.bowler");

    // let stringHtml = "";
    // for (let i = 0; i < bowlersTable.length; i++) {
    //     stringHtml += selectorTool(bowlersTable[i]).html();
    // }
    // console.log(stringHtml);
    let hwktname = "";
    let hwicket = 0;
    for (let i = 0; i < bowlersTable.length; i++) {
        let singleInningBol = selectorTool(bowlersTable[i]).find("tbody tr");
        for (let j = 0; j < singleInningBol.length; j++) {
            let singleAllCol = selectorTool(singleInningBol[j]).find("td");
            let name = selectorTool(singleAllCol[0]).text();
            let wickets = selectorTool(singleAllCol[4]).text();
            console.log("Name-> ", name, "Wickets-> ", wickets);
            if (wickets >= hwicket) {
                hwicket = wickets;
                hwktname = name;
            }
            console.log(hwktname + " : " + hwicket);
        }
        console.log("```````````````````````````````");
    }
}

console.log("After");