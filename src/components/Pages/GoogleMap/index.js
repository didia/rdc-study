import React from 'react';

const GoogleMapFrame = () => {
  const iframe = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.575092011092!2d15.30922867591829!3d-4.302378595671583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3355b74e3b41%3A0xd2689d732da1242b!2sRDC%20Etudes!5e0!3m2!1sfr!2scd!4v1711646802084!5m2!1sfr!2scd" 
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
