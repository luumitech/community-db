import { createAnimatedWizard } from '~/view/base/animated-wizard';

export const Wizard = createAnimatedWizard();
export type WizardContext = ReturnType<typeof Wizard.useWizard>;
