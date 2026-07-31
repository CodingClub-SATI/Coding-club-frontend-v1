import Settings from './Settings';

// siteInfoLoader is shared with the root PublicLayout loader (router/index.jsx),
// so it stays defined in ../api.js and is just re-exported here.
export { siteInfoLoader as loader } from '../api';

export default Settings;
