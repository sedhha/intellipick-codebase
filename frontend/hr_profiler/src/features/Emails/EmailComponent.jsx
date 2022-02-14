import React from 'react';
import classes from './EmailComponent.module.scss';
import { base_uri } from '../../app/backend';
import Spinner from '../../uiComponents/spinner/Spinner';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const Columns = [
  {
    field: 'fileName',
    headerName: 'File Name',
    flex: 0.25,
  },
  {
    field: 'email',
    headerName: 'Emails Found',
    flex: 0.25,
  },
];
export default function EmailComponent() {
  const [errorMessage, setErrorMessage] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [fileNames, setFileNames] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const fileInputref = React.useRef();

  const fileUploadHandler = (event) => {
    const fileListElements = [];
    const fileNames = [];
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].size > 5000000) {
        setErrorMessage('File Size too Big');
        break;
      } else if (event.target.files[i].type !== 'application/pdf') {
        setErrorMessage('Only PDF Files allowed!');
        break;
      }
      setErrorMessage('');
      fileListElements.push(event.target.files[i]);
      fileNames.push(event.target.files[i].name);
    }
    setFiles(fileListElements);
    setFileNames(fileNames);
  };

  const handleFileUpload = async () => {
    if (loading) {
      alert('Please wait for existing process to finish');
    }
    setLoading(true);
    try {
      const promises = files.map((element, index) => {
        const fd = new FormData();
        fd.append('emailPdf', element, element.name);
        return fetch(`${base_uri}email_upload`, {
          method: 'POST',
          body: fd,
        }).then((response) =>
          response.json().then((data) => ({ id: index, ...data }))
        );
      });
      const data = await Promise.all(promises);
      setLoading(false);
      setData(data);
    } catch (error) {
      setErrorMessage('Failed to Fetch from API');
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <div
        className={[
          classes.FullPageOccupier,
          classes.FlexCenter_Column,
          classes.BlueBackground,
          classes.Padded,
        ].join(' ')}>
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <h1>Upload all Email Files</h1>
            <input
              type='file'
              multiple
              onChange={fileUploadHandler}
              ref={fileInputref}
              style={{ display: 'none' }}
              accept='application/pdf'
            />
            <button onClick={() => fileInputref.current.click()}>
              Upload Files
            </button>
            {errorMessage !== '' && (
              <label className={classes.ErrorLabel}>{errorMessage}</label>
            )}
            <br />
            {fileNames.length > 0 && (
              <label>
                <span style={{ fontWeight: 'bold' }}>Uploaded files:</span>{' '}
                {fileNames.join(', ')}
              </label>
            )}
            <br />
            <br />
            <button onClick={handleFileUpload}>Get Data</button>
            {data.length > 0 && (
              <div style={{ minHeight: '200px' }}>
                <DataGrid
                  columns={Columns}
                  rows={data}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  density={'compact'}
                  disableSelectionOnClick
                  pageSize={15}
                  rowsPerPageOptions={[15]}
                />
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}
