import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';

export function NotFoundPage() {
  const history = useHistory();

  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <div className="w-full flex flex-col items-center h-full justify-center">
        <div className="text-9xl text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-teal-600">
          404
        </div>
        <div className="text-2xl text-black dark:text-white">
          Oops, page not found.
        </div>
        <button
          type="button"
          className="bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          onClick={() => history.push(`/`)}
        >
          Return to Home Page
        </button>
      </div>
    </>
  );
}
