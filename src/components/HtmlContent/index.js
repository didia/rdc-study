import React from 'react';

const HtmlContent = ({ htmlclassName, content }) => {
    return ( <div className={htmlclassName} dangerouslySetInnerHTML={{ __html: content }}></div> );
}
 
export default HtmlContent;
