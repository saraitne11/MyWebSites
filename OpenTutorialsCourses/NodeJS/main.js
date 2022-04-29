var http = require('http');
var fs = require('fs');
var url = require('url');     // url module

function getTemplateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}

function getTemplateList(fileList){
  var listStr = '<ul>';
  var i = 0
  while(i < fileList.length){
    listStr = listStr + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i = i + 1;
  }
  listStr = listStr + '</ul>';
  return listStr;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var articleDir = './articles/'


    if(pathName === '/'){
      
      if(queryData.id === undefined){
        fs.readdir(articleDir, function(err, fileList){
          var title = 'Welcome';
          var article = 'Hello, Node.JS!';
          var list = getTemplateList(fileList);
          var body = `<h2>${title}</h2><p>${article}</p>`;
          var template = getTemplateHTML(title, list, body);
          response.writeHead(200);
          response.end(template);
        })
      } else {
        fs.readdir(articleDir, function(err1, fileList){
          var title = queryData.id;
          fs.readFile(articleDir + queryData.id, 'utf-8', function(err2, article){
            var list = getTemplateList(fileList);
            var body = `<h2>${title}</h2><p>${article}</p>`;
            var template = getTemplateHTML(title, list, body);
            response.writeHead(200);
            response.end(template);
          })
        })
      }
      
    } else {
      response.writeHead(404);
      response.end(`${pathName} is Not Found`);
    }

});

app.listen(3000);