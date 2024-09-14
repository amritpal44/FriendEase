const hobbyModel = require("../models/hobbyModel");
const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


exports.signup = async(req, res) => {
    try {
        const {userName, password, confirmPassword, bio, hobbies} = req.body;

        if(!userName || !password || !confirmPassword){
            return res.status(403).json({
                success: false,
                message: "All details not entered."
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password are not same"
            })
        }

        const existingUser = await userModel.findOne({userName: userName});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "This username is not available."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let hobbiesId = [];

        //making sure that all hobbies have a unique id
        if(hobbies && hobbies.length > 0){
            hobbiesId = await Promise.all( hobbies.map( async (hobbyName) => {
                let hobby = await hobbyModel.findOne({hobby: hobbyName});
    
                if(!hobby){
                    hobby = await hobbyModel.create({
                        hobby: hobbyName
                    })
                }
    
                return hobby._id;
            }) )
        }


        //creating user
        const user = await userModel.create({
            userName,
            password: hashedPassword, 
            bio,
            hobbies: hobbiesId
        })

        //pushing this user id to all of his hobbies
        if(hobbiesId.length > 0){
            await Promise.all( hobbiesId.map( async (hobbyId) => {
                await hobbyModel.findByIdAndUpdate( hobbyId, {
                    $push: { users: user._id }
                })
            }))
        }

        // console.log("user created: ", user);
        // console.log("user id: ", user._id);

        return res.status(200).json({
            success: true,
            message: "User registered successfully"
        })

    } catch (error) {
        console.log("Error in signup controller: ", error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again"
        })
    }
}


exports.singin = async(req, res) => {

    try {
        const { userName, password } = req.body;
    
        if(!userName || !password){
            return res.status(403).json({
                success: false,
                message: "All fields not entered."
            })
        }
    
        let user = await userModel.findOne({userName: userName});
    
        if(!user){
            return res.status(401).json({
            success: false,
            message: `User is not Registered with Us Please SignUp to Continue`,
            })
        }
    
        console.log("user.password:", user.password);
    
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                {
                    id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "72h"
                }
            )
    
            user.token = token;
            user.password = undefined;
    
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User login success",
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }
        
    } catch (error) {
        console.log("error in login controller: ", error);
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        })
    }
}