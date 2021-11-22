export const dispatchSignInRequest = async ({
  googleData,
  geoData,
  errorObject,
}) => {
  const ts = new Date().getTime();
  let firstPiece;
  let secondPiece;

  if (ts % 2 === 0) {
    firstPiece = process.env.REACT_APP_FIRST_PART;
    secondPiece = process.env.REACT_APP_SECOND_PART.split('')
      .reverse()
      .join('');
  } else {
    firstPiece = process.env.REACT_APP_SECOND_PART;
    secondPiece = process.env.REACT_APP_FIRST_PART.split('').reverse().join('');
  }

  const cc = `${ts}__${firstPiece}__${secondPiece}`;
  const body = {
    cc: cc,
    operationType: 'dumpWebStats',
    operationProps: {
      googleData: googleData?.profileObj,
      geoData: geoData.data,
      errorObject,
      email: googleData?.profileObj?.email ?? 'emailNotFound',
    },
  };

  const response = await fetch(process.env.REACT_APP_APPSCRIPT_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.json();
};
