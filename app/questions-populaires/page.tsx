import {getFaqs} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import FaqsPage from '@/components/pages/FaqsPage';

export const metadata = generatePageMetadata({
  title: 'Questions populaires',
  description: 'Voici les réponses aux questions les plus souvent posées.',
  path: '/questions-populaires',
});

export default async function QuestionsPopulairesPage() {
  const questions = await getFaqs();
  return <FaqsPage questions={questions} />;
}
