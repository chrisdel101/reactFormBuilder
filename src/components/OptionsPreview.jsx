import React from "react";
import Icon from "./Icon";
import Input from "./Input";

// renders options only
function OptionsPreview(props) {
  if (!props.questions) return "";

  function renderOptions(options) {
    if(props.instance === "input"){
      return options.map((option,i) => {
        return (
          <div className={`option-preview-${option[0]} option-preview ${props.instance}`} key={option[0]}>
            <div className="option-text">{option[1]}</div>
            <Icon 
              type="trash" 
              onClick={props.onClick}
              i={option[0]}/>
          </div>
        );
      });
    } else if(props.instance === "output"){
      return options.map((option,i) => {
        return (
          <div className={`option-output-${option[0]} ${props.instance}`} key={option[0]}>
            <Input
              type="checkbox"
              instance={`question-options-output-${i + 1}`}
              value={option[1]}/>
            <div className="options-output-text">{option[1]}</div>
          </div>
        );
      });
    }
  }
  function makeOptionsArr(props) {
    if (!props.questions || !props.questions.options) return;
    const options = Object.entries(props.questions.options);
    return options;
  }
  
  return (
    <div className="options-preview-conatainer">
      {!makeOptionsArr(props) ? null : renderOptions(makeOptionsArr(props))}
    </div>
  );
}

export default OptionsPreview;
