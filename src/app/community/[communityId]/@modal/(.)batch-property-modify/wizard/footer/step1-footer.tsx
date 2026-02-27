import React from 'react';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import { type WizardContext } from '..';
import { useHookFormContext } from '../../use-hook-form';
import { FooterDefault } from './footer-default';

interface Props {
  context: WizardContext;
}

export const Step1Footer: React.FC<Props> = ({ context }) => {
  const { watch } = useHookFormContext();
  const method = watch('method');
  const memberYearList = watch('filter.memberYearList');

  const nextDisabled = React.useMemo(() => {
    switch (method) {
      case GQL.BatchModifyMethod.AddEvent:
        return R.isEmpty(memberYearList?.toString());

      case GQL.BatchModifyMethod.AddGps:
        return false;

      default:
        throw new Error('Unsupported method');
    }
  }, [memberYearList, method]);

  return <FooterDefault context={context} nextDisabled={nextDisabled} />;
};
