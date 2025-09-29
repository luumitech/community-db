import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Divider,
  cn,
} from '@heroui/react';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { Input } from '~/view/base/input';
import { ContactInfoEditor } from './contact-info-editor';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  controlNamePrefix: `occupantList.${number}`;
  onRemove: () => void;
}

export const ContactEditor: React.FC<Props> = ({
  className,
  controlNamePrefix,
  onRemove,
}) => {
  const { control, register } = useHookFormContext();
  const infoMethods = useFieldArray({
    control,
    name: `${controlNamePrefix}.infoList`,
  });

  return (
    <Card>
      <CardBody className="gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2" role="rowgroup">
          <Input
            className="sm:col-span-3"
            controlName={`${controlNamePrefix}.firstName`}
            role="cell"
            label="First Name"
            variant="underlined"
          />
          <Input
            className="sm:col-span-3"
            controlName={`${controlNamePrefix}.lastName`}
            role="cell"
            label="Last Name"
            variant="underlined"
          />
          <Checkbox
            size="md"
            className="sm:col-span-2"
            {...register(`${controlNamePrefix}.optOut`)}
          >
            <span className="text-sm text-default-600">
              Opt out to receive email
            </span>
          </Checkbox>
        </div>
        <Divider />
        {infoMethods.fields.map((field, idx) => (
          <ContactInfoEditor
            key={`${controlNamePrefix}-${field.id}`}
            controlNamePrefix={`${controlNamePrefix}.infoList.${idx}`}
            onRemove={() => infoMethods.remove(idx)}
          />
        ))}
        <Button
          className="self-start"
          startContent={<Icon icon="add" />}
          variant="flat"
          onPress={() =>
            infoMethods.append({
              type: GQL.ContactInfoType.Email,
              label: '',
              value: '',
            })
          }
        >
          Add email, phone, or others
        </Button>
      </CardBody>
      <CardFooter className="justify-end">
        <Button
          endContent={<Icon icon="trash" />}
          color="danger"
          onPress={onRemove}
        >
          Delete Contact
        </Button>
      </CardFooter>
    </Card>
  );
};
