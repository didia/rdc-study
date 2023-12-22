import React from 'react';
import "./styles.modules.scss";

const HtmlContent = ({ htmlclassName, content }) => {
    return (
      <div
        className={`scoped ${htmlclassName}`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    );
}
 
export default HtmlContent;
