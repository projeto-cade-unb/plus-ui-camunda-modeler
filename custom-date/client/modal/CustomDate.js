/* eslint-disable no-unused-vars */
import React, { Fragment } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';


const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

export default function CustomDate({ onClose, onInsert, setValue, defaultValue }) {
  return (
    <Fragment>
      <Title>
        Informe a data
      </Title>
      <Body>
        <div className="bpp-properties-panel">
          <div className="input-container">
            <input type="datetime-local" id="meeting-time" name="dueDate" onInput={ value => setValue(value) } value={ defaultValue } />
          </div>
        </div>
      </Body>
      <Footer>
        <div>
          <button type="button" className="btn btn-danger" onClick={ onClose }>
            Fechar
          </button>
          <button type="button" className="btn btn-primary" onClick={ onInsert }>
            Entrar
          </button>
        </div>
      </Footer>
    </Fragment>
  );
}

