import React from 'react';
import './styles/muiStyles.scss';
import classes from './styles/Datatable.module.scss';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={classes.ToolBarComponent}>
      <label className={classes.HeaderLabel}>
        Scrapping Results (DP: Devpost, GH: Github, SO: Stack Overflow)
      </label>
      <GridToolbarExport
        className={classes.ToolBarExport}
        style={{
          backgroundColor: '#fff',
          color: '#000',
          margin: '0.5rem',
        }}
      />
    </GridToolbarContainer>
  );
}

export default function DataTable(props) {
  const { columns, rows, density, pageSize } = props;
  return (
    <React.Fragment>
      <DataGrid
        columns={columns}
        rows={rows || []}
        components={{
          Toolbar: CustomToolbar,
        }}
        density={density || 'compact'}
        disableSelectionOnClick
        pageSize={pageSize || 15}
        rowsPerPageOptions={[pageSize || 15]}
      />
    </React.Fragment>
  );
}
