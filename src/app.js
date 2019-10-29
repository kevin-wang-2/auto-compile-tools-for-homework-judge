/*
 * A demonstration of this compiler tool.
 */

let Compiler = require("./compiler.js").Compiler;

let comp = new Compiler("C");

comp.addSource('test.c');
comp.compile('main');

comp.events.on("compileFinish", (args) => {
    console.log(args);
});