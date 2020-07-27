// Vendor
import React from 'react';
import T from 'prop-types';
import HtmlContent from '../../HtmlContent';

import GenericPage from '../GenericPage';

const page = {
  description: 'Voici les réponses aux questions les plus souvent posées.',
  title: 'Questions populaires',
  path: '/questions-populaires'
};

const QuestionEntry = ({entry: {question, answer}}) => (
  <>
    <dt>{question}</dt>
    <dd>
      <HtmlContent content={answer} />
    </dd>
  </>
);

QuestionEntry.propTypes = {
  entry: T.shape({
    question: T.string.isRequired,
    answer: T.string.isRequired
  })
};

const FaqsPage = ({questions}) => {
  return (
    <GenericPage page={page}>
      <dl>
        {questions.map((question, index) => (
          <QuestionEntry key={`question-${index}`} entry={question} />
        ))}
      </dl>
    </GenericPage>
  );
};

FaqsPage.propTypes = {
  questions: T.arrayOf(T.object)
};

export default FaqsPage;
