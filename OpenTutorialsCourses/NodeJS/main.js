var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var Template = require('./template.js');


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
          var list = Template.getList(fileList);
          var body = `<h2>${title}</h2><p>${content}</p>`;
          var control = `<a href="/create_form">Create</a>`;
          var template = Template.getHTML(title, list, body, control);
          response.writeHead(200);
          response.end(template);
        })
      } else {
        fs.readdir(articleDir, function(readDirErr, fileList){
          var title = path.parse(queryData.id).base;
          fs.readFile(articleDir + title, 'utf-8', function(readFileErr, content){
            if (readFileErr){
              var content = `${title} is not Exist`
            }
            var list = Template.getList(fileList);
            // content의 줄바꿈 문자(\n)를 <br>로 치환
            var body = `<h2>${title}</h2><p>${content.replace(/\n/g, '<br>')}</p>`;
            var control = `
            <a href="/create_form">Create</a> 
            <a href="/update_form?id=${title}">Update<\a>
            <form 
              action="/delete" 
              method="post" 
              onsubmit="return confirm('Do you want to delete ${title}?');" 
              style="display: inline">
                <input type="hidden" name=id value="${title}">
                <input type="submit" value="delete">
            </form>
            `;
            var template = Template.getHTML(title, list, body, control);
            response.writeHead(200);
            response.end(template);
          })
        })
      }
    } else if(pathName === '/create_form') {
      fs.readdir(articleDir, function(err, fileList){
        var title = 'Create Article';
        var list = Template.getList(fileList);
        var body = Template.getForm('\create');
        var control = '';
        var template = Template.getHTML(title, list, body, control);
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
        var title = path.parse(post.get('title')).base;
        var content = post.get('content');

        fs.writeFile(articleDir + title, content, 'utf-8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});   // redirect to created page
          response.end();
          // response.end(`${title} write sucess`);
        });
      });
      
    } else if(pathName === '/update_form') {
      fs.readdir(articleDir, function(err1, fileList){
        var title = path.parse(queryData.id).base;
        fs.readFile(articleDir + title, 'utf-8', function(err2, content){
          var list = Template.getList(fileList);
          var body = Template.getForm('/update', title, content)
          var control = '';
          var template = Template.getHTML(title, list, body, control);
          response.writeHead(200);
          response.end(template);
        })
      })
    } else if(pathName === '/update') {

      var body = '';
      request.on('data', function(data){
        body = body + data;
      });

      request.on('end', function(){
        var post = new URLSearchParams(body);
        var id = path.parse(post.get('title')).base;
        var title = path.parse(post.get('title')).base;
        var content = post.get('content');

        if (id !== title) {
          fs.rename(articleDir + id, articleDir + title, function(err){
            fs.writeFile(articleDir + title, content, 'utf-8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});   // redirect to updated page
              response.end();
            });
          });
        } else {
          fs.writeFile(articleDir + title, content, 'utf-8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});   // redirect to updated page
            response.end();
          });
        }
      });

    } else if(pathName === '/delete') {

      var body = '';
      request.on('data', function(data){
        body = body + data;
      });

      request.on('end', function(){
        var post = new URLSearchParams(body);
        var id = path.parse(post.get('id')).base;

        fs.unlink(articleDir + id, function(err){
          response.writeHead(302, {Location: '/'});   // redirect to Home
          response.end();
        });
      });

    }
    else {
      response.writeHead(404);
      response.end(`${pathName} is Not Found`);
    }

});

app.listen(3000);