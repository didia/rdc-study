// Vendor
import React, {Component} from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

// Components
import ScholarshipPage from '../components/pages/ScholarshipPage';

const scholarshipFromMarkdownRemark = ({fields, html, frontmatter}) => ({
  content: html,
  ...frontmatter,
  ...fields,
  metaImage: frontmatter.thumbnail ? frontmatter.thumbnail.childImageSharp.metaImage : null,
  thumbnail: frontmatter.thumbnail ? {fluid: frontmatter.thumbnail.childImageSharp.contentImage} : null
});

const scholarshipPreviewFromMarkdownRemark = ({fields, frontmatter}) => ({
  ...frontmatter,
  ...fields,
  thumbnail: frontmatter.thumbnail.childImageSharp
});

export default class Template extends Component {
  state = {
    otherScholarships: []
  };

  componentDidMount() {
    const currentTimestamp = Date.now();
    const {allMarkdownRemark} = this.props.data;
    const otherScholarships = allMarkdownRemark.edges
      .filter(({node}) => node.fields.timestamp - currentTimestamp > 0)
      .map((edge) => scholarshipPreviewFromMarkdownRemark(edge.node));

    this.setState({
      otherScholarships
    });
  }

  render() {
    const {markdownRemark} = this.props.data;
    const scholarship = scholarshipFromMarkdownRemark(markdownRemark);
    return <ScholarshipPage scholarship={scholarship} otherScholarships={this.state.otherScholarships} />;
  }
}

Template.propTypes = {
  data: T.shape({
    allMarkdownRemark: T.object.isRequired,
    markdownRemark: T.object.isRequired
  })
};

export const pageQuery = graphql`
  query ScholarshipByPath($path: String!, $type: String!, $currentTimestamp: Float) {
    markdownRemark(fields: {path: {eq: $path}}) {
      html
      fields {
        path
      }
      frontmatter {
        deadline
        excerpt
        levels
        tags
        targetCountries
        thumbnailCredits
        title
        thumbnail {
          childImageSharp {
            contentImage: fluid(maxWidth: 1200, cropFocus: CENTER) {
              ...GatsbyImageSharpFluid
            }
            metaImage: fixed(width: 1200, height: 630, cropFocus: CENTER) {
              ...GatsbyImageSharpFixed_noBase64
            }
          }
        }
      }
    }
    allMarkdownRemark(
      limit: 12
      sort: {fields: [fields___timestamp], order: ASC}
      filter: {fields: {type: {eq: $type}, timestamp: {gt: $currentTimestamp}, path: {ne: $path}, draft: {eq: false}}}
    ) {
      ...ScholarshipListItemFragment
    }
  }
`;
