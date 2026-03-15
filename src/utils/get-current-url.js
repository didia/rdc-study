export default function getCurrentUrl() {
  if (typeof window === 'undefined') {
    return '';
  }
  return `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;
}
