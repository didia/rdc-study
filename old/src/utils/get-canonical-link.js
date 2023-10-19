// Config
import config from '../../config';

export default function getCanonicalPath(path) {
  return `${config.siteURL}${path}/`;
}
