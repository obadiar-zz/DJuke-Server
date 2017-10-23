import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: 'BQAcaTn1VrdXaKL1iv4ndzfYUN7FXSbCpaMIAvgyJjIi5Ab_PV2t2BslBGJw6fQhDPjrem3KL6dMuB61Xz6xwWc6H5d9pHYeJ6LQHAd7_lrb3GBW6LVGWFi_I5Ax6cNEB98b_ziZQQOT7L-fAVpDrfuZDFs3GSiOEdey8ZYxf91QoF9nPMd3MLzW-7Y91DkK5O3mf56Xen0Zusz7O7kv8iwPoRhJ78bW95OYkxgntIl9bxgc44XJ3_nhRo9qc7rqgCk_08Ce1FaiOZR8DspJUOYE3CYH_wdPTFkWkcmTNpkR2vs2pM52_J1avcq1d3tmNgV19H4',
  confirm_status: false,
};

const copyState = (state) => {
  return Object.assign({}, state)
}

const spotifyReducer = (state = initialState, action) => {
  let newState = copyState(state);
  switch (action.type) {
    case types.SPOTIFY_MOUNT:
      newState.user = action.user;
      newState.playlist = action.playlist;
      return newState;
    case types.SPOTIFY_CONFIRM:
      newState.confirm_status = action.confirm_status;
      return newState;
    default:
      return state;
  }
};

export default spotifyReducer;
