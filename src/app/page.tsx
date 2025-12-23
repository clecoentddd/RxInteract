import { InteractionChecker } from '@/components/interaction-checker';
import { CompositionChecker } from '@/components/composition-checker';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="w-full max-w-4xl">
        <InteractionChecker />
      </div>
      <Separator className="w-full max-w-4xl" />
      <div className="w-full max-w-4xl">
        <CompositionChecker />
      </div>
    </div>
  );
}
