import React from 'react';
import { Footer } from '~/view/footer';
import { GettingStarted } from '~/view/landing/getting-started';
import { Hero } from '~/view/landing/hero';

export default function App() {
  return (
    <>
      <Hero />
      <GettingStarted />
      <Footer />
    </>
  );
}
