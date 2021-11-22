import React from 'react';
import classes from '../../stylesheets/helpers/Spinner.module.scss';

export default function Spinner(props) {
  const { customMessgae } = props;
  return (
    <div className={classes.loaderContainer}>
      <label className={classes.LoadingInstructions}>
        {customMessgae || 'Please wait while we load the page...'}
      </label>
      <div className={classes.loader}>Loading...</div>
    </div>
  );
}
