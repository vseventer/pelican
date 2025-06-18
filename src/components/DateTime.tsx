const formatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function DateTime({ time, ...delegated }: { time: string }) {
  const date = new Date(time);
  const formatted = formatter.format(date);

  return (
    <time dateTime={date.toISOString()} {...delegated}>
      {formatted}
    </time>
  );
}
