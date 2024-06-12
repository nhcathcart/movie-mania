export interface Props {}

interface Row {
  id: number;
  actor_name: string;
  image_url: string;
}
export default function MovieGrid({
  rowLabels,
  columnLabels,
}: {
  rowLabels: any[];
  columnLabels: any[];
}) {
  return (
    <div className="h-full w-full flex justify-center items-center p-12">
      {/* Create a grid with additional rows and columns for labels */}
      <div className="grid grid-cols-4 grid-rows-4 transform -translate-x-[12.5%]">
        {/* Empty top-left cell */}
        <div className="col-start-1 row-start-1"></div>

        {/* Column labels */}
        {columnLabels.map((col, index) => {
          return (
            <div
              key={col.id}
              className={`flex w-full  justify-center items-center bg-gray-200 col-start-${
                index + 2
              } row-start-1 p-1 items-center justify-center text-center text-xs`}
            >
              {col.description}
            </div>
          );
        })}

        {/* Row labels */}
        {rowLabels.map((row, index) => {
          return (
            <div
              key={row.id}
              className={`flex justify-center items-center bg-gray-200 col-start-1 row-start-${
                index + 2
              } p-1 p-1 items-center justify-center text-center text-xs`}
            >
              {row.actor_name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
