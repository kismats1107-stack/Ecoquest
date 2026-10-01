import { useSearchParams } from 'react-router';
import { AttemptHistory } from '@/components/plus/AttemptHistory';
import { QuizGenerator } from '@/components/quiz/QuizGenerator';
import { Card, SectionHeader } from '@/components/ui/Card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';

export default function PlusQuizzes() {
  const [params] = useSearchParams();
  const { progress } = useMode();
  useDocumentTitle('Quizzes');

  return (
    <div className="space-y-6">
      <SectionHeader as="h1" title="Quizzes" subtitle="What do you want to learn? Choose a topic, a level and a size — then generate a fresh challenge." />
      <QuizGenerator key={`${params.get('topic')}-${params.get('difficulty')}`} initialTopicId={params.get('topic')} initialDifficulty={params.get('difficulty')} />
      <Card id="history" className="scroll-mt-24 p-5 sm:p-6">
        <SectionHeader title="Previous attempts" subtitle={`${progress.attempts.length} quiz${progress.attempts.length === 1 ? '' : 'zes'} completed — open any attempt to review answers and explanations.`} />
        <AttemptHistory attempts={progress.attempts} />
      </Card>
    </div>
  );
}
