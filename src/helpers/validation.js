const validator = require("validator")

const validateSignUp = (req) => {
    const {firstName , lastName , emailId , password } = req.body;  
    
    if (!firstName || !lastName) {
        throw new Error("Name not found!");
    
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");

    } else if (!validator.isStrongPassword (password)) {
        throw new Error("Please enter a strong Password!");
    }   
};

const validateEditProfile = (req) => {
    const allowedEdit = ["firstName" , "lastName" , "about"  , "skills" , "age" , "gender"]

    const isEditAllowed = 
        Object.keys(req).every((field) => allowedEdit.includes(field)
    );

return isEditAllowed;
};

module.exports = { validateSignUp , validateEditProfile }