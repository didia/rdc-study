import React from "react";
import AboutUs from "../components/Pages/AboutUs";
import { graphql, useStaticQuery } from "gatsby";

const AboutUsPage = () => {
  const { members } = useStaticQuery(
    graphql`
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
    `
  );

  const teammMembers = members.edges.map((edge) => edge.node);
  return <AboutUs teammMembers={teammMembers} />;
};

export default AboutUsPage;
