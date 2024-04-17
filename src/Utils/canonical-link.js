import config from "../../config";

export default function getCanonicalLink(path) {
    return `${config.siteURL}/${path}`;
  }