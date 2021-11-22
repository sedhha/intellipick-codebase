import React from 'react';
import classes from '../../stylesheets/styles/ProfilePage.module.scss';
import { userInfo, logoutUser } from '../../slices/slices/userInfoSlice';
import {
  configData,
  updateSelection,
  updateEditMode,
  updateDevpostVariables,
} from '../../slices/slices/configurations';
import { useNavigate } from 'react-router-dom';
import {
  scrappedData,
  setLoadingStatus,
  // performOperationsViaSocket,
  dispatchUIPathAction,
} from '../../slices/slices/dataSlice';
import { base_uri } from '../../app/backend';
import Spinner from '../../uiComponents/spinner/Spinner';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { BiEdit } from 'react-icons/bi';
import EditBar from './Components/EditBar/EditBar';
import ResultsPage from '../ResultsPage/ResultsPage';
import UnAuthorized from '../UnAuthorizedPage/UnAuthorizedPage';
import { GoogleLogout } from 'react-google-login';
export default function ProfilePage() {
  const navigate = useNavigate();
  const popupAlert = useAlert();
  const user = useSelector(userInfo).userData;
  const isLoading = useSelector(userInfo).pending;
  // const { ws } = useSelector((state) => state.webSocket);
  const { weights } = useSelector((state) => state.config);
  const isUserAuthenticated = useSelector(userInfo).isAuthenticated;
  const scData = useSelector(scrappedData);
  const isDataFetchLoading = scData.isLoading;
  const dataFetched = scData.dataFetched;
  const { givenName, imageUrl } = user;
  const dispatch = useDispatch();
  const config = useSelector(configData);
  const { showEditBar } = config;
  const fileInputref = React.useRef();
  const [files, setFiles] = React.useState({
    filesList: [],
    isValid: false,
    isTouched: false,
    errorMessage: '',
  });

  // React.useEffect(() => {
  //   onmeaage();
  // });
  // const onmeaage = () => {
  //   ws.onmessage = (event) => {
  //     const response = JSON.parse(event.data);
  //     dispatch(
  //       performOperationsViaSocket({
  //         response,
  //         alertPopupFunction: showFailedMessage,
  //       })
  //     );
  //   };
  // };

  const updateEditHandler = (close = false, index = 0) => {
    dispatch(updateEditMode({ value: close, modeIndex: index }));
  };

  const showFailedMessage = (msg) => {
    popupAlert.error(msg);
  };

  const onKeyPressHandler = (newValue, index) => {
    const { value, actionMeta, identifier } = newValue;
    if (actionMeta) console.log('Action Meta = ', actionMeta);
    dispatch(
      updateDevpostVariables({
        index: index,
        updateType: identifier,
        value: value,
      })
    );
  };

  const goBackToProfilePage = () => {
    updateEditHandler(false, 0);
  };

  const fileUploadHandler = (event) => {
    let allValid = true;
    let errorMessage = '';
    const fileListElements = [];
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].size > 5000000) {
        errorMessage = 'File size must be less than 5MB';
        allValid = false;
        break;
      } else if (event.target.files[i].type !== 'application/pdf') {
        errorMessage = 'Only PDF files supported at the moment.';
        allValid = false;
        break;
      }
      fileListElements.push(event.target.files[i]);
    }
    setFiles({
      filesList: fileListElements,
      isValid: allValid,
      isTouched: true,
      errorMessage: errorMessage,
    });
  };
  const logoutSuccess = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleFileUpload = () => {
    const fd = new FormData();
    const promises = [];
    dispatch(setLoadingStatus(true));
    for (let i = 0; i < files.filesList.length; i++) {
      fd.append('resumePdf', files.filesList[i], files.filesList[i].name);
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(`${base_uri}file_upload`, {
              method: 'POST',
              body: fd,
            });
            resolve(response.json());
          } catch (err) {
            reject('Caused Error = ', err);
          }
        })
      );
    }
    const allResponses = [];

    Promise.all(promises).then(async (res) => {
      for (let i = 0; i < res.length; i++) {
        allResponses.push(...res[i]);
      }
      // console.log('All Response = ', { allResponses, weights });
      // const finalResponse = await fetch(
      //   'https://us-central1-intellipick-332608.cloudfunctions.net/triggerUIPath',
      //   {
      //     method: 'POST',
      //     mode: 'no-cors',
      //     body: JSON.stringify({ allResponses, weights }),
      //   }
      // );
      // console.log('Final Response = ', await finalResponse.text());
      // const result = await finalResponse.json();
      dispatch(
        dispatchUIPathAction({
          allResponses,
          weights,
          alertPopupFunction: showFailedMessage,
        })
      );
      // ws.send(JSON.stringify({ allResponses, weights }));
    });
  };

  return (
    <div
      className={[classes.FullPageOccupier, classes.BlueBackground].join(' ')}>
      {(isLoading || isDataFetchLoading) && (
        <Spinner customMessgae={'This process might take minutes...'} />
      )}
      <div className={classes.ProfileDetails}>
        <div className={classes.ProfileTag}>
          <img
            src={imageUrl || process.env.PUBLIC_URL + '/avatar.png'}
            alt='profile'
            className={classes.ProfileTag_Img}
          />
          <p className={classes.ProfileTag_Greet}>{`Welcome ${
            givenName || 'Guest'
          }!`}</p>
          {isUserAuthenticated && (
            <GoogleLogout
              clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
              buttonText='Sign Out'
              onLogoutSuccess={logoutSuccess}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
              className={classes.LogoutButton}
            />
          )}
        </div>
      </div>
      <div className={classes.RowComponent}>
        <img
          src={process.env.PUBLIC_URL + '/graphics/logo.png'}
          alt={'logo'}
          className={classes.faviconProfile}
        />
        <h1
          className={[classes.WhiteHeading__small, classes.MoveByLeft].join(
            ' '
          )}>
          Intelli Pick
        </h1>
      </div>
      {isUserAuthenticated ? (
        <React.Fragment>
          {dataFetched ? (
            <ResultsPage />
          ) : (
            <div className={classes.ProcessingComponent}>
              <p className={classes.DescriptionPara}>
                Select the Social Sites you're interested to get data from.
              </p>
              <br />
              {showEditBar.show ? (
                <EditBar
                  component={
                    config.profileSelections[showEditBar.index].displayName
                  }
                  closeEditHandler={updateEditHandler}
                  onKeyPressHandler={(value) =>
                    onKeyPressHandler(value, showEditBar.index)
                  }
                  value={config.profileSelections[showEditBar.index].value}
                  goBackToProfilePage={goBackToProfilePage}
                />
              ) : (
                <div className={classes.ProcessingComponent_Grid}>
                  {config.profileSelections.map((profile, index) => (
                    <div
                      key={profile.id}
                      className={[
                        classes.SocialElements,
                        profile.isEditable
                          ? profile.isActive
                            ? classes.SocialElements__active
                            : null
                          : classes.SocialElements__notAllowed,
                      ].join(' ')}>
                      <p
                        className={[
                          classes.NoMarginParas,
                          classes.HoveringParas,
                        ].join(' ')}
                        onClick={() => {
                          if (profile.isEditable) {
                            const newValue = !profile.isActive;
                            dispatch(updateSelection({ index, newValue }));
                          }
                        }}>
                        {profile.displayName}
                      </p>
                      <BiEdit
                        className={classes.EditIcon}
                        onClick={() => {
                          updateEditHandler(true, index);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {!showEditBar.show && !dataFetched ? (
            <div>
              <button
                className={classes.PageButtons}
                //data-tooltip='Upload all the Resumes you want the scrapping to go through'
                onClick={() => fileInputref.current.click()}>
                Choose Files
              </button>
              <label className={classes.DescriptionPara_lessLeft}>
                Upload all the Resumes you want the scrapping to go through.
              </label>
            </div>
          ) : null}
          {!dataFetched ? (
            <React.Fragment>
              <br />
              <input
                type='file'
                multiple
                onChange={fileUploadHandler}
                ref={fileInputref}
                style={{ display: 'none' }}
                accept='application/pdf'
              />
              <div>
                {!showEditBar.show && (
                  <button
                    disabled={!files.isValid || !files.isTouched}
                    onClick={handleFileUpload}
                    className={
                      files.isValid && files.isTouched
                        ? classes.PageButtons
                        : [classes.PageButtons, classes.DisabledButton].join(
                            ' '
                          )
                    }>
                    Upload
                  </button>
                )}
                {files.isTouched && !files.isValid && (
                  <label className={classes.WarningLabel}>
                    {files.errorMessage}
                  </label>
                )}
              </div>
            </React.Fragment>
          ) : null}
        </React.Fragment>
      ) : (
        <UnAuthorized />
      )}
    </div>
  );
}
