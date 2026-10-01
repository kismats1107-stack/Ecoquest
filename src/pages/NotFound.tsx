import { Link } from 'react-router';
import { Mascot } from '@/components/brand/Mascot';
import { buttonClasses } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-4 text-center">
      <div>
        <Mascot mood="oops" className="mx-auto size-32" />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">This trail doesn’t exist</h1>
        <p className="mt-2 text-slate-600">The page you’re looking for has wandered off into the forest.</p>
        <Link to="/" className={buttonClasses({ size: 'lg', className: 'mt-6' })}>
          Back to EcoQuest
        </Link>
      </div>
    </main>
  );
}
