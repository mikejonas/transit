import React, { useEffect, useImperativeHandle, useRef } from "react";

interface ExpandingTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ExpandingTextArea = React.forwardRef<
  HTMLTextAreaElement,
  ExpandingTextAreaProps
>(({ value, onChange, ...props }, ref) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => textAreaRef.current!);

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "1px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", adjustHeight);
    adjustHeight();
    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, [value]);

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={onChange}
      onInput={adjustHeight}
      className="text-gray-100 border-none resize-none w-full p-4 focus:outline-none"
      style={{
        overflow: "hidden",
        minHeight: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
      {...props}
    />
  );
});

export default ExpandingTextArea;
