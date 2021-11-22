import React from 'react';
import classes from '../../stylesheets/styles/HomePage.module.scss';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div
      className={[
        classes.FullPageOccupier,
        classes.FlexCenter_Column,
        classes.BlueBackground,
      ].join(' ')}>
      <h1 className={classes.WhiteHeading}>Intelli Pick</h1>
      <h4 className={classes.WhiteHeading__small}>
        The Page you're looking for isn't available.
      </h4>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}
