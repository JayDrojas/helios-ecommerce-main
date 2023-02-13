import { Fragment } from 'react';

export default function WithLineBreaks({
  text
}: {
  text: string;
}): JSX.Element {
  const lines = text.split(`\n`);
  const output = lines.map((line, index) => {
    if (index === 0) return <Fragment key={index}>{line}</Fragment>;
    return (
      <Fragment key={index}>
        <br />
        {line}
      </Fragment>
    );
  });
  return <>{output}</>;
}
