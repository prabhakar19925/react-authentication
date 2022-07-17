import { useRef, useContext } from 'react';
import classes from './ProfileForm.module.css';
import { AuthContext } from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const history = useHistory();
 const AuthCtx = useContext(AuthContext);
  const newPasswordRef = useRef(); 
  const formHandler = (event) => {
    event.preventDefault(); 
    const newPassword = newPasswordRef.current.value;
    console.log(newPassword);
    // validation 
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyC4jgTd5ofJQM7wOkn4HoduuPKX0kCsMGg',{
      method: 'POST',
      body: JSON.stringify({password: newPassword, 
      idToken:AuthCtx.token,
      returnSecureToken: false
    }),
      headers: {'Content-Type': 'application/json'}
    })
    .then((data)=>{
          console.log(data);
          history.replace('/')
    })
    .catch((error) => {
      console.log(error);
    });
  }
  return (
    <form className={classes.form} onSubmit={formHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordRef} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
