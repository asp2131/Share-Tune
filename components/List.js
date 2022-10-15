import React, { useState } from "react";
import RegisPlayer from "../Player";

const transcript = `
The Event will be an immersive and inspiring environment that will take participants to the top of the highest mountain in the world. It will be a place to raise awareness of bicycle safety and encourage cycling to be part of daily physical activity. The overall aim of the Event is to provide participants with the opportunity to experience the thrill of being part of a community and to celebrate the positive contribution of bicycling in a safe, responsible and sustainable way.
The Travail du Tour de France is a multi-sport event that takes place in France during the 12 months of cycling during the 2016 season. It is a race based on a 15 lap bicycle race. The event has a prize pool of €10,000. About Cycling Europe: CyclingEurope is Europe’s biggest cycling conference and organizes several cycling events each year. Come and join us for one of our exciting cycling events in Brussels!
The Tour of Norway, an endurance race series that aims at a top spot on the cycling world calendar every year, starts its own Cycling Tour with the tour Åbo Sandvik’s first grand tour of Norway (1st solo journey).
The Event will be an immersive and inspiring environment that will take participants to the top of the highest mountain in the world. It will be a place to raise awareness of bicycle safety and encourage cycling to be part of daily physical activity. The overall aim of the Event is to provide participants with the opportunity to experience the thrill of being part of a community and to celebrate the positive contribution of bicycling in a safe, responsible and sustainable way.
The Travail du Tour de France is a multi-sport event that takes place in France during the 12 months of cycling during the 2016 season. It is a race based on a 15 lap bicycle race. The event has a prize pool of €10,000. About Cycling Europe: CyclingEurope is Europe’s biggest cycling conference and organizes several cycling events each year. Come and join us for one of our exciting cycling events in Brussels!
The Tour of Norway, an endurance race series that aims at a top spot on the cycling world calendar every year, starts its own Cycling Tour with the tour Åbo Sandvik’s first grand tour of Norway (1st solo journey).
`;

export default function List({ list, onChange }) {
  const [dragingKey, setDragingKey] = useState(null);
  const [overKey, setOverKey] = useState(null);

  // 冲动动态 img 对象
  const genImgDom = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });

  // 开始拖动
  const onDragStart = async (e, key) => {
    // e.persist();
    // const dom = await genImgDom(
    //   "https://images.unsplash.com/photo-1508252568242-e0f383f753d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
    // );

    // e.dataTransfer.setDragImage(dom, 0, 0);

    e.dataTransfer.setData("prevKey", key);
    setDragingKey(key);
  };

  // 拖动经过
  const onDragOver = (e, key) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = "copy";

    setOverKey(key);
  };

  // 放置
  const onDrop = (e, key) => {
    e.persist();
    const prevKey = e.dataTransfer.getData("prevKey");

    console.log({
      files: e.dataTransfer.files.length
    });

    console.log({ prevKey, key });
    // 重置
    setOverKey(null);
    setDragingKey(null);
    if (!prevKey || key === prevKey) return;

    // 交换数据位置
    const updatelist = list.slice();

    const prevIndex = list.findIndex((li) => li.key === prevKey);
    const nextIndex = list.findIndex((li) => li.key === key);

    updatelist.splice(prevIndex, 1, list[nextIndex]);
    updatelist.splice(nextIndex, 1, list[prevIndex]);
    console.log(updatelist)

    onChange(updatelist);
  };

  const deleteStem = (stem) => {
    const updatelist = list.slice();
    const index = updatelist.indexOf(stem);
    if (index > -1) { // only splice array when item is found
    updatelist.splice(index, 1); // 2nd parameter means remove one item only
    updatelist[0] = { key: "1", title: "No audio track" }
    onChange(updatelist);
}
  }

  return (
    <ul className="list">
      {list.map((stem, i) => {
        const { key, title, fileUrl } = stem;
        const isDragging = dragingKey === key;
        const isHover = !isDragging && overKey === key;

        return (
          <li
            className="item"
            draggable="true"
            key={key}
            onDragStart={(e) => onDragStart(e, key)}
            onDrop={(e) => onDrop(e, key)}
            onDragOver={(e) => onDragOver(e, key)}
            style={{
              order: i,
              color: "#fff",
              opacity: isHover ? 0.4 : 1,
              // ...(isDragging
              //   ? { maxWidth: 0, overflow: "hidden", opacity: 0 }
              //   : {}),
              background: ["#794cf5", "#6470ff", "#20af02", "#18adfe"][key - 1]
            }}
          >
            
            {fileUrl ? 
                <RegisPlayer
                transcript={transcript}
                color="primary"
                size="small"
                list={list}
                stem={stem}
                src={fileUrl}
                deleteStem={deleteStem}
                /> 
          : title}
          </li>
        );
      })}
    </ul>
  );
}
