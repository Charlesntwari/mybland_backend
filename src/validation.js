// export const checkUser = async(req,res,next)=>{
//     let {email,password} = req.body;
//     const user = await userModel.findOne({email});
//     if(!user){
//         return next();
//     }
//    res.status(404).json({
//    message: "user already created an account"
// });
// };
const validation = (schema) => (payload) =>
schema.validate(payload, { abortEarly: false});

const signupSchema = Joi.object({
  fullname: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(3).max(20).required()
});
exports.validateSignup = validation(signupSchema); 