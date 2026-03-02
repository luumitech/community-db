import { createAnimatedWizard } from '~/view/base/animated-wizard';

export { Footer } from './footer';
export { Header } from './header';
export { Step0 } from './step0';
export { Step1 } from './step1';
export { Step2 } from './step2';

export const Wizard = createAnimatedWizard();
export type WizardContext = ReturnType<typeof Wizard.useWizard>;
