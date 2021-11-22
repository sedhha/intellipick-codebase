import React from 'react';
import classes from '../../stylesheets/styles/UnAuthorized.module.scss';
import { useNavigate } from 'react-router-dom';

export default function UnAuthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className={classes.ContainerClass}>
      <label className={classes.Label}>
        401: Unauthorized Access: direct routing is not supported at the moment.
        You may want to go to{' '}
        <span className={classes.hyperlinkText} onClick={() => navigate('/')}>
          HomePage
        </span>
        .
      </label>
    </div>
  );
}
