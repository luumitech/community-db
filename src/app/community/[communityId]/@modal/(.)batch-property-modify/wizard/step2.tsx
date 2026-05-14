import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Modal } from '~/view/base/modal';
import { GpsInputEditor } from '../gps-input-editor';
import { MembershipInfoEditor } from '../membership-info-editor';
import { useHookFormContext } from '../use-hook-form';

interface Step2Props {}

export const Step2: React.FC<Step2Props> = (props) => {
  const { watch } = useHookFormContext();
  const method = watch('method');

  switch (method) {
    case GQL.BatchModifyMethod.AddEvent:
      return <MembershipInfoEditor />;

    case GQL.BatchModifyMethod.AddGps:
      return <GpsInputEditor />;

    default:
      throw new Error('Unsupported method');
  }
};
