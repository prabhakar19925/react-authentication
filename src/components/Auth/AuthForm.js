import { useState, useRef, useContext } from 'react';
import { AuthContext } from '../../store/auth-context';
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom'
const AuthForm = () => {
  const history = useHistory(); 
const emailInputRef = useRef();
const passwordInputRef = useRef();
const AuthCtx = useContext(AuthContext); 

const [isLogin, setIsLogin] = useState(true);
const [isLoading, setIsLoading] = useState(false);

const switchAuthModeHandler = () => {
  setIsLogin((prevState) => !prevState);
};

  const submitHandler = (event) => {
   event.preventDefault(); 
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let URL = ''; 
    if(isLogin) {
      URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC4jgTd5ofJQM7wOkn4HoduuPKX0kCsMGg';
    } else {
      URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC4jgTd5ofJQM7wOkn4HoduuPKX0kCsMGg';
    }
    setIsLoading(true); 
    fetch(URL,{
      method: 'POST',
      body: JSON.stringify({ 
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {'Content-type': 'application/json'}
     
    }).then((res)=> {
       setIsLoading(false);
      if(res.ok) {
        return res.json();
      } else {
       return res.json().then((data)=>{
          let errormessage = 'Authentication failed!';
          if( data && data.error  && data.error.message) {
            errormessage = data.error.message;  
          }
          throw(new Error(errormessage));
        })
      }
    }).then((data)=>{
      AuthCtx.login(data.idToken);
      history.replace('/');
    })
    .catch((err)=>{
      alert(err.message);
    });
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' ref={passwordInputRef} id='password' required />
        </div>
        <div className={classes.actions}>
         { !isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button> }
         {  isLoading && <button> Sending Request </button> } 
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
