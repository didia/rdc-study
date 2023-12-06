import React from "react";
import { graphql } from "gatsby";
//import { useEffect } from "react";

export default function GuideTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  /*  useEffect(() => {
        console.log("Guide Page markdownRemark : ", markdownRemark);
    });
     */

  return (
    <div className="h-56">
      <h1>Etudier {frontmatter.title}</h1>
    </div>
  );
}

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "DD-MM-YYYY")
        slug
        title
      }
    }
  }
`;
