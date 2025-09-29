export default function NumberBlock({
  number,
  label
}: {
  number: number;
  label: string;
}) {
  return (
    <div className="flex flex-col bg-accent p-2 m-4 rounded-xl text-center">
      <span className="text-2xl font-bold mt-3">{number}</span>
      {label}
    </div>
  );
}
