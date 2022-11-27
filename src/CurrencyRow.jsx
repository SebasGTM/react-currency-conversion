import React from 'react'
import Form from 'react-bootstrap/Form';

export default function CurrencyRow(props) {
    const { options, selected, onChangeCurr, amount, onChangeAmount } = props
  return (
    <>
    <form>
      <div className="row">
        <Form.Control type="number" className="curr-input form-control" value={amount} onChange={onChangeAmount} />
          <Form.Select value={selected} onChange={onChangeCurr} className="col-xs-6">
              {options.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
              ))}
          </Form.Select>
      </div>
    </form>
    </>
  )
}
