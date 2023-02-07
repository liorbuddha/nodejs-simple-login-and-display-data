'use strict'
const http = require('http');
const fs = require('fs');
const url = require('url');
//get all files:
const homePage = fs.readFileSync(`${__dirname}/front-end/index.html`);
const scorePage = fs.readFileSync(`${__dirname}/front-end/score.html`);
const loginPage = fs.readFileSync(`${__dirname}/front-end/login.html`);
const loginPageJs = fs.readFileSync(`${__dirname}/front-end/loginForm.js`);
const scoresPageJs = fs.readFileSync(`${__dirname}/front-end/scores_js.js`);
const homeStyle = fs.readFileSync(`${__dirname}/front-end/styles.css`);
const homeImage = fs.readFileSync(`${__dirname}/front-end/logo.png`);
const homeLogic = fs.readFileSync(`${__dirname}/front-end/browser-app.js`);
let score_list = fs.readFileSync(`${__dirname}/appData/score_data.txt`);
let users_list = fs.readFileSync(`${__dirname}/appData/users_data.txt`);
users_list=users_list.toString().split("\r\n")
for(let u in users_list){
    users_list[u] = users_list[u].split(',')
}
//sort contact list by name
const sortList = (list) => {
    return list.sort((a, b) => {
        return a[2] - b[2];
      });
}

const checkPasswordMatchUser = (user, pwd)=>{
    let found = false;
    users_list.forEach(element => {
        if(element[1]===pwd && element[0] == user){
            found = true
        }
    });
    return found;
}
const server = http.createServer((req, res)=>{
    //console.log(req.method)
    let pathName = req.url;
    const path = url.parse(pathName, true);
    pathName = path.pathname;
    const query = path.query;
    //home page
    if(pathName==='/home'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.write(homePage);
        res.end();
    }
    //scores page
    else if(pathName === '/scores'){
        
       res.writeHead(200, {'content-type': 'text/html'});
        res.write(scorePage);
        res.end();
    }
    //score page POST
    else if(pathName === '/score'&& req.method === 'POST'){
        const body = [];
      req.on('data', chunk => {
        console.log(chunk);
        body.push(chunk);
      });
      req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        console.log(parsedBody);
        const formData = parsedBody.split('&');
        for(let i = 0;i<formData.length;i++){
            formData[i] = formData[i].split('=')
        }
        console.log(formData);
        let recordToAdd = `\r\n`;
        for(let i =0;i<formData.length;i++){
            recordToAdd+=`${formData[i][1]}`
            recordToAdd+=formData.length-i>1?",":""
        }
        console.log(recordToAdd);
        fs.appendFileSync(`${__dirname}/appData/score_data.txt`, recordToAdd);
        score_list = fs.readFileSync(`${__dirname}/appData/score_data.txt`);
        res.writeHead(200, {'content-type': 'text/html'});
         res.write(scorePage);
         res.end();
    });
        // res.writeHead(200, {'content-type': 'text/html'});
        //  res.write(scorePage);
        //  res.end();
     }
    //GET list of score (use fetch from FE)
    else if(pathName === '/scoreData'&& req.method === 'GET'){
        let data = score_list.toString().split("\r\n")
        for(let i =0;i<data.length;i++){
            let details = data[i].split(",");
            data[i] = details;
        }
       //console.log(data);
         res.end(JSON.stringify({"data":data}));
     }
    //score data GET
    else if(pathName === '/scoreData'&& req.method === 'GET'){
        let data = score_list.toString().split("\r\n")
        for(let i =0;i<data.length;i++){
            let details = data[i].split(",");
            data[i] = details;
        }
       console.log(data);
         res.end(JSON.stringify({"data":data}));
     }
    //login page GET
    else if(pathName === '/'&& req.method === 'GET'){
        res.writeHead(200, {'content-type': 'text/html'});
         res.write(loginPage);
         res.end();
     }
     //POST request for login page
     else if(pathName === '/login'&& req.method === 'POST'){
        //array to hold body of the request
        const body = [];
      req.on('data', chunk => {
        //inserting data to the array
        body.push(chunk);
      });
      req.on('end', () => {
        //parse body data to string
        const parsedBody = Buffer.concat(body).toString();
        let formData = JSON.parse(parsedBody);
        console.log(formData);
        //res.end(JSON.stringify({}));
        if(checkPasswordMatchUser(formData.user, formData.password)){
            console.log("true");
            res.writeHead(200, {'content-type': 'text/html'});
            res.write('/home');
            res.end();
        }else{
            res.writeHead(201, {'content-type': 'text/html'});
            res.write('/');
            res.end();
        }
      });
       
     }
    
    //style
    else if(pathName === '/styles.css'){
       res.writeHead(200, {'content-type': 'text/css'});
        res.write(homeStyle);
        res.end();
    }
    //img/logo
    else if(pathName === '/logo.png'){
       res.writeHead(200, {'content-type': 'image/png'});
        res.write(homeImage);
        res.end();
    }
    //logic
    else if(pathName === '/browser-app.js'){
        res.writeHead(200, {'content-type': 'text/javascript'});
         res.write(homeLogic);
         res.end();
     }
     else if(pathName === '/loginForm.js'){
        res.writeHead(200, {'content-type': 'text/javascript'});
         res.write(loginPageJs);
         res.end();
     }
     else if(pathName === '/scores_js.js'){
        res.writeHead(200, {'content-type': 'text/javascript'});
         res.write(scoresPageJs);
         res.end();
     }
    //404
    else{
       res.writeHead(404, {'content-type': 'text/html'});
        res.write('<h1>Page Not Found</h1>');
        res.end();
    }
});
server.listen(3000, ()=>{
    console.log("listenning on port 3000");
})