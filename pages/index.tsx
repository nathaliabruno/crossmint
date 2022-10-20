import type { InferGetStaticPropsType } from "next";
import type { Goal } from "../types/crossmint";
import { useState, useEffect } from "react";
import { debounce } from "../utils";

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

  const postMegaverse = (endpoint, options, row, column) => {
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: options,
    };

    const optionsJSON = JSON.parse(options);

    debounce(
      fetch(`https://challenge.crossmint.io/api/${endpoint}`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result, row, column))
        .catch((error) =>
          setStateError((value) => [
            ...value,
            {
              id: `${value.length}-${endpoint}-${row}-${column}`,
              endpoint: endpoint,
              row: row,
              column: column,
              color: optionsJSON.color,
              direction: optionsJSON.direction,
            },
          ])
        ),
      5000
    );
  };

  const reprocessErrors = () => {
    stateError.map((error) => {
      let body = JSON.stringify({
        candidateId: candidateId,
        row: error.row,
        column: error.column,
        color: error.color,
        direction: error.direction,
      });
      debounce(
        postMegaverse(error.endpoint, body, error.row, error.column),
        10000
      );
    });
    setStateError([]);
  };

  const retryOne = (error) => {
    let body = JSON.stringify({
      candidateId: candidateId,
      row: error.row,
      column: error.column,
      color: error.color,
      direction: error.direction,
    });
    debounce(
      postMegaverse(error.endpoint, body, error.row, error.column),
      10000
    );

    const removeIndex = stateError.map((item) => item.id.indexOf(error.id));
    let duplicatedArray = [...stateError];
    removeIndex && duplicatedArray.splice(removeIndex, 1);
    setStateError(duplicatedArray);
  };

  const createSoloons = () => {
    soloons.forEach(async (soloon) => {
      let body = JSON.stringify({
        candidateId: candidateId,
        row: soloon.row,
        column: soloon.column,
        color: soloon.color,
      });

      await postMegaverse("soloons", body, soloon.row, soloon.column);
    });
  };
  const createPolyanets = () => {
    polyanets.forEach(async (polyanet) => {
      let body = JSON.stringify({
        candidateId: candidateId,
        row: polyanet.row,
        column: polyanet.column,
      });

      debounce(
        await postMegaverse("polyanets", body, polyanet.row, polyanet.column),
        1000
      );
    });
  };
  const createComeths = () => {
    comeths.forEach(async (cometh) => {
      let body = JSON.stringify({
        candidateId: candidateId,
        row: cometh.row,
        column: cometh.column,
        direction: cometh.direction,
      });

      await postMegaverse("comeths", body, cometh.row, cometh.column);
    });
  };

  console.log(stateError);
  return (
    <>
      <h1>Let's create the megaverse!</h1>

      <button onClick={createSoloons}>Add Soloons</button>
      <br />
      <br />
      <button onClick={createComeths}>Add Comeths</button>
      <br />
      <br />
      <button onClick={createPolyanets}>Add Polyanets</button>
      <br />
      <table>
        <thead>
          <tr>
            <th>Element</th>
            <th>Row</th>
            <th>Column</th>
            <th>
              <button onClick={reprocessErrors}>Retry errors</button>
            </th>
          </tr>
        </thead>
        {stateError.map((error) => (
          <tr key={error.id}>
            <td>{error.endpoint}</td>
            <td>{error.row}</td>
            <td>{error.column}</td>
            <td>{/* <button onClick={retryOne}>Retry</button> */}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
