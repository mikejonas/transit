import React /* { ChangeEvent } */ from "react";
import {
  Controller,
  FieldName,
  useFormContext,
  FieldValues,
} from "react-hook-form";
import ExpandingTextArea from "../ExpandingTextArea";
import { Role } from "../../data";

interface MessageSectionProps {
  message: string;
  name: FieldName<FieldValues>;
  role: Role;
}

const MessageSection: React.FC<MessageSectionProps> = ({ name, role }) => {
  const { control } = useFormContext();
  const getLabel = () => {
    // capitalize first letter of role
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
      <label
        className="block text-gray-400 text-sm font-bold p-4"
        htmlFor="prompt"
      >
        {getLabel()}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <ExpandingTextArea {...field} />}
      />
    </>
  );
};

export default MessageSection;
