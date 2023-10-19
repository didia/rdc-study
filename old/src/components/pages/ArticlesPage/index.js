// Vendor
import React from 'react';
import T from 'prop-types';

import GenericPage from '../GenericPage';
import ArticleList from '../../ArticleList';

const page = {
  description: 'Découvrez les derniers articles postés sur RDC-Etudes.',
  title: 'Articles récents',
  path: '/articles',
};

const ArticlesPage = ({articles}) => {
  return (
    <GenericPage page={page}>
      <ArticleList articles={articles} />
    </GenericPage>
  );
};

ArticlesPage.propTypes = {
  articles: T.arrayOf(T.object),
};

export default ArticlesPage;
