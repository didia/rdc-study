import React from 'react';

const GoogleMapFrame = () => {
  const iframe = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1989.2703009975457!2d15.320869490140899!3d-4.308975693407005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a340faacf8fc3%3A0x3e43933e97780a2e!2sAve%20De%20Tabora%2C%20Kinshasa%2C%20R%C3%A9publique%20d%C3%A9mocratique%20du%20Congo!5e0!3m2!1sfr!2sus!4v1699287448056!5m2!1sfr!2sus" 
                      width="100%" 
                      height="450" 
                      style="border:0;" 
                      allowfullscreen="" 
                      loading="lazy" 
                      referrerpolicy="no-referrer-when-downgrade">
                  </iframe>`;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: iframe }}
    />
  );
};

export default GoogleMapFrame;
