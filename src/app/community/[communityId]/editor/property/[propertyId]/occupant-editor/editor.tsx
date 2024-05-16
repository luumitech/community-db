import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
} from '@nextui-org/react';
import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { OccupantFieldArrayReturn, useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  fieldArrayMethods: OccupantFieldArrayReturn;
}

export const Editor: React.FC<Props> = ({ className, fieldArrayMethods }) => {
  const { register, formState } = useHookFormContext();
  const { errors } = formState;
  const { fields, remove } = fieldArrayMethods;

  return (
    <div className={className} role="table" aria-label="Edit Member Details">
      {fields.map((field, idx) => (
        <Card key={field.id} className="mb-4">
          <CardHeader>#{idx + 1}</CardHeader>
          <CardBody>
            <div className="grid grid-cols-6 gap-2" role="rowgroup">
              <Input
                role="cell"
                label="First Name"
                variant="underlined"
                className="col-span-3"
                errorMessage={errors.occupantList?.[idx]?.firstName?.message}
                isInvalid={!!errors.occupantList?.[idx]?.firstName?.message}
                {...register(`occupantList.${idx}.firstName`)}
              />
              <Input
                role="cell"
                label="Last Name"
                variant="underlined"
                className="col-span-3"
                errorMessage={errors.occupantList?.[idx]?.lastName?.message}
                isInvalid={!!errors.occupantList?.[idx]?.lastName?.message}
                {...register(`occupantList.${idx}.lastName`)}
              />
              <Input
                role="cell"
                label="Email"
                variant="underlined"
                className="col-span-5"
                errorMessage={errors.occupantList?.[idx]?.email?.message}
                isInvalid={!!errors.occupantList?.[idx]?.email?.message}
                {...register(`occupantList.${idx}.email`)}
              />
              <Checkbox
                size="md"
                className="col-span-1"
                {...register(`occupantList.${idx}.optOut`)}
              >
                Opt out
              </Checkbox>
              <Input
                role="cell"
                label="Cell"
                variant="underlined"
                className="col-span-2"
                errorMessage={errors.occupantList?.[idx]?.cell?.message}
                isInvalid={!!errors.occupantList?.[idx]?.cell?.message}
                {...register(`occupantList.${idx}.cell`)}
              />
              <Input
                role="cell"
                label="Work"
                variant="underlined"
                className="col-span-2"
                errorMessage={errors.occupantList?.[idx]?.work?.message}
                isInvalid={!!errors.occupantList?.[idx]?.work?.message}
                {...register(`occupantList.${idx}.work`)}
              />
              <Input
                role="cell"
                label="Home"
                variant="underlined"
                className="col-span-2"
                errorMessage={errors.occupantList?.[idx]?.home?.message}
                isInvalid={!!errors.occupantList?.[idx]?.home?.message}
                {...register(`occupantList.${idx}.home`)}
              />
            </div>
          </CardBody>
          <CardFooter className="justify-end">
            <Button isIconOnly color="danger" onPress={() => remove(idx)}>
              <FaTrashAlt />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
