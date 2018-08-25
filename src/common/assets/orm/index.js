var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));



const fs = require('fs')
const fse = require('fs-extra');
var typeorm = require("typeorm");
var EntitySchema = typeorm.EntitySchema;
var electron = require("electron")
const remote = electron.remote;
const app = remote.app;

let sep = path.sep
const userDataPath = app.getPath('userData') + sep;
fse.ensureDirSync(userDataPath + "orm" + sep)

 
let ASSETS_DIR = remote.getGlobal('ASSETS_GLOBAL');

var ormPathname =  ASSETS_DIR+'/orm'
console.log( "ormPathname..-->> ", ormPathname + "/entity/*.js")
var options = {
    "type": "sqljs",
    "synchronize": true,
    "logging": true,
    "logger": "simple-console",
    //   "database": "mc-office.sqlite",
    "location": userDataPath + "orm" + sep + "mc-office.sqlite",
    "autoSave": true,
    "entities": [
      // ormPathname+  "/entity" 
      new EntitySchema( require(  ormPathname+  "/entity/Post")),
    ]
}
typeorm.createConnection(options).then(() => {
    var post = {
        title: "post title",
        text: "post text"

    };
    return typeorm.getRepository("Post").save(post);

}).then(() => {
    console.log("Saved successfully!");
    return typeorm.getRepository("Post").find();

}).then(posts => {
    console.log("Posts: ", posts);

    let ul = document.getElementById("postList");
    posts.forEach(post => {
        var li = document.createElement('li');
        li.innerText = post.id + ". " + post.title;
        ul.appendChild(li);
    });

}).catch(error => {
    console.error("Error: ", error);
});