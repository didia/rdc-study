const pushAnalyticsEvent = ({action, category, label, value, ...rest} = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action || 'web-analytics', {
      event_category: category || undefined,
      event_label: label || undefined,
      value: value || undefined,
      ...rest
    });
  }
};

export default pushAnalyticsEvent;
