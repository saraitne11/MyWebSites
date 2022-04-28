var fs = require('fs');

fs.readFile('../../Ajax/articles/html', 'utf8', function(err, data){
    if (err) throw err;
    console.log(data);
});