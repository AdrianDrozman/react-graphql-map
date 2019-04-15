import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSucces = async googleUser => {
  const idToken = googleUser.getAuthResponse().id_token;
  const client = new GraphQLClient('http://localhost:4000/graphql', {
    headers: { authorization: idToken }
  });
  const { me } = await client.request(ME_QUERY);
  dispatch({ type: 'LOGIN_USER', payload: me });
  dispatch({type:"IS_LOGGED_IN",payload:googleUser.isSignedIn()})
  };

  const onFailure = err => {
    console.error('Error loggin ', err);
  };
  return (
    <div className={classes.root}>
      <Typography
        component='h1'
        variant='h3'
        gutterBottom
        noWrap
        style={{ color: 'rgb(66,133,244)' }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId='322713267585-qvcp00o9s9pks24vfcij9ovu4nnnkiie.apps.googleusercontent.com'
        onSuccess={onSucces}
        onFailure={onFailure}
        isSignedIn={true}
        theme='dark'
        buttonText="Login with Google"
      />
    </div>
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

export default withStyles(styles)(Login);
