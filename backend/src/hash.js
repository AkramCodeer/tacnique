const bcrypt = require("bcryptjs");

const password = "12345";
const password2 = "12345";

const run = async () => {
  const salt = await bcrypt.genSalt(10);
  const salt2 = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  let hashedPassword2 = await bcrypt.hash(password2, salt2);
  console.log("Salt ", salt);
  console.log("Salt2 ", salt2);
  console.log("hashedPassword ", hashedPassword);
  console.log("hashedPassword2 ", hashedPassword2);

  console.log(await bcrypt.compare(password, hashedPassword));
};

run();
