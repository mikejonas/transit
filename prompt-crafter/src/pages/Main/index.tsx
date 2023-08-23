import { useEffect, useState } from "react";
import { LLM_Models, Role, formNames, savedPrompts } from "../../data"; // Path to the savedPrompts file
import { useFormContext, useForm, FormProvider } from "react-hook-form";
import MessageSection from "../../components/MessageSection";
import RangeSlider from "../../components/RangeSlider";
import DropdownSelector from "../../components/DropdownSelector";
import { generateResponse } from "../../utils/prompt";

const Main = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { watch, reset, setValue } = useFormContext();

  useEffect(() => {
    reset(savedPrompts[activeTab]);
  }, [activeTab, reset]);

  const selectedPromptValues = watch();

  let accumulatedContent = "";
  const testPrompt = async () => {
    setValue("response", "");
    await generateResponse(selectedPromptValues, (content) => {
      // Append the content to the accumulated content
      accumulatedContent += content;
      // Set the value of "response" with the accumulated content
      setValue(formNames.response, accumulatedContent);
    });
  };

  const selectPrompt = (index: number) => {
    setActiveTab(index);
  };

  const renderHeader = () => (
    <div className="border-b border-zinc-800">
      <div className="text-left mx-auto px-4 my-4">
        <h1 className="text-xl font-regular text-gray-200">
          ⬜ Prompt Crafter
        </h1>
      </div>
    </div>
  );

  const renderMessages = () => {
    return savedPrompts[activeTab].messages.map((message, i) => {
      return (
        <MessageSection
          key={i} // this should be a unque id
          message={message.content}
          name={formNames.messageContent(i)}
          role={message.role}
        />
      );
    });
  };

  const renderResponse = () => (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={testPrompt}
      >
        Generate Response
      </button>
      <div className="mt-4 text-gray-200">
        <MessageSection
          message={selectedPromptValues.response}
          name={formNames.response}
          role={Role.Assistant}
        />
      </div>
    </>
  );

  const renderLeftColumn = () => (
    <>
      <h2 className="mb-2 text-sm font-bold text-gray-200">Saved Prompts</h2>
      <ul>
        {savedPrompts.map((savedPrompt, index) => (
          <li
            key={index}
            className={`cursor-pointer ${
              index === activeTab ? "text-blue-500" : "text-gray-400"
            }`}
            onClick={() => selectPrompt(index)}
          >
            {savedPrompt.title}
          </li>
        ))}
      </ul>
    </>
  );

  const renderRightColumn = () => (
    <>
      <div className="mb-4">
        <DropdownSelector
          label="Model"
          value={selectedPromptValues.model}
          options={Object.values(LLM_Models)}
          onChange={(llmModel) => {
            setValue(formNames.model, llmModel);
          }}
        />{" "}
      </div>
      <RangeSlider
        min={0}
        max={1}
        value={selectedPromptValues.parameters.temperature}
        name={formNames.temperature}
      />
    </>
  );

  if (Object.keys(selectedPromptValues).length === 0) {
    return null;
  }
  return (
    <>
      {renderHeader()}
      <div className="flex text-gray-200">
        <div className="w-64 border-r  border-zinc-800 p-4">
          {renderLeftColumn()}
        </div>
        <div className="prose lg:prose-xl flex-1 border-r  border-zinc-800">
          <div className="mb-4">{renderMessages()}</div>
          {renderResponse()}
        </div>
        <div className="w-64 p-4">{renderRightColumn()}</div>
      </div>
    </>
  );
};

// So that we can use useFormContext in the child components
const MainContainer = () => {
  const reactHookFormMethods = useForm();
  return (
    <FormProvider {...reactHookFormMethods}>
      <Main />
    </FormProvider>
  );
};

export default MainContainer;
