const express = require("express");
const { connectDB } = require("./Data/data");
require("dotenv").config(); 
const regroutes = require("./Routes/regroutes"); 
const protectedRoutes = require("./Routes/protectedRoutes");
const blogRoutes = require("./Routes/blogroutes");
const userRoutes = require("./Routes/UserRoutes");


const app = express();
connectDB(); 


app.use(express.json());
app.use("/api/reg",regroutes );
app.use("/api/login", protectedRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);





app.get('/',(req,res)=>{
    res.send("api is runing")
})




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
