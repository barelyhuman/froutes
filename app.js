const microServer = require('./lib/micro-server');
const http = require('http');
const PORT = process.env.PORT || 3000; 

http.createServer(
    (req,res)=>{
        microServer(req,res);
    }  
).listen(PORT,()=>{
    console.log("> Listening on "+PORT);
});




