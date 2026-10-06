import consultingImage from '../../assets/images/consulting-service.jpg';
import verificationImage from '../../assets/images/verification-service.jpg';
import freeGuideImage from '../../assets/images/free-guide.jpg';
import campusImage from '../../assets/images/background-image.jpg';

// Illustration of each service card, by service slug.
const SERVICE_IMAGES = {
  consultation: consultingImage.src,
  verification: verificationImage.src,
  'verification-et-lettre': verificationImage.src,
  information: freeGuideImage.src,
  assistance: campusImage.src
};

export default SERVICE_IMAGES;
