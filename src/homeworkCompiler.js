/*
 * Auto-compiler for homework format
 */

let Compiler = require("./compiler.js").Compiler;
let fs = require("fs");
let path = require("path");

let extname = {
    "C": ".c",
    "C++14": ".cpp",
    "C++17": ".cpp"
};

function compile(lang) {
    fs.readdir('../source/', function(err, files) {
        if(err) {
            console.log(err);
        } else {
            files.forEach(function(filename) {
                if(path.extname(filename).toLowerCase() !== extname[lang]) return;
                let fullFilename = "../source/" + filename;
                let comp = new Compiler(lang);
                comp.addSource(fullFilename);
                comp.compile("../bin/" + path.basename(filename, path.extname(filename)));
                comp.events.on("compileFinish", function(arg) {
                    if(arg.status !== 0) {
                        if(arg.stderr) {
                            fs.writeFile("../bin/" + filename + ".compile.log", arg.stderr, function(){});
                        } else {
                            fs.writeFile("../bin/" + filename + ".compile.log", arg.stack, function(){});
                        }
                    }
                });
            });
        }
    });
}

exports.compile = compile;