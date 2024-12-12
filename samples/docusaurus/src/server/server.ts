import express from "express";

const app = express();
const port = process.env.port || process.env.PORT || 3333;

app.use(express.static(__dirname + '/build'));

app.listen(port, () => {
  console.log(`Server started on Azure on port ${port}`)
});
  