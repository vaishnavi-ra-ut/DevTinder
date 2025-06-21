const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name not found!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditProfile = (req) => {
  const allowedEdit = ["firstName", "lastName", "about", "skills", "age", "gender", "photoURL"];
  const updateFields = Object.keys(req.body);

  console.log("Incoming fields:", updateFields);     // 👈 log fields being updated
  console.log("Allowed fields:", allowedEdit);       // 👈 log allowed fields

  const isEditAllowed = updateFields.every((field) => allowedEdit.includes(field));

  if (!isEditAllowed) {
    throw new Error("Invalid fields for update");
  }
};


module.exports = { validateSignUp, validateEditProfile };
