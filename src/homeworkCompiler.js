/*
 * Auto-compiler for homework format
 */

let Compiler = require("./compiler.js").Compiler;
let events = require("events");
let fs = require("fs");
let path = require("path");

let extname = {
    "C": ".c",
    "C++14": ".cpp",
    "C++17": ".cpp"
};

let compileEvent = new events.EventEmitter();
function compile(lang) {
    fs.readdir('../source/', function(err, files) {
        if(err) {
            console.log(err);
        } else {
            let compilationJobCnt = 0;
            files.forEach(function(filename) {
                if(path.extname(filename).toLowerCase() !== extname[lang]) return;
                let fullFilename = "../source/" + filename;
                let comp = new Compiler(lang);
                comp.addSource(fullFilename);
                compilationJobCnt++;
                comp.compile("../bin/" + path.basename(filename, path.extname(filename)));
                comp.events.on("compileFinish", function(arg) {
                    compilationJobCnt--;
                    if(compilationJobCnt === 0) compileEvent.emit("batchFinish");
                    if(arg.status !== 0) {
                        if(arg.stderr) {
                            fs.writeFile("../bin/" + filename + ".compile.log", arg.stderr, () => {});
                        } else {
                            fs.writeFile("../bin/" + filename + ".compile.log", arg.stack, () => {});
                        }
                    }
                });
            });
        }
    });
}

exports.compile = compile;
exports.compileEvent = compileEvent;