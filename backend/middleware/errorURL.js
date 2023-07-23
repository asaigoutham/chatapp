const errorURL = (req,res,next)=>{
    res.status(404);
    next();
}
 module.exports = errorURL