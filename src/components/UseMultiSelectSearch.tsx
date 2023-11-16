'use client'
import { useState } from "react";
import Select, { ActionMeta, MultiValue } from "react-select";



// type SelectOption = {
//     label: string;
//     value: {
//         name: string;
//         label: string;
//         description: string;
//     };
// };


type SelectOptions = {
    label: string;
    value: {
      name: string;
      label: string;
      description: string;
    };
  };

  
  type MultiSelectProps = {
    options: SelectOptions[];
    name: string;
  };



export default function MultiSelect({ options, name }: MultiSelectProps) {
  console.log("Options inside MultiSelect", options)
  const [selectedOptions, setSelectedOptions] = useState<SelectOptions[]>([]);

  const handleChange = (
    newValue: MultiValue<SelectOptions>,
    actionMeta: ActionMeta<SelectOptions>
  ) => {
    setSelectedOptions(newValue as SelectOptions[]);
  };

  return (
    <>
      <Select
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isMulti
      />
      {selectedOptions.map((option, index) => (
        <input
          key={index}
          type="hidden"
          name={name}
          value={JSON.stringify(option.value)}
        />
      ))}

    </>
  );
}

