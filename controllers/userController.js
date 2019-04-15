const User = require('../models/User');

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  //very auth token
  const googleUser = await verifyAuthToken(token)
  //check if the user exist
 const user= await checkIfUserExits(googleUser.email)
  //if user exits return them;otherwise create new user
  return user ? user : createNewUser(googleUser)
};

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (err) {
    console.error('Error verifying auth token', error);
  }
};

const checkIfUserExits = async email=>await User.findOne({email}).exec()

const createNewUser =  googleUser=>{
    const { name,email,picture} = googleUser;
    const user ={ name,email,picture}
    return new User(user).save()
}