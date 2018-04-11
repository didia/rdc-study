export default function(eventData) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...eventData,
    event: 'web-analytics'
  });
}
