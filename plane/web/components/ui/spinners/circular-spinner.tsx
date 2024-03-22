import { FC } from "react";

export const Spinner: FC = () => (
  <div role="status">
    <span className="loading loading-spinner loading-xs"></span>
    <span className="sr-only">Loading...</span>
  </div>
);
