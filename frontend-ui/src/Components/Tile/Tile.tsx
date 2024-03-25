import React from "react";

type Props = {
  title: string;
  subTitle: string;
};

const Tile = ({ title, subTitle }: Props) => {
  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 px-2"> 
      <div
        className="relative flex flex-col min-w-0 break-words bg-blue-70 rounded-xl mb-4 shadow-lg"
      >
        <div className="flex-auto p-2">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <h5 className="text-blueGray-100 uppercase font-bold text-xs">
                {title}
              </h5>
              <span className="font-bold text-xl text-gray-600">{subTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tile;
