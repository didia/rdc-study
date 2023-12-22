import React from "react";
import { graphql } from "gatsby";
import CountryGuide from "../components/Pages/Guide/Country";

const guideMarkdownRemark = ({ html, frontmatter }) => ({
  content: html,
  excerpt: frontmatter.excerpt,
  related: frontmatter.related,
  slug: frontmatter.slug,
  thumbnail: frontmatter.thumbnail
    ? frontmatter.thumbnail.childImageSharp
    : null,
  title: frontmatter.title,
  topic: frontmatter.topic,
  flag: frontmatter.flag,
});

const splitRelatedAndOthers = (guides, mainGuide) => {
  if (!mainGuide.related)
    return {
      relatedGuides: [],
      otherGuides: guides.filter((guide) => guide.topic === mainGuide.topic),
    };

  const relatedGuides = [];
  const otherGuides = [];

  guides.forEach((guide) => {
    if (mainGuide.related.indexOf(guide.slug) !== -1)
      return relatedGuides.push(guide);

    if (guide.topic !== mainGuide.topic) return;

    otherGuides.push(guide);
  });

  relatedGuides.sort(
    (guide1, guide2) =>
      mainGuide.related.indexOf(guide1.slug) -
      mainGuide.related.indexOf(guide2.slug)
  );

  return { relatedGuides, otherGuides };
};

export default function GuideTemplate({ data }) {
  const { markdownRemark, allMarkdownRemark } = data; // data.markdownRemark holds our post data
  const guide = guideMarkdownRemark(markdownRemark);
  const allGuides = allMarkdownRemark.edges.map((edge) =>
    guideMarkdownRemark(edge.node)
  );

  const { relatedGuides, otherGuides } = splitRelatedAndOthers(
    allGuides,
    guide
  );


  return (
      <CountryGuide guide={guide} relatedGuides={relatedGuides} otherGuides={otherGuides} />
  );
}

export const guideQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "DD-MM-YYYY")
        slug
        title
        excerpt
        flag {
          childImageSharp {
            gatsbyImageData(
              width: 110
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        related
        topic
        name
        thumbnail {
          childImageSharp {
            gatsbyImageData(
              width: 200
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }

    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/guides/" } }) {
      edges {
        node {
          frontmatter {
            excerpt
            slug
            title
            topic
            thumbnail {
              childImageSharp {
                gatsbyImageData(
                  width: 350
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
