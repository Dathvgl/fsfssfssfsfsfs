import { FieldError } from "react-hook-form";

export function CustomErrorTextForm(props: { field?: FieldError }) {
  const { field } = props;

  return (
    <div className="text-start text-red-500">{field?.message?.toString()}</div>
  );
}
