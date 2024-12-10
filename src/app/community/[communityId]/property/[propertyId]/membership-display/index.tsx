import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Textarea,
} from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { ModalButton } from '../modal-button';
import { usePageContext } from '../page-context';
import { MemberStatusChip } from './member-status-chip';
import { NotesView } from './notes-view';
import { QuickEventEditor } from './quick-event-editor';
import { RegisteredEventList } from './registered-event-list';
import { YearSelect } from './year-select';

const MembershipDisplayFragment = graphql(/* GraphQL */ `
  fragment PropertyId_MembershipDisplay on Property {
    notes
    membershipList {
      year
      isMember
      eventAttendedList {
        eventName
      }
    }
  }
`);

interface Props {
  className?: string;
}

export const MembershipDisplay: React.FC<Props> = ({ className }) => {
  const { canEdit, communityUi, minYear, maxYear } = useAppContext();
  const { property, membershipEditor } = usePageContext();
  const entry = getFragment(MembershipDisplayFragment, property);
  const { yearSelected } = communityUi;
  const { membershipList } = entry;

  const membership = React.useMemo(() => {
    const matched = membershipList.find(
      ({ year }) => yearSelected === year.toString()
    );
    if (matched) {
      return matched;
    }
    // Return an empty membership entry, if it's not in database
    return {
      year: parseInt(yearSelected, 10),
    } as GQL.Membership;
  }, [membershipList, yearSelected]);

  return (
    <div className={className}>
      <Card>
        <CardHeader className="gap-2">
          <YearSelect
            yearRange={[minYear, maxYear]}
            membershipList={entry.membershipList}
            selectedYear={yearSelected}
            onYearChange={communityUi.actions.setYearSelected}
          />
          <div className="grow" />
          <MemberStatusChip membership={membership} />
        </CardHeader>
        <CardBody className="gap-2">
          <RegisteredEventList membership={membership} />
          <Divider />
          <QuickEventEditor />
          <Divider />
          <NotesView notes={entry.notes} />
        </CardBody>
        {canEdit && (
          <CardFooter>
            <ModalButton {...membershipEditor.disclosure.getButtonProps()}>
              Edit Membership Info
            </ModalButton>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
