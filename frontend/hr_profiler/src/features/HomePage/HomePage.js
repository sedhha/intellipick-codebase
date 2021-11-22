import React from 'react';
import classes from '../../stylesheets/styles/HomePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import {
  updateGeoData,
  updateAuthenticated,
} from '../../slices/slices/userInfoSlice';
// import Spinner from '../../app/uiComponents/spinner/Spinner';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const isLoading = useSelector(userInfo).pending;
  const responseGoogle = (response) => {
    if (response.error === undefined) {
      dispatch(
        updateAuthenticated({
          googleData: response,
          errorObject: { isError: false },
        })
      );
      navigate('/profiles/' + response.googleId);
    } else {
      dispatch(
        updateAuthenticated({
          googleData: response,
          errorObject: { isError: true, errorMessage: response.error },
        })
      );
    }
  };
  React.useEffect(() => {
    const getGeoData = async () => {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      dispatch(updateGeoData({ data }));
    };
    getGeoData();
  }, [dispatch]);
  const [showDialogue, setShowDialogue] = React.useState(false);
  return (
    <div
      className={[
        classes.FullPageOccupier,
        classes.FlexCenter_Column,
        classes.BlueBackground,
      ].join(' ')}>
      <div className={classes.RowComponent}>
        <img
          src={process.env.PUBLIC_URL + '/graphics/logo.png'}
          alt={'logo'}
          className={classes.faviconProfile}
        />
        <h1 className={classes.WhiteHeading}>Intelli Pick</h1>
      </div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
        buttonText='Login With Google'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
      <div className={classes.CornerChatBot}>
        {showDialogue && (
          <div className={classes.ChatBoxConfig}>
            <div className={classes.ChatBoxConfig__HeaderBox}>
              <div className={classes.ChatBoxConfig__HeaderBox_header}>
                How can I resolve your query?
              </div>
              <button
                className={[classes.RoundButton, classes.BoldFontButton].join(
                  ' '
                )}
                onClick={() => setShowDialogue((prev) => !prev)}>
                X
              </button>
            </div>

            <iframe
              allow='microphone;'
              title={'FAQs'}
              src='https://console.dialogflow.com/api-client/demo/embedded/78855eb4-8879-421a-bd48-77411d9ac70b'
              style={{
                maxWidth: '400px',
                width: '19rem',
                height: '25rem',
                maxHeight: '500px',
                border: 'none',
              }}></iframe>
          </div>
        )}
        {!showDialogue && (
          <button
            onClick={() => setShowDialogue((prev) => !prev)}
            className={[classes.ButtonStyle].join(' ')}>
            Talk to Alex
          </button>
        )}
      </div>
    </div>
  );
}
