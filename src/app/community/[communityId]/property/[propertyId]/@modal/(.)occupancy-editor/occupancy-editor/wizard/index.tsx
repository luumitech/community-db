import { createAnimatedWizard } from '~/view/base/animated-wizard';
import type { Step0Props } from './step0';
import type { Step1Props } from './step1';

export { Footer } from './footer';
export { Header } from './header';
export { Step0 } from './step0';
export { Step1 } from './step1';

interface Steps {
  editor: Step0Props;
  manager: Step1Props;
}
export const Wizard = createAnimatedWizard<Steps>();
export type WizardContext = ReturnType<typeof Wizard.useWizard>;
