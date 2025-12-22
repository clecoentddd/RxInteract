import { InteractionChecker } from '@/components/interaction-checker';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <InteractionChecker />
      </div>
    </div>
  );
}
