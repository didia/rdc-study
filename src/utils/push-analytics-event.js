const pushAnalyticsEvent = (eventData) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventData.action || 'web-analytics', {
      event_category: eventData.category || undefined,
      event_label: eventData.label || undefined,
      ...eventData,
    });
  }
};

export default pushAnalyticsEvent;
