import Link from 'next/link'
import type { InferGetStaticPropsType } from 'next'
import type { Goal } from "../types/crossmint";

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

export default function IndexPage({ goal }: InferGetStaticPropsType<typeof getStaticProps>) {
  const candidateId = "10d40d76-86da-4e0f-8c59-20c41b069e2d";
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const fetchMegaverse = (endpoint, options, position) => {
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: options,
      redirect: "follow",
    };
    console.log(endpoint, position);
    // fetch(`https://challenge.crossmint.io/api/${endpoint}`, requestOptions)
    //       .then((response) => response.text())
    //       .then((result) => console.log(result, position))
    //       .catch((error) => console.log("error", error));
  };

  const printMegaverse = (item, row, col) => {
    let body = "";
    switch (item) {
      case "POLYANET":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
        });

        fetchMegaverse("polyanets", body, `[${row}, ${col}]`);

        break;

      case "LEFT_COMETH":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
          direction: "left",
        });

        fetchMegaverse("comeths", body, `[${row}, ${col}]`);
        break;
      case "UP_COMETH":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
          direction: "up",
        });

        fetchMegaverse("comeths", body, `[${row}, ${col}]`);
        break;
      case "DOWN_COMETH":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
          direction: "down",
        });

        fetchMegaverse("comeths", body, `[${row}, ${col}]`);
        break;
      case "RIGHT_COMETH":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
          direction: "right",
        });

        fetchMegaverse("comeths", body, `[${row}, ${col}]`);
        break;

      case "BLUE_SOLOON":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
          color: "blue",
        });

        fetchMegaverse("comeths", body, `[${row}, ${col}]`);
        break;
      case "RED_SOLOON":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
          color: "red",
        });

        fetchMegaverse("comeths", body, `[${row}, ${col}]`);
        break;
      case "PURPLE_SOLOON":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
          color: "purple",
        });

        fetchMegaverse("comeths", body, `[${row}, ${col}]`);
        break;
      case "WHITE_SOLOON":
        body = JSON.stringify({
          candidateId: candidateId,
          row: row,
          column: col,
          color: "white",
        });

        fetchMegaverse("comeths", body, `[${row}, ${col}]`);
        break;
      default:
        break;
    }
  };

  console.table(goal);
  goal.map((row, rowIndex) => {
    row.map((column, colIndex) => {
      // console.log(column, rowIndex, colIndex);
      printMegaverse(column, colIndex, rowIndex);
    });
  });
  return (
    <>
      {/* <p>Next.js has {stars} ⭐️</p> */}
      <Link href="/preact-stars">
        <a>How about preact?</a>
      </Link>
    </>
  );
}
