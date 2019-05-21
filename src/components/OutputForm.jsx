import React from "react";
import OptionsPreview from "./OptionsPreview";
const ReactMarkdown = require('react-markdown')



function OutputForm(props) {
  
  function renderTitle(){
      return(
        <div className="output-form-header">
         <div className="output-title">
           
            <h1>{props.formTitle}</h1>
          </div>
          <div className="viewer-paragraph">
          <ReactMarkdown source={props.formDescription} />
           
          </div>
        </div>
      )

  }
  function renderQuestions(){
    return(
      <div className="output-questions-canvas">
          {
            !props.questions ? null : 
            props.questions.map((question,i) => {
              return(
              <div className="question" key={i}>
                  <h3>{question.text}</h3>
                  <p>{question.description}</p>
                  <OptionsPreview 
                    questions={question}
                    instance="output"/>
              </div>
              )
            })
          }

        </div>
    )
  }  
    return (
      <div className="output-form">
         {renderTitle()}
         {renderQuestions()}
      </div>
    )
  
}

export default OutputForm;
