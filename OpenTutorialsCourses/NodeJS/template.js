
module.exports = {

    getHTML: function (title, list, body, control){
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
    },
  
    getForm: function(action, title='', content=''){
      return `
      <form action="${action}" method="post">
        <p><input type="hidden" name="id" value="${title}"></p>
        <p><input type="text" name="title" placeholder="Title" value="${title}"></p>
        <p><textarea name="content" placeholder="Article Content" rows="10" cols="50">${content}</textarea></p>
        <p><input type="submit"></p>
      </form>
      `;
    },
  
    getList: function(fileList){
      var listStr = '<ul>';
      var i = 0
      while(i < fileList.length){
        listStr = listStr + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        i = i + 1;
      }
      listStr = listStr + '</ul>';
      return listStr;
    }

  }
