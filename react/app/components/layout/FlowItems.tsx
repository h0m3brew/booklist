import React from "react";
import cn from "classnames";

export default ({ className = "", tighter = false, tightest = false, children }) => (
  <div className={cn("flow-items", className, { tighter, tightest })}>
    <div>{children}</div>
  </div>
);
