export default function isScrolledIntoView(el) {
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  const elemBottom = rect.bottom;

  return elemTop >= 0 && elemBottom <= window.innerHeight;
};