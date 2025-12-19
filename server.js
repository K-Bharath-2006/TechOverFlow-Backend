const app = require("./index");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });


mongoose.connect(process.env.DB_URL).then(()=> {
    console.log("DB Connected Successfully");
})
.catch((err)=> {
    console.log(err);
});

app.listen(process.env.PORT_NO, () => {
  console.log("Server Started on",process.env.PORT_NO);
});
