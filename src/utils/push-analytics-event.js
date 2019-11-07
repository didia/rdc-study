export default function(eventData) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...eventData,
    event: 'web-analytics'
  });
}

export const pushCurrentBranch = () => {
  if (!window.CURRENT_BRANCH) return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({branch: window.CURRENT_BRANCH});
};
