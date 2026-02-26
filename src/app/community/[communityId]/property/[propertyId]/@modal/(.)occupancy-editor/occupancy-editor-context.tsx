import React from 'react';
import { type Control } from 'react-hook-form';
import * as GQL from '~/graphql/generated/graphql';
import {
  useFieldArray,
  type InputData,
  type OccupancyInfoListFieldArray,
  type OccupantEntry,
} from './use-hook-form';

type ContextT = Readonly<{
  /** OccupancyInfoList react-hook-form field array methods */
  occupancyInfoListMethods: OccupancyInfoListFieldArray;
  /** The email to focus the component on first render */
  focusEmail?: string;
  /** Currently selected occupancy field ID */
  occupancyFieldId: string;
  /** Change the currently selected occupancy field ID */
  setOccupancyFieldId: (fieldId: string) => void;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  control: Control<InputData>;
  /**
   * If provided, select the household that contains the email when the
   * component first renders
   */
  focusEmail?: string;
}

export function OccupancyEditorProvider({
  control,
  focusEmail,
  ...props
}: React.PropsWithChildren<Props>) {
  const occupancyInfoListMethods = useFieldArray({
    control,
    name: 'occupancyInfoList',
  });
  const { fields } = occupancyInfoListMethods;

  /** Find the household that has the email specified in `focusEmail` */
  const defaultOccupancyFieldId = React.useMemo(() => {
    const found = fields.find(({ occupantList }) =>
      findOccupant(occupantList, focusEmail)
    );
    // Revert to first items in array by default
    return found?.id ?? fields[0].id;
  }, [fields, focusEmail]);

  const [occupancyFieldId, setOccupancyFieldId] = React.useState(
    defaultOccupancyFieldId
  );

  return (
    <Context.Provider
      value={{
        occupancyInfoListMethods,
        focusEmail,
        occupancyFieldId,
        setOccupancyFieldId,
      }}
      {...props}
    />
  );
}

export function useOccupancyEditorContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      `useOccupancyEditorContext must be used within a OccupancyEditorProvider`
    );
  }
  return context;
}

/**
 * Helper utility for finding an occupant entry given an email address
 *
 * @param occupantList Occupant list
 * @param email Email to find
 * @returns Undefined if not found
 */
export function findOccupant<T extends OccupantEntry = OccupantEntry>(
  occupantList: T[],
  email?: string
) {
  if (!email) {
    return undefined;
  }
  return occupantList.find(({ infoList }) =>
    infoList.find(
      ({ type, value }) => type === GQL.ContactInfoType.Email && value === email
    )
  );
}
