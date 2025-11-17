import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwtToken from '../util/jsonWebToken.js';

const userRegister = async (req, res) => {
    try {
        const {fullname, username, email, password, gender, profilePic} = req.body;
        
        const user = await User.findOne({$or : [{username}, {email}]});
        if(user) 
            return res.status(500).send({success : "false", message : "Username or email already exists"});

        const hashPassword = bcrypt.hashSync(password, 10);
        const profileBoy = profilePic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilePic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password : hashPassword,
            gender,
            profilePic : gender === "male" ? profileBoy : profileGirl
        });

        if(newUser) {
            await newUser.save();
            jwtToken(username, res);
        }
        else 
            return res.staus(500).send({success : "false", message : "Invalid User Data"});

        res.status(200).send({
            _id : newUser._id,
            fullname : newUser.fullname,
            username : newUser.username,
            email : newUser.email,
            profilePic : newUser.profilePic
        });

    } catch (error) {
        res.status(500).send({
            success : "false",
            message : error
        });
        console.log(error);
    }
}

const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) 
            return res.status(500).send({success : "false", message : "Email doesn't exist. kindly Register"});


        const comparePass = bcrypt.compareSync(password, user.password || "");
        if(!comparePass)
            return res.status(500).send({success : "false", message : "Email or password doesn't match"});

        jwtToken(user.username, res);

        res.status(200).send({
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          message : "successfully login"
        });     

    } catch (error) {
         res.status(500).send({
           success: "false",
           message: error,
         });
         console.log(error);
    }
}

const userLogout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).send({message : "user logged out"});
    } catch (error) {
        res.status(500).send({
          success: "false",
          message: error,
        });
        console.log(error);
    }
}

export { userRegister, userLogin, userLogout };
