import type { InferGetStaticPropsType } from "next";
import type { Goal, Polyanets, Comeths, Soloons } from "../types/crossmint";
import { useState, useEffect } from "react";

export async function getStaticProps() {
  const res = await fetch(
    "https://challenge.crossmint.io/api/map/10d40d76-86da-4e0f-8c59-20c41b069e2d/goal"
  );
  const data: Goal = await res.json();
  return {
    props: {
      goal: data.goal,
    },
  };
}

export default function IndexPage({
  goal,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [polyanets, setPolyanets] = useState([]);
  const [comeths, setComeths] = useState([]);
  const [soloons, setSoloons] = useState([]);
  const [stateError, setStateError] = useState([]);

  const createMegaverse = (item, row, col) => {
    switch (item) {
      case "POLYANET":
        setPolyanets((polyanets) => [
          ...polyanets,
          {
            row: row,
            column: col,
          },
        ]);
        break;
      case "LEFT_COMETH":
        setComeths((comeths) => [
          ...comeths,
          {
            row: row,
            column: col,
            direction: "left",
          },
        ]);
        break;
      case "UP_COMETH":
        setComeths((comeths) => [
          ...comeths,
          {
            row: row,
            column: col,
            direction: "up",
          },
        ]);
        break;
      case "DOWN_COMETH":
        setComeths((comeths) => [
          ...comeths,
          {
            row: row,
            column: col,
            direction: "down",
          },
        ]);
        break;
      case "RIGHT_COMETH":
        setComeths((comeths) => [
          ...comeths,
          {
            row: row,
            column: col,
            direction: "right",
          },
        ]);
        break;
      case "BLUE_SOLOON":
        setSoloons((soloons) => [
          ...soloons,
          {
            row: row,
            column: col,
            color: "blue",
          },
        ]);
        break;
      case "RED_SOLOON":
        setSoloons((soloons) => [
          ...soloons,
          {
            row: row,
            column: col,
            color: "red",
          },
        ]);
        break;
      case "PURPLE_SOLOON":
        setSoloons((soloons) => [
          ...soloons,
          {
            row: row,
            column: col,
            color: "purple",
          },
        ]);
        break;
      case "WHITE_SOLOON":
        setSoloons((soloons) => [
          ...soloons,
          {
            row: row,
            column: col,
            color: "white",
          },
        ]);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    goal.map((column, colIndex) => {
      column.map((row, rowIndex) => {
        createMegaverse(row, colIndex, rowIndex);
      });
    });
  }, []);

  const candidateId = "10d40d76-86da-4e0f-8c59-20c41b069e2d";
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const postMegaverse = async (endpoint, options, row, column) => {
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: options,
    };
    const request = await fetch(
      `https://challenge.crossmint.io/api/${endpoint}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result, row, column))
      .catch((error) =>
        setStateError((value) => [
          ...value,
          {
            endpoint: endpoint,
            row: row,
            column: column,
            color: requestOptions.body.color,
            direction: requestOptions.body.direction,
          },
        ])
      );

    return await request;
  };

  const createSoloons = () => {
    soloons.map(async (soloon) => {
      let body = JSON.stringify({
        candidateId: candidateId,
        row: soloon.row,
        column: soloon.column,
        color: soloon.color,
      });

      await sleep(500);
      postMegaverse("soloons", body, soloon.row, soloon.column);
    });
  };

  console.log(stateError);
  return (
    <>
      <h1>Let's create the megaverse!</h1>

      <button onClick={createSoloons}>Add Soloons</button>
    </>
  );
}
