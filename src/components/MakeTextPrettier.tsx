interface MakeTextPrettierInterface {
  text: string;
}

const MakeTextPrettier = (props: MakeTextPrettierInterface): JSX.Element => {
  const { text } = props;
  const res = text.match(/:/);
  if (
    res &&
    "index" in res &&
    typeof res.index === "number" &&
    res.index < 25
  ) {
    return (
      <>
        <span className="detailsTitle">{text.substring(0, res.index)}</span>
        {text.substring(res.index, text.length)}
      </>
    );
  }
  console.log(text);
  return <>{text}</>;
};

export default MakeTextPrettier