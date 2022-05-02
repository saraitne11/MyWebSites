var http = require('http');
var fs = require('fs');
var url = require('url');


function getTemplateForm(action, title='', content=''){
  return `
  <form action="${action}" method="post">
    <p><input type="hidden" name="id" value="${title}"></p>
    <p><input type="text" name="title" placeholder="Title" value="${title}"></p>
    <p><textarea name="content" placeholder="Article Content">${content}</textarea></p>
    <p><input type="submit"></p>
  </form>
  `;
}


function getTemplateHTML(title, list, body, control){
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
    ${control}
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


var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var articleDir = './articles/'

    if(pathName === '/'){     // home
      if(queryData.id === undefined){
        fs.readdir(articleDir, function(err, fileList){
          var title = 'Welcome';
          var content = 'Hello, Node.JS!';
          var list = getTemplateList(fileList);
          var body = `<h2>${title}</h2><p>${content}</p>`;
          var control = `<a href="/create_form">Create</a>`;
          var template = getTemplateHTML(title, list, body, control);
          response.writeHead(200);
          response.end(template);
        })
      } else {
        fs.readdir(articleDir, function(readDirErr, fileList){
          var title = queryData.id;
          fs.readFile(articleDir + queryData.id, 'utf-8', function(readFileErr, content){
            if (readFileErr){
              var content = `${title} is not Exist`
            }
            var list = getTemplateList(fileList);
            // content의 줄바꿈 문자(\n)를 <br>로 치환
            var body = `<h2>${title}</h2><p>${content.replace(/\n/g, '<br>')}</p>`;
            var control = `
            <a href="/create_form">Create</a> 
            <a href="/update_form?id=${title}">Update<\a>
            `;
            var template = getTemplateHTML(title, list, body, control);
            response.writeHead(200);
            response.end(template);
          })
        })
      }
    } else if(pathName === '/create_form') {
      fs.readdir(articleDir, function(err, fileList){
        var title = 'Create Article';
        var list = getTemplateList(fileList);
        var body = getTemplateForm('\create');
        var control = '';
        var template = getTemplateHTML(title, list, body, control);
        response.writeHead(200);
        response.end(template);
      })
    } else if(pathName === '/create') {

      var body = '';
      request.on('data', function(data){
        body = body + data;
      });

      request.on('end', function(){
        var post = new URLSearchParams(body);
        var title = post.get('title');
        var content = post.get('content');

        fs.writeFile(articleDir + title, content, 'utf-8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});   // redirect to created page
          response.end();
          // response.end(`${title} write sucess`);
        });
      });
      
    } else if(pathName === '/update_form') {
      fs.readdir(articleDir, function(err1, fileList){
        var title = queryData.id;
        fs.readFile(articleDir + queryData.id, 'utf-8', function(err2, content){
          var list = getTemplateList(fileList);
          var body = getTemplateForm('/update', title, content)
          var control = '';
          var template = getTemplateHTML(title, list, body, control);
          response.writeHead(200);
          response.end(template);
        })
      })
    } else if(pathName === '/update') {

    }
    else {
      response.writeHead(404);
      response.end(`${pathName} is Not Found`);
    }

});

app.listen(3000);