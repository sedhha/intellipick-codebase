import { uipath_trigger_ui } from '../../app/backend';
import axios from 'axios';
// export const triggerUIPath = async ({ allResponses, weights }) => {
//   // const finalResponse = await fetch(`${base_uri}trigger_ui_path`, {
//   const finalResponse = await fetch(
//     `https://us-central1-intellipick-332608.cloudfunctions.net/triggerUIPath`,
//     {
//       method: 'POST',
//       body: JSON.stringify({ allResponses, weights }),
//       // headers: { 'Content-Type': 'application/json' },
//     }
//   );

//   return finalResponse.json();
// };

export const triggerUIPath = async ({ allResponses, weights }) => {
  const options = {
    url: uipath_trigger_ui,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: { allResponses, weights },
  };
  const finalResponse = await axios(options);

  return finalResponse.data;
};

// axios POST request
