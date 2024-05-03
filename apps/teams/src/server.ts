import express, { Express, Request, Response } from "express";
import send from "send";
import https from "https";
import * as fs from "fs";
import compression  from "compression";

const app: Express = express();
const port = process.env.port || process.env.PORT || 3333;

app.use(compression());
app.use('/public/css', express.static(__dirname + '/public/css'));
app.use('/public/js', express.static(__dirname + '/public/js'));
app.use('/public/assets', express.static(__dirname + '/public/assets'));

app.get("/", (req: Request, res: Response) => {
  send(req, __dirname + "/index.html").pipe(res);
});

app.get("/tab", (req: Request, res: Response) => {
  send(req, __dirname + "/index.html").pipe(res);
});   

app.get("/auth-start.html", (req, res, next) => {
  send(req, __dirname + "/auth/auth-start.html").pipe(res);
});

app.get("/auth-end.html", (req, res, next) => {
  send(req, __dirname + "/auth/auth-end.html").pipe(res);
}); 

// Let Azure Cluster handles SSL on its own
if (process.env.RUNNING_ON_AZURE) {

  app.listen(port, () => {
    console.log(`Server started on Azure on port ${port}`)
  });
  
} else {

  // Use a local certificate when served locally
  const options = {
    key: process.env.SSL_KEY_FILE ? fs.readFileSync(process.env.SSL_KEY_FILE) : undefined,               
    cert: process.env.SSL_CRT_FILE ? fs.readFileSync(process.env.SSL_CRT_FILE) : undefined,
  };

  https.createServer(options, app).listen(port, () => {

    console.log(`[server]: Server is running. Port is ${port}`);
  });
}
