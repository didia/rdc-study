import React from "react";
import AboutUs from "../components/Pages/AboutUs";
import { graphql, useStaticQuery } from "gatsby";
import { useEffect } from "react";

const AboutUsPage = ({ data }) => {
  const { members} = data;
  const teammMembers = members.edges.map((edge) => edge.node);
  return <AboutUs teammMembers={teammMembers} />;
};

export const members = graphql`
    query MyQuery {
      members: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/team/" } }
        sort: { frontmatter: { id: ASC } }
      ) {
        edges {
          node {
            id
            frontmatter {
              id
              name
              title
              about
              draft
              role
              image {
                childImageSharp {
                  gatsbyImageData(
                    width: 300
                    placeholder: BLURRED
                    formats: [AUTO, WEBP, AVIF]
                  )
                }
              }
            }
          }
        }
      }
    }
  `;

export default AboutUsPage;
