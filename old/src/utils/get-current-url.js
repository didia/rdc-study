export default function getCurrentUrl() {
  return `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;
}
