import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
} from '@nextui-org/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { Input } from '~/view/base/input';
import { OccupantFieldArrayReturn, useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  fieldArrayMethods: OccupantFieldArrayReturn;
}

export const Editor: React.FC<Props> = ({ className, fieldArrayMethods }) => {
  const { register } = useHookFormContext();
  const { fields, remove } = fieldArrayMethods;

  return (
    <div className={className} role="table" aria-label="Edit Member Details">
      {fields.map((field, idx) => (
        <Card key={field.id} className="mb-4">
          <CardHeader>#{idx + 1}</CardHeader>
          <CardBody>
            <div className="grid grid-cols-6 gap-2" role="rowgroup">
              <Input
                className="col-span-3"
                controlName={`occupantList.${idx}.firstName`}
                role="cell"
                label="First Name"
                variant="underlined"
              />
              <Input
                className="col-span-3"
                controlName={`occupantList.${idx}.lastName`}
                role="cell"
                label="Last Name"
                variant="underlined"
              />
              <Input
                className="col-span-4"
                controlName={`occupantList.${idx}.email`}
                role="cell"
                label="Email"
                variant="underlined"
              />
              <Checkbox
                size="md"
                className="col-span-2"
                {...register(`occupantList.${idx}.optOut`)}
              >
                <span className="text-sm text-default-600">
                  Opt out to receive email
                </span>
              </Checkbox>
              <Input
                className="col-span-2"
                role="cell"
                label="Cell"
                variant="underlined"
                controlName={`occupantList.${idx}.cell`}
              />
              <Input
                className="col-span-2"
                controlName={`occupantList.${idx}.work`}
                role="cell"
                label="Work"
                variant="underlined"
              />
              <Input
                className="col-span-2"
                controlName={`occupantList.${idx}.home`}
                role="cell"
                label="Home"
                variant="underlined"
              />
            </div>
          </CardBody>
          <CardFooter className="justify-end">
            <Button isIconOnly color="danger" onPress={() => remove(idx)}>
              <Icon icon="trash" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
