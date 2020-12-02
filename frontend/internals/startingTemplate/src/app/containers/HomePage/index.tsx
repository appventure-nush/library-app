import React from 'react';
import { Helmet } from 'react-helmet-async';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="NUSH Library App homepage" />
      </Helmet>
      <span>HomePage container</span>
    </>
  );
}
