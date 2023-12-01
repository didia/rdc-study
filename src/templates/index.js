import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import img1 from "../images/800x600_FE_WEB_equivalence 2.jpg"
import { Carousel } from "flowbite-react";
import { StaticImage } from "gatsby-plugin-image";

export default function Template({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const image = getImage(frontmatter.image);

  return (
    <div className="">
      <Carousel slide={false}>
        <div className="block max-w-[18rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
          <div className="relative overflow-hidden bg-cover bg-no-repeat">
            <StaticImage
              className="rounded-t-lg"
              alt="tour"
              placeholder="blurred"
              src="../images/flatten.jpg"
            />
          </div>
          <div className="p-6">
            <p className="text-base text-sky-600 font-extrabold">CANADA</p>
          </div>
        </div>

        <div className="block max-w-[18rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
          <div className="relative overflow-hidden bg-cover bg-no-repeat">
            <StaticImage
              className="rounded-t-lg"
              alt="tour"
              placeholder="blurred"
              src="../images/flatten.jpg"
            />
          </div>
          <div className="p-6">
            <p className="text-base text-sky-600 font-extrabold">CANADA</p>
          </div>
        </div>
      </Carousel>
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
        description
        image {
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
  }
`;
