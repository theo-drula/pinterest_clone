const fs = require("fs");
const http = require("http");
const host = 'localhost';
const port = 9541;
const server = http.createServer();

let commentaires ={};
server.on("request",(req,res)=>{
    if(req.url.startsWith("/public")){
        try{
            const fichier = fs.readFileSync('.'+req.url);
            res.end(fichier);
        }
        catch (err){
            res.end("erreur 404");
        }

    }

    else if(req.url === '/mur-images'){
        let imgs = fs.readdirSync('./public/images');
        let PageHtml = '<!Doctype html><html><head>';
        PageHtml+= '<meta charset="UTF-8"><link rel ="stylesheet" href="/public/style.css">';
        PageHtml+= "<title>Mur d'images</title></head><body>";
        PageHtml+='<span class = "previous"><a href ="/public/index.html">Index</a></span>'
        PageHtml+='<span class = "next"><a href ="/public/image-description.html">Commentaire</a></span>'
        PageHtml+='<h1>mur avec toutes les images</h1>';
        for (let i = 0; i<imgs.length;i++){
            if (!imgs[i].endsWith("_small.jpg")){
                let id = imgs[i].split('.jpg')[0].split('image')[1];
                //id = id.split('image')[1];
                PageHtml+= '<a href = "/page-image/'+id+'"><img src ="/public/images/'+imgs[i].split('.jpg')[0]+'_small.jpg"/></a>';
            }
    
        }
        PageHtml+='</body></html>';
        res.end(PageHtml);
    }

    else if (req.url.startsWith("/page-image/")){
        let imgs = fs.readdirSync('./public/images'); 
        let id = parseInt(req.url.split("/")[2]); 
        let imgUrl = './public/images/image'+id+'.jpg';     
        if (fs.existsSync(imgUrl)){   
            let imgHtml ='<!Doctype html><html><head>';                
            let suivant = id+1;
            let before = id-1;
            imgHtml += '<meta charset="UTF-8"><link rel ="stylesheet" href="/public/style.css"></head><body>';
            imgHtml +='<a class = "previous" href ="/mur-images"><p>Mur</p></a>';        
            imgHtml +='<div><img width="700" src = "/public/images/image'+id+'.jpg"></div>';
            imgHtml+= '<form action="/image-description" method = "post"><input type="hidden" name="numero" id="numero" value="'+id+'"><input type="text" name="image-description"><input type="submit" name="envoyer"></form>'
            imgHtml += '<h2>Commentaires :</h2>';
            if (commentaires.hasOwnProperty(id)) {
                for (let i =0;i<commentaires[id].length;i++){
                    console.log(commentaires[id][i]);
                    imgHtml += '<div>' + commentaires[id][i] + '</div>';
                }

            }      
            if(fs.existsSync('./public/images/image'+before+'.jpg')){
                imgHtml +='<span class = "previous"><a href = "/page-image/'+before+'"><img src = "/public/images/image'+before+'_small.jpg"></a></span>';
            }
            if(fs.existsSync('./public/images/image'+suivant+'.jpg')){
                imgHtml +='<span class = "next"><a href = "/page-image/'+suivant+'"><img src = "/public/images/image'+suivant+'_small.jpg"></a></span>';
            }
            imgHtml +='</body></html>';
            res.end(imgHtml);
        }
    }
    
    
        


    
    
    else if (req.method === 'POST' && req.url === '/image-description'){
        let donnees = "";
        
        req.on("data",(dataChunk)=>{
            donnees+= dataChunk.toString();
        });
        req.on("end", () => {
            const paramValeur = donnees.split("&");
            const imageNumber = paramValeur[0].split("=")[1];
            const description = paramValeur[1].split("=")[1]; 
            if(!commentaires[imageNumber]){
                commentaires[imageNumber]=[];
            }                
            commentaires[imageNumber].push(description);


            
            
            
            
            console.log(commentaires[imageNumber]);
            res.statusCode = 302;
            res.setHeader('Location', '/page-image/'+imageNumber);
            res.end();
        });
        
    }
    else {
        res.end(fs.readFileSync("./public/index.html"))
    }
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});