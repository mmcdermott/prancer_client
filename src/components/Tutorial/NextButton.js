import React from 'react';
import { useHistory } from "react-router-dom";

import ButtonImport from '@material-ui/core/Button/index.js';
const Button = ButtonImport.default;

import { NavigateNext } from '@material-ui/icons/index.js';

export default function NextButton(props) {
  let history = useHistory()

  const { userId, onSubmit } = props

  function onClick() {
      const { success, route } = onSubmit()

      if (success) {
          history.push(route)
      }
  }

  return (
    <div className="next-button">
      <Button
        className='hover-state'
        variant={'contained'}
        onClick={onClick}
        color="primary"
      >
        Next <NavigateNext />
      </Button>
    </div>
  )
}
