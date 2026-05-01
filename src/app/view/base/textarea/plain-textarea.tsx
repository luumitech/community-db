import {
  Textarea as NextUITextarea,
  TextAreaProps as NextUITextareaProps,
} from '@heroui/input';
import React from 'react';

export interface PlainTextareaProps extends NextUITextareaProps {}

export const PlainTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PlainTextareaProps
>(({ ...props }, ref) => {
  return <NextUITextarea ref={ref} {...props} />;
});

PlainTextarea.displayName = 'PlainTextarea';
