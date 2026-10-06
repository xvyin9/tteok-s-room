import { dateParts } from "@/lib/dates";

const years = Array.from({ length: 46 }, (_, index) => 1990 + index);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const days = Array.from({ length: 31 }, (_, index) => index + 1);
const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 60 }, (_, index) => index);

export function DateFields({
  value,
  prefix = "",
  label = "日期和时间",
}: {
  value?: string | null;
  prefix?: string;
  label?: string;
}) {
  const parts = dateParts(value);
  return (
    <fieldset className="date-fields">
      <legend>{label}</legend>
      <Select name={`${prefix}year`} value={parts.year} options={years} suffix="年" />
      <Select name={`${prefix}month`} value={parts.month} options={months} suffix="月" />
      <Select name={`${prefix}day`} value={parts.day} options={days} suffix="日" />
      <Select name={`${prefix}hour`} value={parts.hour} options={hours} suffix="时" pad />
      <Select name={`${prefix}minute`} value={parts.minute} options={minutes} suffix="分" pad />
    </fieldset>
  );
}

function Select({
  name,
  value,
  options,
  suffix,
  pad = false,
}: {
  name: string;
  value: number;
  options: number[];
  suffix: string;
  pad?: boolean;
}) {
  return (
    <label className="text-xs">
      <select className="field" name={name} defaultValue={value}>
        {options.map((option) => (
          <option key={option} value={option}>
            {pad ? String(option).padStart(2, "0") : option}
            {suffix}
          </option>
        ))}
      </select>
    </label>
  );
}
