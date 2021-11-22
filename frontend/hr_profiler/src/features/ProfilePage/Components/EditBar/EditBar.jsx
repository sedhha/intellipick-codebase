import React from 'react';
import classes from '../../../../stylesheets/nestedComponentStyles/ProfilePage/EditBar.module.scss';
import CreatableSelect from 'react-select/creatable';
import { updateTypes } from '../../../../slices/constants/configUpdateTypes';
import RangeSlider from '../../../../uiComponents/Sliders/Slider';
import { nanoid } from 'nanoid';
import { useSelector, useDispatch } from 'react-redux';
import { updateWeights } from '../../../../slices/slices/configurations';
const availableOptions = {
  DEVPOST: 'Devpost',
  GITHUB: 'Github',
  STACKOVERFLOW: 'Stack Overflow',
};
const components = {
  DropdownIndicator: null,
};

const sliderOptions = {
  devpost: [
    {
      label: 'Project Weightage',
      id: nanoid(),
      key: 'pc',
    },
    {
      label: 'Hackathon Weightage',
      id: nanoid(),
      key: 'hc',
    },
    {
      label: 'Achievements Weightage',
      id: nanoid(),
      key: 'ac',
    },
    {
      label: 'Followers Weightage',
      id: nanoid(),
      key: 'fc',
    },
    {
      label: 'Follwoing Weightage',
      id: nanoid(),
      key: 'flc',
    },
    {
      label: 'Likes Weightage',
      id: nanoid(),
      key: 'lc',
    },
  ],
  github: [
    {
      label: 'Project Weightage',
      id: nanoid(),
      key: 'pc',
    },
    {
      label: 'Repositories Weightage',
      id: nanoid(),
      key: 'rc',
    },
    {
      label: 'Packages Weightage',
      id: nanoid(),
      key: 'pkc',
    },
    {
      label: 'Followers Weightage',
      id: nanoid(),
      key: 'fc',
    },
    {
      label: 'Follwoing Weightage',
      id: nanoid(),
      key: 'flc',
    },
  ],
  so: [
    {
      label: 'Reputation Weightage',
      id: nanoid(),
      key: 'rc',
    },
    {
      label: 'Reach Weightage',
      id: nanoid(),
      key: 'rch',
    },
    {
      label: 'Question Weightage',
      id: nanoid(),
      key: 'qc',
    },
    {
      label: 'Answer Weightage',
      id: nanoid(),
      key: 'ac',
    },
    {
      label: 'Percentile Weightage',
      id: nanoid(),
      key: 'pc',
    },
  ],
};
export default function EditBar(props) {
  const weightValues = useSelector((state) => state.config).weights;
  const dispatch = useDispatch();
  const [devpostSkills, setDevpostSkills] = React.useState('');
  const [devpostInterests, setDevpostInterests] = React.useState('');
  const {
    component,
    closeEditHandler,
    onKeyPressHandler,
    value,
    goBackToProfilePage,
  } = props;
  let pComponent;
  let pCloseEditHandler;

  const onInputChangeHandler = (updatedValue, setFunction) => {
    setFunction(updatedValue);
  };

  const createOption = (label) => ({
    label,
    value: label,
  });

  const onChangeHandler = (value, actionMeta, identifier) => {
    if (onKeyPressHandler) {
      onKeyPressHandler({ value, actionMeta, identifier });
    } else {
      console.log('Value = ', value);
      console.log('actionMeta = ', actionMeta);
    }
  };

  const onKeyDownHandler = (
    event,
    identifier,
    setFunction,
    incomingValue,
    trueValues
  ) => {
    if (!incomingValue || incomingValue.length === 0) return;
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === ',') {
      if (onKeyPressHandler) {
        setFunction('');
        onKeyPressHandler({
          value: [...trueValues, createOption(incomingValue)],
          identifier,
        });
        event.preventDefault();
      } else {
        console.log('Key Pressed but done nothing');
      }
    }
  };

  if (component === undefined) pComponent = availableOptions.DEVPOST;
  else pComponent = component;

  if (closeEditHandler === undefined)
    pCloseEditHandler = () => {
      console.log('Unconfigured Function');
    };
  else pCloseEditHandler = closeEditHandler;

  let EditorComponent;
  switch (pComponent) {
    case availableOptions.DEVPOST: {
      EditorComponent = (
        <div
          className={[classes.DevpostComponent, classes.StyledScrollbar].join(
            ' '
          )}
          onClick={pCloseEditHandler}>
          <div className={classes.LabelField}>
            <label
              className={[classes.LabelField__label, classes.BlackFont].join(
                ' '
              )}>
              Preferred Skills
            </label>
            <CreatableSelect
              components={components}
              inputValue={devpostSkills || ''}
              isClearable
              isMulti
              menuIsOpen={false}
              onInputChange={(value) =>
                onInputChangeHandler(value, setDevpostSkills)
              }
              onChange={(value, actionMeta) =>
                onChangeHandler(
                  value,
                  actionMeta,
                  updateTypes.Devpost.UPDATE_SKILLS
                )
              }
              onKeyDown={(event) =>
                onKeyDownHandler(
                  event,
                  updateTypes.Devpost.UPDATE_SKILLS,
                  setDevpostSkills,
                  devpostSkills,
                  value.skills
                )
              }
              placeholder='Input Preferred Skills (If Any).'
              value={value.skills}
              className={classes.InputField_Text}
            />
          </div>
          <div className={classes.LabelField}>
            <label
              className={[classes.LabelField__label, classes.BlackFont].join(
                ' '
              )}>
              Preferred Interests
            </label>
            <CreatableSelect
              components={components}
              inputValue={devpostInterests || ''}
              isClearable
              isMulti
              menuIsOpen={false}
              onInputChange={(value) =>
                onInputChangeHandler(value, setDevpostInterests)
              }
              onChange={(value, actionMeta) =>
                onChangeHandler(
                  value,
                  actionMeta,
                  updateTypes.Devpost.UPDATE_INTERESTS
                )
              }
              onKeyDown={(event) =>
                onKeyDownHandler(
                  event,
                  updateTypes.Devpost.UPDATE_INTERESTS,
                  setDevpostInterests,
                  devpostInterests,
                  value.interests
                )
              }
              placeholder='Input Preferred Interests (If Any).'
              value={value.interests}
              className={classes.InputField_Text}
            />
          </div>
          <br />
          <label
            className={[classes.LabelField__label, classes.BlackFont].join(
              ' '
            )}>
            Mark the weightage of each metric. (Default is 100%)
          </label>
          <br />
          <div className={classes.Sliders}>
            {sliderOptions.devpost.map((slideE) => (
              <RangeSlider
                key={slideE.id}
                title={slideE.label}
                valueProp={Math.floor(100 * weightValues.devpost[slideE.key])}
                setValueProp={(value) =>
                  dispatch(
                    updateWeights({
                      primaryKey: 'devpost',
                      secondaryKey: slideE.key,
                      value: value,
                    })
                  )
                }
              />
            ))}
          </div>
        </div>
      );
      break;
    }
    case availableOptions.GITHUB: {
      EditorComponent = (
        <React.Fragment>
          <br />
          <label
            className={[classes.LabelField__label, classes.BlackFont].join(
              ' '
            )}>
            Mark the weightage of each metric. (Default is 100%)
          </label>
          <br />
          <div className={classes.Sliders}>
            {sliderOptions.github.map((slideE) => (
              <RangeSlider
                key={slideE.id}
                title={slideE.label}
                valueProp={Math.floor(100 * weightValues.github[slideE.key])}
                setValueProp={(value) => {
                  dispatch(
                    updateWeights({
                      primaryKey: 'github',
                      secondaryKey: slideE.key,
                      value: value,
                    })
                  );
                }}
              />
            ))}
          </div>
        </React.Fragment>
      );
      break;
    }
    case availableOptions.STACKOVERFLOW: {
      EditorComponent = (
        <React.Fragment>
          <br />
          <label
            className={[classes.LabelField__label, classes.BlackFont].join(
              ' '
            )}>
            Mark the weightage of each metric. (Default is 100%)
          </label>
          <br />
          <div className={classes.Sliders}>
            {sliderOptions.so.map((slideE) => (
              <RangeSlider
                key={slideE.id}
                title={slideE.label}
                valueProp={Math.floor(100 * weightValues.so[slideE.key])}
                setValueProp={(value) =>
                  dispatch(
                    updateWeights({
                      value,
                      primaryKey: 'so',
                      secondaryKey: slideE.key,
                    })
                  )
                }
              />
            ))}
          </div>
        </React.Fragment>
      );
      break;
    }

    default:
      EditorComponent = <div>Unconfigured Component</div>;
  }
  return (
    <div className={classes.EditBarSkeleton}>
      <h5
        className={[
          classes.WhiteHeading__small,
          classes.HeaderSpecificStyling,
        ].join(' ')}>
        Configure How you would want a profile to be Rated.
      </h5>
      {EditorComponent}
      <br />
      <button className={classes.ButtonsEdit} onClick={goBackToProfilePage}>
        Save Configuration
      </button>
    </div>
  );
}
