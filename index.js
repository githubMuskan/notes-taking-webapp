const express= require('express');
const app= express();
const path= require('path');
const fs= require('fs');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
        if(err){
            res.render('index',{files:[]});
        } else {
            res.render('index',{files:files});
        }
    });
});

app.post('/create',(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join("_")}.txt`,req.body.details,(err)=>{
        res.redirect('/');
    });
});

app.get('/files/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,'utf-8',(err,data)=>{
        res.render('file',{data:data, filename:req.params.filename});
    });  
});

app.get('/edit/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,'utf-8',(err,data)=>{
        res.render('edit',{details:data, filename:req.params.filename});
    });
});

app.post('/update/:filename',(req,res)=>{
    newFileName=req.body.newtopicname.split(' ').join("_");
    oldFileName=req.params.filename.slice(0, -4);
    if(newFileName!=oldFileName){
        fs.rename(`./files/${req.params.filename}`,`./files/${newFileName}.txt`,(err)=>{
            if(err){
                console.log(err);
            }
        });
    }
    fs.writeFile(`./files/${newFileName}.txt`,req.body.details,(err)=>{
        res.redirect('/');
    });
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});