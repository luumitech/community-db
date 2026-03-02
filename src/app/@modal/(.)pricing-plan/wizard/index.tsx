import { createAnimatedWizard } from '~/view/base/animated-wizard';
import type {
  FreePlanConfirmationProps,
  FreePlanSuccessProps,
} from '../free-plan';
import type {
  PremiumPlanConfirmationProps,
  PremiumPlanSuccessProps,
} from '../premium-plan';
import type { SelectPlanProps } from '../select-plan';

interface Steps {
  selectPlan: SelectPlanProps;
  free: FreePlanConfirmationProps;
  freeSuccess: FreePlanSuccessProps;
  premium: PremiumPlanConfirmationProps;
  premiumSuccess: PremiumPlanSuccessProps;
}
export const Wizard = createAnimatedWizard<Steps>();
