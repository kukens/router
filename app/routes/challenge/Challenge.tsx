"use client";

import { Button } from "flowbite-react";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { Label, Radio } from "flowbite-react";

export default function Challenge() {
  return (
    <>

    <Dropdown className="m-5" label="Selects instrument" color="dark">
      <DropdownItem>Accordion</DropdownItem>
      <DropdownItem>Guitar</DropdownItem>
      <DropdownItem>Piano</DropdownItem>
    </Dropdown>

   <Dropdown className="m-5" label="Selects difficulty" color="dark">
      <DropdownItem color="dark">Begginer</DropdownItem>
      <DropdownItem color="dark">Easy</DropdownItem>
      <DropdownItem color="dark">Intermidiate</DropdownItem>
      <DropdownItem color="dark">Advanced</DropdownItem>
      <DropdownItem color="dark">Expert</DropdownItem>
    </Dropdown>


 <Button className="m-5 mt-10" as="span" color="teal" pill> Start</Button>


    </>
  );
}
