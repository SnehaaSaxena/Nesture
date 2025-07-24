const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Nesture!");
            res.redirect("/listings");
        });
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{ // here passport.authenticate is a middleware which authenticate or identidy whether user already exist or not
    req.flash("success", "Welcome to Nesture! Login successfully");
    //res.redirect("/listings");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);// here problem is when passport.authentication gets done then passport reset req.session so if we access it we'll get null so we will use local as it is accessible everywhere
   };

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{ // this logout method takes callback as parameter
      if(err){
         return next(err);
      }
      req.flash("success","You are logged out!");
      res.redirect("/listings");
    })
  };