import React from "react";
import Input from "./Input";
import Button from "./Button";
import OptionsPreview from "./OptionsPreview";
import cloneDeep from "lodash/cloneDeep";
import _ from "lodash";

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionCount: 0,
      questionsMarkup: [],
      optionsCount: {},
      buttonText: {
        addQuestion: "ADD QUESTION",
        delete: "DELETE QUESTION",
        addOption: "ADD OPTION"
      },
      currentQuestion: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleUpstreamOptions_debounce = this.handleUpstreamOptions_debounce.bind(
      this
    );
    this.handleKeyup = this.handleKeyUp.bind(this);
    this.handleUpstreamOptions_debounce = _.debounce(
      this.handleUpstreamOptions_debounce,
      1000
    );
  }
  handleFocus(e) {
    this.manageCurrentQuestion(e);
  }
  handleKeyUp(e) {
    this.handleUpstreamOptions_debounce(e);
  }
  handleClick(e) {
    // when add question button clicked
    if (e && e.target.innerHTML === this.state.buttonText.addQuestion) {
      this.addQuestionInput(e);
      this.manageCurrentQuestion(e);
      // call here to work with debounce
      this.handleUpstreamOptions_debounce(e);

      e.persist();
      setTimeout(() => {
        // set question count to parent
        this.props.onClick({
          e: e,
          questionCount: this.state.questionCount,
          buttonText: this.state.buttonText
        });
      });
      // when delete question button clicked
    } else if (e.target.innerHTML === this.state.buttonText.delete) {
      this.props.onClick({
        e: e,
        questionCount: this.state.questionCount,
        buttonText: this.state.buttonText
      });
      this.deleteQuestionInput(e);
      this.manageCurrentQuestion(e);

      // when add options question button clicked - no debounce
    } else if (e && e.target.innerHTML === this.state.buttonText.addOption) {
      e.persist();
      this.handleUpstreamOptions_NO_debounce(e);
    }
  }
  // send optionscount to parent
  handleUpstreamOptions_debounce(e) {
    e.persist();
    this.incrementOptionsCount(e);
    // send optionCount to parent
    setTimeout(() => {
      this.props.onKeyUp({ e: e, optionsCount: this.state.optionsCount });
    });
  }
  handleUpstreamOptions_NO_debounce(e) {
    e.persist();
    this.incrementOptionsCount(e);
    // send option count to parent
    setTimeout(() => {
      this.props.onClick({
        e: e,
        optionsCount: this.state.optionsCount,
        buttonText: this.state.buttonText
      });
    });
  }
  //increment optionCount
  incrementOptionsCount(e) {
    const questionNum = this.state.currentQuestion;
    // when input entered in options - with debounce
    if (e.target && e.target.name.includes("question-options")) {
      updateObject(this);
      // for options button
    } else if (
      e.target &&
      e.target.tagName === "BUTTON" &&
      e.target.innerHTML === this.state.buttonText.addOption
    ) {
      updateObject(this);
    }
    // utility func used for DRY inside the parent func
    function updateObject(that) {
      if (!that.props.optionsCount[questionNum]) {
        let copy = cloneDeep(that.props.optionsCount);
        copy[questionNum] = 1;
        that.setState({
          optionsCount: copy
        });
      } else if (that.props.optionsCount[questionNum]) {
        let copy = cloneDeep(that.props.optionsCount);
        copy[questionNum]++;
        that.setState({
          optionsCount: copy
        });
      }
    }
  }
  renderQuestionMarkup(i) {
    return (
      <div
        className={`question-${i + 1} question`}
        key={i}
        onFocus={this.handleFocus.bind(this)}
      >
        <Input
          type="input"
          instance={`question-input-${i + 1}`}
          placeholder="Question"
          onKeyUp={this.props.onKeyUp}
        />
        <Input
          type="input"
          instance={`question-description-${i + 1}`}
          placeholder="Question Description (Optional)"
          onKeyUp={this.props.onKeyUp}
        />
        <Input
          type="input"
          instance={`question-options-${i + 1}`}
          placeholder="Add Options"
          onKeyUp={event => {
            event.persist();
            this.handleKeyup(event);
          }}
        />
        <OptionsPreview
          questions={this.props.questions ? this.props.questions[i] : null}
          onClick={this.props.onClick}
          instance="input"
        />
      </div>
    );
  }
  deleteQuestionInput() {
    setTimeout(() => {
      // console.log(this.props.questionCount);
      // this comes back from parent to render markup
      this.setState({
        questionsMarkup: Array.from(
          { length: this.props.questionCount },
          (v, i) => i
        )
      });
    }, 100);
  }
  // increment count of questions
  // use range to render arr of questions
  addQuestionInput() {
    // this goes and comes back from parent
    this.setState({
      questionCount: this.props.questionCount + 1
    });
    setTimeout(() => {
      // this comes back from parent to render markup
      this.setState({
        questionsMarkup: Array.from(
          { length: this.props.questionCount },
          (v, i) => i
        )
      });
    }, 100);
  }
  renderFormMarkUp() {
    return (
      <div className="title-form">
        <Input
          instance="title-input"
          type="input"
          placeholder="Title"
          onKeyUp={this.props.onKeyUp}
        />
        <Input
          type="text-area"
          instance="title-text-area"
          placeholder="Form Description"
          onKeyUp={this.props.onKeyUp}
        />
      </div>
    );
  }
  // set currentQuestion and send to parent
  manageCurrentQuestion(e) {
    let currentQuestion;
    const n = e.target.name.slice(-1);
    setTimeout(() => {
      // if nothing clicked by user set to last created
      if (!n) {
        currentQuestion = this.props.questionCount;
        // if question clicked set that to current
      } else if (n && n <= this.props.questionCount) {
        currentQuestion = n;
        // if question gets deleted set to next in line
      } else if (this.props.questionCount < n) {
        currentQuestion = this.props.questionCount;
      }
      this.setState({
        currentQuestion: currentQuestion
      });
      // send currentQuestion to parent
      this.props.onFocus({ e: e, currentQuestion: currentQuestion });
    }, 100);
  }
 
  renderUserInput() {
    return (
      <div className="input-form">
        {this.renderFormMarkUp()}
        <div
          className={`questions-container ${
            this.state.questionsMarkup.length ? "active" : ""
          }`}
        >
          {this.state.questionsMarkup.map((_, i) => {
            return this.renderQuestionMarkup(i);
          })}
          <div className="input-button-container">
            <Button
              className="addOption"
              text={`${this.state.buttonText.addOption}`}
              onClick={this.handleClick}
            />
            <Button
              className="deleteQuestion"
              text={`${this.state.buttonText.delete}`}
              onClick={this.handleClick}
            />
            <Button
              className="addQuestion"
              text={`${this.state.buttonText.addQuestion}`}
              onClick={this.handleClick}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <React.Fragment>{this.renderUserInput()}</React.Fragment>;
  }
}

export default InputForm;
