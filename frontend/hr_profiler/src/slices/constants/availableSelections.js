import { nanoid } from 'nanoid';

export const zeroWeighted = {
  devpost: {
    pc: 0,
    hc: 0,
    ac: 0,
    fc: 0,
    flc: 0,
    lc: 0,
  },
  github: {
    pc: 0,
    rc: 0,
    pkc: 0,
    fc: 0,
    flc: 0,
  },
  so: {
    rc: 0,
    rch: 0,
    qc: 0,
    ac: 0,
    pc: 0,
  },
};

const rangeInitializer = {
  from: 0,
  to: 10,
};

export const weights = {
  devpost: {
    pc: 1,
    hc: 1,
    ac: 1,
    fc: 1,
    flc: 1,
    lc: 1,
  },
  github: {
    pc: 1,
    rc: 1,
    pkc: 1,
    fc: 1,
    flc: 1,
  },
  so: {
    rc: 1,
    rch: 1,
    qc: 1,
    ac: 1,
    pc: 1,
  },
};
export const profileSelections = [
  {
    displayName: 'Devpost',
    isActive: true,
    isEditable: true,
    displayKeyHint: 'devpost',
    id: nanoid(),
    value: {
      skills: [],
      interests: [],
      projectCounts: rangeInitializer,
      hackathonCounts: rangeInitializer,
      achievementCounts: rangeInitializer,
      followerCounts: rangeInitializer,
      followingCounts: rangeInitializer,
      likesCount: rangeInitializer,
    },
  },
  {
    displayName: 'Github',
    isActive: true,
    isEditable: true,
    displayKeyHint: 'github',
    id: nanoid(),
    value: {},
  },
  {
    displayName: 'Stack Overflow',
    isActive: true,
    isEditable: true,
    displayKeyHint: 'so',
    id: nanoid(),
    value: {},
  },
  {
    displayName: 'LinkedIn',
    isActive: false,
    isEditable: false,
    id: nanoid(),
    value: {},
  },
  {
    displayName: 'Codechef',
    isActive: false,
    isEditable: false,
    id: nanoid(),
    value: {},
  },
  {
    displayName: 'Hackerrank',
    isActive: false,
    isEditable: false,
    id: nanoid(),
    value: {},
  },
  {
    displayName: 'GrabCAD',
    isActive: false,
    isEditable: false,
    id: nanoid(),
    value: {},
  },
  {
    displayName: 'Canva',
    isActive: false,
    isEditable: false,
    id: nanoid(),
    value: {},
  },
];
