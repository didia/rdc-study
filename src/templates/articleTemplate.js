import React from "react";
import { graphql } from "gatsby";
import _ from "lodash";
//import { useEffect } from "react";

export default function ArticleTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  /*  useEffect(() => {
        console.log("Guide Page markdownRemark : ", markdownRemark);
    });
     */

  return (
    <div className="h-56">
      <h1>Article : {frontmatter.title}</h1>
    </div>
  );
}

export const articleQuery = graphql`
  query articleQuery($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
        excerpt
        tags
        date
      }
    }
  }
`;
