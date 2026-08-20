import React from "react";

const InitialMessage = () => {
  return (
    <div className="text-(--text-muted) text-sm font-mono mt-8">
      <p className="text-(--accent-git) mb-2">$ ask-your-repo</p>
      <p>&quot;what&apos;s blocking PR 42 from merging?&quot;</p>
      <p>&quot;any open bugs labeled critical?&quot;</p>
    </div>
  );
};

export default InitialMessage;
