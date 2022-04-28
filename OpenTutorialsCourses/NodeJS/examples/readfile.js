var fs = require('fs');

fs.readFile('../../Ajax/articles/html', 'utf8', function(err, data){
    if (err) throw err;
    console.log(data);
});

var dir_path = '../articles/'
fs.readdir(dir_path, function(err, filelist){
    console.log(filelist)
});