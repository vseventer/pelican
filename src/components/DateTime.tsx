const formatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function DateTime({ date }) {
  const formatted = formatter.format(new Date(date));

  return (
    <time className="text-gray-400 text-sm" dateTime={date}>
      {formatted}
    </time>
  );
}
