import { Button, Link } from '@nextui-org/react';
import React from 'react';

export default function App() {
  return (
    <div>
      <p>Landing page content</p>
      <Button as={Link} color="primary" href="/community">
        Landing page
      </Button>
    </div>
  );
}
