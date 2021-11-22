import React from 'react';
import classes from './Slider.module.scss';

export default function RangeSlider(props) {
  const { title, valueProp, setValueProp } = props;
  const [value, setValue] = React.useState(Math.floor(Math.random() * 100));
  const updateValueProps = (event) => {
    if (setValueProp) {
      setValueProp(+event.target.value / 100);
    } else setValue(+event.target.value);
  };
  return (
    <div className={classes.RowDiv}>
      <label className={classes.RowLabel}>
        {`${title}`}{' '}
        <span style={{ fontWeight: 'bold' }}>({valueProp || value})</span>
      </label>
      <input
        type='range'
        min='0'
        max='100'
        value={`${valueProp || value}`}
        onChange={(e) => updateValueProps(e)}
        className={classes.RangeSlider}
      />
    </div>
  );
}
