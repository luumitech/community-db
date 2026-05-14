import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { Modal } from '~/view/base/modal';
import { useLayoutContext } from '../../layout-context';
import { InputData, useHookForm } from './use-hook-form';
import {
  Footer,
  Header,
  Step0,
  Step1,
  Step2,
  Wizard,
  WizardContext,
} from './wizard';

interface Props {
  onSave: (input: InputData) => Promise<void>;
}

export const ModifyModal: React.FC<Props> = ({ onSave }) => {
  const router = useRouter();
  const { community } = useLayoutContext();
  const [pending, startTransition] = React.useTransition();
  const { formMethods } = useHookForm(community);
  const { formState, handleSubmit } = formMethods;
  const { isDirty, errors } = formState;

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          await onSave(input);
          goBack();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onSave, goBack]
  );

  const renderHeader = React.useCallback((context: WizardContext) => {
    return <Header context={context} />;
  }, []);

  const renderFooter = React.useCallback(
    // eslint-disable-next-line react/display-name
    (closeModal: () => void) => (context: WizardContext) => {
      return (
        <Footer
          context={context}
          isSubmitting={pending}
          closeModal={closeModal}
        />
      );
    },
    [pending]
  );

  return (
    <Modal
      size="cover"
      isOpen
      onOpenChange={goBack}
      confirmation={isDirty}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      renderWrapper={(children, clsNm) => {
        return (
          <FormProvider {...formMethods}>
            <Form className={clsNm} onSubmit={handleSubmit(onSubmit)}>
              {children}
            </Form>
          </FormProvider>
        );
      }}
    >
      <Modal.Content>
        {({ close }) => (
          <Wizard
            renderHeader={renderHeader}
            renderFooter={renderFooter(close)}
            renderBody={(body) => {
              return <Modal.Body>{body}</Modal.Body>;
            }}
          >
            <Step0 />
            <Step1 />
            <Step2 />
          </Wizard>
        )}
      </Modal.Content>
    </Modal>
  );
};
