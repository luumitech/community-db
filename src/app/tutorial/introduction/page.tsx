import { Card, CardBody, CardHeader } from '@heroui/react';
import React from 'react';
import { GUIDE_ITEMS } from '../guide-menu/guide-items';

export default function Introduction() {
  const createCommunityItem = GUIDE_ITEMS.find(
    (item) => item.key === 'create-community'
  );

  return (
    <Card className="w-full">
      <CardHeader className="text-2xl font-extrabold">
        Welcome to the step-by-step guide
      </CardHeader>
      <CardBody className="gap-2">
        <p>
          Welcome to our tutorial guide for the community database! In this
          series of step-by-step tutorials, we&apos;ll walk you through various
          essential tasks to help you get the most out of your database. These
          tutorials are designed to provide clear and easy-to-follow
          instructions.
        </p>
        <p>
          For example, select &quot;{createCommunityItem?.label}&quot; and
          we&apos;ll show you how to create a new community from scratch. This
          is a foundational step that will enable you to customize the features
          to best suit your community&apos;s needs. By the end of this tutorial,
          you&apos;ll have a fully functional community database ready to store
          and manage your community&apos;s data.
        </p>
        <p>
          Let&apos;s get started and take the first step toward building a
          powerful and efficient system for your community!
        </p>
      </CardBody>
    </Card>
  );
}
