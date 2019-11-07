// Config
import config from '../../config';

const {branch} = config;

export default function(eventData) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...eventData,
    event: 'web-analytics'
  });
}

export const pushCurrentBranch = () => {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({branch});
};
