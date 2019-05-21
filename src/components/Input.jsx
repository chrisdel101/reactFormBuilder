import React, { Component } from "react";

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  renderInput() {
    if (this.props.type === "input") {
      return (
        <div className={`${this.props.type}-container`}>
          <input
            name={this.props.instance}
            className={`${this.props.type}  `}
            value={this.state.value}
            onChange={this.handleChange}
            onKeyUp={this.props.onKeyUp}
            placeholder={this.props.placeholder}
          />
        </div>
      );
    } else if (this.props.type === "text-area") {
      return (
        <div className={`${this.props.type}-container`}>
          <textarea
            value={this.state.value}
            name={this.props.instance}
            onKeyUp={this.props.onKeyUp}
            placeholder={this.props.placeholder}
            className={this.props.type}
            onChange={this.handleChange}
          />
        </div>
      );
    } else if (this.props.type === "checkbox") {
      return (
        <div className={`${this.props.type}-container`}>
          <input
            type={this.props.type}
            name={this.props.instance}
            className={`${this.props.type}`}
            value={this.props.value}
          />
        </div>
      );
    }
  }

  render() {
    return <React.Fragment>{this.renderInput()}</React.Fragment>;
  }
}

export default Input;
