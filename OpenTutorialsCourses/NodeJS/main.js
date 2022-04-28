var http = require('http');
var fs = require('fs');
var url = require('url');     // url module

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var articlesDir = 'articles/'


    if(pathName === '/'){

      fileList = fs.readdirSync(articlesDir);
      var contentsList = '<ul>';
      for (var i in fileList){
        contentsList = contentsList + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
      }
      contentsList = contentsList + '</ul>';

      if(queryData.id === undefined){
        var title = 'Welcome';
        var article = 'Hello, Node.JS!';
      } else {
        var title = queryData.id;
        try {
          var article = fs.readFileSync(articlesDir + queryData.id, {encoding: 'utf-8', flag: 'r'});
        } catch (err){
          if (err.code !== 'ENOENT') throw err;   // No File Not Found Error
          else var article = `File [${queryData.id}] Not Found!`    // It's File Not Fount Error
        }
      }

      var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</ a></h1>
        ${contentsList}
        <h2>${title}</h2>
        <p>${article}</p>
      </body>
      </html>
      `;
        response.writeHead(200);
        response.end(template);
      
    } else {
      response.writeHead(404);
      response.end(`${pathName} is Not Found`);
    }

});

app.listen(3000);