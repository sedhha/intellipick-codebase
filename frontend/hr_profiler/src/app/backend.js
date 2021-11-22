const debugGlobalEndpoint = false;

// const prodUri = 'iofksa.deta.dev';
const prodUri = 'intellipick.herokuapp.com';

const endpointDev =
  process.env.NODE_ENV !== 'production' && !debugGlobalEndpoint;

export const base_uri = endpointDev
  ? 'http://localhost:8000/'
  : `https://${prodUri}/`;

export const socket_uri = endpointDev
  ? 'ws://localhost:8000/'
  : `wss://${prodUri}:8000/`;

export const uipath_trigger_ui = endpointDev
  ? 'http://localhost:8000/trigger_ui_path'
  : 'https://us-central1-intellipick-332608.cloudfunctions.net/triggerUIPath/';
