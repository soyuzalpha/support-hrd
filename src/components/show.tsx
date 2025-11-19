import React from "react";

type ShowProps = {
  children: React.ReactNode;
};

type WhenProps = {
  isTrue: boolean;
  children: React.ReactNode;
};

type ElseProps = {
  render: () => React.ReactNode;
};

function Show({ children }: ShowProps) {
  return <>{children}</>;
}

function When({ isTrue, children }: WhenProps) {
  return isTrue ? <>{children}</> : null;
}

function Else({ render }: ElseProps) {
  return <>{render()}</>;
}

Show.When = When;
Show.Else = Else;

export default Show;
