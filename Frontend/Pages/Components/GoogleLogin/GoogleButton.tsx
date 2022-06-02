import { gql, useMutation } from '@apollo/client';
import React, { useCallback, useContext, useEffect } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { JWTContext } from '../../../App';
import { LOGIN_GOOGLE } from '../../../postgre/Mutation';

function isGoogleLoginResponseOffline(response: GoogleLoginResponse | GoogleLoginResponseOffline): response is GoogleLoginResponseOffline {
  return response.code !== undefined;
}

export default function GoogleLoginButton() {
  const [loginGoogle, { data, loading, error }] = useMutation<{loginGoogle: string}>(LOGIN_GOOGLE);
  const [_, setJwt] = useContext(JWTContext);

  useEffect(() => {
    if (data !== undefined && data !== null) {
      setJwt(data.loginGoogle);
    }
  }, [data]);

  function responseGoogle(response: GoogleLoginResponse | GoogleLoginResponseOffline) {
    if (isGoogleLoginResponseOffline(response)) {
      alert("Failed to login with google");
      return;
    }
  
    loginGoogle({
      variables: { 
        accessToken: response.getAuthResponse().access_token,
      },
    });
  }

  return (
    <GoogleLogin
      clientId="861025247325-e7jrpatdtjumqod4ar7breu1jum0q6d6.apps.googleusercontent.com"
      render={renderProps => (
        
        <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            <img src="./google-logo.png" className="w-6 h-6" alt="" />
          Login with Google
        </button>
      )}
      onSuccess={responseGoogle}
      cookiePolicy="single_host_origin" />
  );
}