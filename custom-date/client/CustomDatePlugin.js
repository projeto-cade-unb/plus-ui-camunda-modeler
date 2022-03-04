import React, { Fragment } from 'camunda-modeler-plugin-helpers/react';

export default class CustomDatePlugin extends React.PureComponent {
  listeningCustomDate() {
    const inputFollowUpDate = document.getElementById('camunda-followUpDate');
    const inputDueDate = document.getElementById('camunda-dueDate');
    const inputPriority = document.getElementById('camunda-priority');

    if (inputFollowUpDate && !document.getElementById('checkbox-FollowUpDate')) {
      const labelFollowUpDate = document.createElement('label');
      labelFollowUpDate.innerHTML = '<input type="checkbox" id="checkbox-FollowUpDate" /> EL2 expression';
      labelFollowUpDate.addEventListener('click', () => {
        const checkBoxFollowUpDate = document.getElementById('checkbox-FollowUpDate');

        if (checkBoxFollowUpDate.checked === true) {
          inputFollowUpDate.type = 'text';
        } else {
          inputFollowUpDate.type = 'datetime-local';
        }
      });

      const parentElement = inputFollowUpDate.parentElement;
      parentElement.insertBefore(labelFollowUpDate, parentElement.childNodes[0]);
      inputFollowUpDate.type = 'datetime-local';
    }

    if (inputDueDate && !document.getElementById('checkbox-DueDate')) {
      const labelDueDate = document.createElement('label');
      labelDueDate.innerHTML = '<input type="checkbox" id="checkbox-DueDate" /> EL expression';

      labelDueDate.addEventListener('click', () => {
        const checkBoxDueDate = document.getElementById('checkbox-DueDate');

        if (checkBoxDueDate.checked === true) {
          inputDueDate.type = 'text';
        } else {
          inputDueDate.type = 'datetime-local';
        }
      });

      const parentElement = inputDueDate.parentElement;
      parentElement.insertBefore(labelDueDate, parentElement.childNodes[0]);
      inputDueDate.type = 'datetime-local';
      inputDueDate.type = 'datetime-local';
    }

    if (inputPriority) {
      inputPriority.type = 'number';
      inputPriority.min = '0';
      inputPriority.max = '100';
      inputPriority.step = '10';
    }
  }

  componentDidMount() {
    const { subscribe } = this.props;

    subscribe('bpmn.modeler.created', (event) => {
      const { modeler } = event;

      modeler.on('propertiesPanel.changed', ({ current: { element } }) => {
        this.listeningCustomDate();
      });
    });
  }

  render() {
    return (
      <Fragment>

      </Fragment>);
  }
}