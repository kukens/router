"use client";

import { Button } from "flowbite-react";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useState } from 'react';
import { Link } from "react-router";

export const difficultyLevels: Record<string, string> = {
  1: "Begginer",
  2: "Easy",
  3: "Intermidiate",
  4: "Advanced",
  5: "Expert"
} as const;

export const instruments: Record<string, string> = {
  1: "Accordion",
  2: "Guitar",
  3: "Piano",
} as const;

interface ChallengeProps {
    difficulty: string,
    instrument: string
}

export default function (props: ChallengeProps) {

    const [instrument, setInstrument] = useState<string>(props.instrument)
    const [dificulty, setDificulty] = useState<string>(props.difficulty);

  const changeDifficultyLevel = (difficulty: string) => {
    setDificulty(difficulty)
  };

  const changeInstrumnent = (instrument: string) => {
    setInstrument(instrument)
  };

  return (
    <>

      <Dropdown className="m-5" label={instrument == "" ? "Select instrument" : instruments[instrument]} color="dark">
        {Object.entries(instruments).map(([id, name]) => (
          <DropdownItem key={id} onClick={() => changeInstrumnent(id)} color="dark">{name}</DropdownItem>
        ))}
      </Dropdown>

      <Dropdown className="m-5" label={dificulty == "" ? "Select difficulty" : difficultyLevels[dificulty]} color="dark">
        {Object.entries(difficultyLevels).map(([id, name]) => (
          <DropdownItem key={id} onClick={() => changeDifficultyLevel(id)} color="dark">{name}</DropdownItem>
        ))}
      </Dropdown>

      {dificulty && instrument ? (
        <Link className="m-5" to={`/challenge/start?difficulty=${dificulty}&instrument=${instrument}`}>
          <Button as="span" color="teal" pill> Start</Button>
        </Link>
      ) : (
        <Button disabled className="m-5" as="span" color="teal" pill> Start</Button>
      )}
    </>
  );
}
