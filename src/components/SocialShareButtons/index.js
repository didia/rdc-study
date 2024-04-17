import React, { useEffect } from "react";
import {InlineReactionButtons} from 'sharethis-reactjs';
import {InlineShareButtons} from 'sharethis-reactjs';
import {StickyShareButtons} from 'sharethis-reactjs';
import {InlineFollowButtons} from 'sharethis-reactjs';
import getCanonicalLink from "../../Utils/canonical-link";
import config from "../../../config";

const SocialShareButtons = ({ title, subject, message, path, img}) => {
    const canonicalLink = getCanonicalLink(path)
    const {shareThisProperty} = config

    return (
        <div>
          <style dangerouslySetInnerHTML={{__html: `
            html, body {
              margin: 0;
              padding: 0;
            }
            h1 {
              font-size: 24px;
              font-weight: bold;
            }
            hr {
              margin-bottom: 40px;
              margin-top: 40px;
              width: 50%;
            }
          `}} />

          <StickyShareButtons
            config={{
              property: shareThisProperty,
              alignment: 'left',    
              color: 'social',      
              enabled: true,        
              font_size: 16,        
              hide_desktop: false,  
              labels: null,     
              language: 'fr',       
              min_count: 10,         // hide react counts less than min_count (INTEGER)
              networks: [           
                'whatsapp', 'facebook', 'twitter', 'email'
              ],
              padding: 12,          
              radius: 4,            
              show_total: false,     
              show_mobile: true,    
              show_toggle: false,    
              size: 48,             
              top: 160,             
              url: canonicalLink,
              image: img,
              description: message,
              title: title,        
              message: message,
              subject: subject,
              username: '@rdcetudes'
            }}
          />
   
        </div>
      );
}

export default SocialShareButtons;