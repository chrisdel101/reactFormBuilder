import React from "react";
import InputForm from "./InputForm";
import OutputForm from "./OutputForm";
import cloneDeep from "lodash/cloneDeep";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: {},
      questionCount: 0,
      optionsCount: {},
      currentQuestion:0
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.makeQuestionsArray = this.makeQuestionsArray.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }
  // create blank question object with id 
  createNewBlankQuestion(num) {
    let copy = cloneDeep(this.state.questions);
    copy[num] = {
      id: this.state.questionCount
    };
    return copy;
  }
  // check if class is in a classList
  checkForClass(list, className){
    const array = [...list]
    for(let i of array){
      if(i.includes(className)){
        return true
      }
    }
    return false
  }
  handleClick(e) {
    if (e.e && e.e.target.innerHTML === e.buttonText.addQuestion) {
      // set question count from child
      this.setState({ questionCount: e.questionCount });
      const num = this.state.questionCount;
      if (!this.state.questions[num]) {
        const newObj = this.createNewBlankQuestion(num);
        this.setState({
          questions: newObj
        });
      }

    } else if(e.e && e.e.target.innerHTML === e.buttonText.delete){
      this.deleteQuestion(e)
      
    } else if(e.target && this.checkForClass(e.target.classList,"icon-container")){
        this.deleteOptionFromQuestion(e) 

    } else if(e.e.target && e.e.target.innerHTML === e.buttonText.addOption){
      this.setState({
        optionsCount: e.optionsCount
      });
      this.updateQuestions(e.e, "options-button");
    }
  }
  handleKeyUp(e) {
    // pass count to state
    if (e && !e.target) {
      if (e.e.target && e.e.target.name.includes("question-options")) {
        this.setState({
          optionsCount: e.optionsCount
        });
        this.updateQuestions(e.e, "options-debounce");
      }

    } else if (e.target) {

      if (e.target.name === "title-input") {
        this.setState({ formTitle: e.target.value });

      } else if (e.target.name === "title-text-area") {
        console.log(e.target.value)
        console.log(e.target.value.includes('\n'))

        this.setState({ formDescription: e.target.value });

      } else if (e.target.name.includes("question-input")) {
        this.updateQuestions(e, "text");

      } else if (e.target.name.includes("question-description")) {
        this.updateQuestions(e, "description");

      }
    }
  }
  // delete from current question
  // decrement option count
  deleteOptionFromQuestion(e){
    const questionNumNode = e.target.parentNode.parentNode.parentNode
    const questionNum = parseInt(questionNumNode.classList[0].slice(-1))
    const optionNum = parseInt(e.target.classList[0].slice(-1)) 
    const questionsCopy = cloneDeep(this.state.questions)
    const currentQuestion = questionsCopy[questionNum]
    // delete from inside current question
    delete currentQuestion['options'][optionNum]
  
    this.setState({
      questions:questionsCopy,
    })

    this.decrementOptionsCount(currentQuestion)
  }
  // decrement the global options counter
  decrementOptionsCount(currentQuestion){
    const optionsCopy = cloneDeep(this.state.optionsCount)
  //  check option valye by currentQuestion
    if(optionsCopy[this.state.currentQuestion] > 0){
      optionsCopy[this.state.currentQuestion]--
    }

    this.setState({
      optionsCount:optionsCopy
    })
  }
  // delete question from global question obj
  deleteQuestion(){
    const current = this.state.currentQuestion
    const copy = cloneDeep(this.state.questions)
    
    delete copy[current]
    // update global question count
    const newCount = this.state.questionCount ? this.state.questionCount - 1 : 0
    this.setState({
      questionCount: newCount,
      questions: copy
    })
  }
  // update question object when data is recieved from inputs
  updateQuestions(e, type) {

    if (type === "text" || type === "description") {
      const currentQuestion = this.state.currentQuestion;
      const questionsCopy = cloneDeep(this.state.questions);
      // is doesn't exist create
      if (!questionsCopy[currentQuestion]) {
        questionsCopy[currentQuestion] = {
          [type]: e.target.value
        };
      } else {
        questionsCopy[currentQuestion][type] = e.target.value;
      }
      this.setState({
        questions: questionsCopy
      });

    } else if (type === "options-debounce" || type === "options-button") {
      const currentQuestion = this.state.currentQuestion;
      const questionsCopy = cloneDeep(this.state.questions);
      // if options doesn't exist create it
      if(type ==="options-debounce" ){
        // don't create empty option
        if(e.target.value === " " || e.target.value === "") return

        if (!questionsCopy[currentQuestion]["options"]) {
          questionsCopy[currentQuestion]["options"] = {
            [this.state.optionsCount[currentQuestion]]: e.target.value
          };
          this.setState({ questions: questionsCopy });

          //  else add to the options obj
        } else if (questionsCopy[currentQuestion]["options"]) {
          const key = this.state.optionsCount[this.state.currentQuestion];
          questionsCopy[currentQuestion]["options"][key] = e.target.value;

          this.setState({ questions: questionsCopy });
        }

      } else if(type === "options-button"){
        if(Object.entries(this.state.questions).length === 0){
          console.error("No questions created. Cannot create options.")
          return
        }
           if (!questionsCopy[currentQuestion]["options"]) {
          questionsCopy[currentQuestion]["options"] = {
            [this.state.optionsCount[currentQuestion]]: `Option ${this.state.optionsCount[this.state.currentQuestion]}`
          };

          this.setState({ questions: questionsCopy });
          //  else add to the options obj
        } else if (questionsCopy[currentQuestion]["options"]) {
          const key = this.state.optionsCount[this.state.currentQuestion];
          questionsCopy[currentQuestion]["options"][key] = `Option ${this.state.optionsCount[this.state.currentQuestion]}`
  
          this.setState({ questions: questionsCopy });
        }
      }
    }
  }
  // make an array for mapping child props  
  makeQuestionsArray() {
    if (!this.state.questions) return;
    const questions = Object.values(this.state.questions);
    return !questions ? null : questions;
  }

  // handle current question state from child
  manageCurrentQuestion(e){
    this.setState({
      currentQuestion: parseInt(e.currentQuestion)
    })
  }
  handleFocus(e){
    this.manageCurrentQuestion(e)
  }
  render() {
    return (
      <main className="cols main">
        <div className="row">
          <div className="col">
            <InputForm 
            onFocus={this.handleFocus.bind(this)}
            onKeyUp={this.handleKeyUp} 
            onClick={this.handleClick}
            questions={this.makeQuestionsArray()}
            questionCount={this.state.questionCount}
            optionsCount={this.state.optionsCount} 
            />
          </div>
          
          <div className="col">
            <OutputForm
              formTitle={this.state.formTitle}
              formDescription={this.state.formDescription}
              textAreaValue={this.state.textAreaValue}
              questions={this.makeQuestionsArray()}
            />
          </div>
        </div>
      </main>
    );
  }
}

export default Page;
