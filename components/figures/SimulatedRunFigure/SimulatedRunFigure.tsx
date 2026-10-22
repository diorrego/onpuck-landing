import Figure from '@/components/figures/Figure';
import SimulatedRunPanel from '@/components/figures/SimulatedRunPanel';
import { exp04Arms } from '@/content/experiments';
import { simulatedRun } from '@/content/paper';

/** Fig. 3: the scene replays the exp-04 registered prediction. Copy is passed down, not imported. */
export default function SimulatedRunFigure() {
  return (
    <Figure id="simulated-run" bodyClassName="">
      <SimulatedRunPanel
        copy={{ ...simulatedRun, sceneLabel: 'Illustration of a simulated run replaying the exp-04 prediction' }}
        arms={{
          control: { label: exp04Arms.control.label, firstActionWriting: exp04Arms.control.firstActionWriting },
          test: { label: exp04Arms.test.label, firstActionWriting: exp04Arms.test.firstActionWriting },
        }}
      />
    </Figure>
  );
}
