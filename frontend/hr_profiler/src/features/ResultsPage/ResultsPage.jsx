import React from 'react';
import classes from '../../stylesheets/styles/ResultsPage.module.scss';
import DataTable from '../../uiComponents/DataTable/DataTable';
import { useSelector, useDispatch } from 'react-redux';
import { resetTable } from '../../slices/slices/dataSlice';
const schema = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.25,
    hide: true,
  },
  {
    field: 'username_devpost',
    headerName: 'Username (DP)',
    flex: 1,
    hide: false,
  },
  {
    field: 'skills',
    headerName: 'Skills (DP)',
    flex: 1,
    hide: true,
  },
  {
    field: 'interests',
    headerName: 'Interests (DP)',
    flex: 1,
    hide: true,
  },

  {
    field: 'projectCount',
    headerName: 'Projects (DP)',
    flex: 1,
    hide: false,
  },
  {
    field: 'hackathonCount',
    headerName: 'Hacks (DP)',
    flex: 1,
    hide: false,
  },
  {
    field: 'achievementCount',
    headerName: 'Achievements (DP)',
    flex: 1,
    hide: false,
  },
  {
    field: 'followerCount',
    headerName: 'Followers (DP)',
    flex: 1,
    hide: false,
  },
  {
    field: 'followingCount',
    headerName: 'Following (DP)',
    flex: 1,
    hide: false,
  },
  {
    field: 'likesCount',
    headerName: 'Likes (DP)',
    flex: 1,
    hide: false,
  },

  {
    field: 'username_github',
    headerName: 'Username (GH)',
    flex: 1,
    hide: true,
  },
  {
    field: 'projectCount_github',
    headerName: 'Projects (GH)',
    flex: 1,
    hide: true,
  },
  {
    field: 'repositoryCount_github',
    headerName: 'Repositories (GH)',
    flex: 1,
    hide: true,
  },

  {
    field: 'packageCount_github',
    headerName: 'Packages (GH)',
    flex: 1,
    hide: true,
  },
  {
    field: 'followerCount_github',
    headerName: 'Followers (GH)',
    flex: 1,
    hide: true,
  },
  {
    field: 'followingCount_github',
    headerName: 'Following (GH)',
    flex: 1,
    hide: true,
  },

  {
    field: 'username_so',
    headerName: 'Username (SO)',
    flex: 1,
    hide: true,
  },
  {
    field: 'reputation_so',
    headerName: 'Reputations (SO)',
    flex: 1,
    hide: true,
  },
  {
    field: 'reach_so',
    headerName: 'Reach (SO)',
    flex: 1,
    hide: true,
  },
  {
    field: 'answers_so',
    headerName: 'Answers (SO)',
    flex: 1,
    hide: true,
  },

  {
    field: 'questions_so',
    headerName: 'Questions (SO)',
    flex: 1,
    hide: true,
  },
  {
    field: 'pc_so',
    headerName: 'Top (X%) Percentile (SO)',
    flex: 1,
    hide: true,
    valueFormatter: (params) =>
      isNaN(Math.floor(params.value))
        ? 'Not Applicable'
        : `${100 - Math.floor(params.value)}%`,
  },
  {
    field: 'weightedScore',
    headerName: 'Profile Score',
    flex: 1,
    hide: false,
    valueFormatter: (params) => Math.floor(params.value).toLocaleString(),
  },
];

export default function ResultsPage() {
  const { data } = useSelector((state) => state.scrappedData);
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <div
        style={{ height: '25rem', color: '#fff' }}
        className={classes.TableContainer}>
        <br />
        <DataTable
          columns={schema}
          rows={data.map((element) => ({ ...element, id: element.resume_id }))}
        />
        <button
          className={classes.GoBackButton}
          onClick={() => dispatch(resetTable())}>
          Go Back
        </button>
      </div>
    </React.Fragment>
  );
}
