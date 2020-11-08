import React from 'react'

export default function CurrencyRow({ border = '2px solid #333', borderRadius = '0.4em', padding = '0.25em', currency, defaultCurrency, onCurrencyChange, amount, onChangeAmount }) {

    return (
        <div
            style={{
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}>

            <input
                type='number'
                style={{ border: border, borderRadius: borderRadius, padding: padding }}
                value={amount}
                onChange={onChangeAmount}
            />

            <select
                value={defaultCurrency}
                onChange={onCurrencyChange}>

                {currency.map(currencies => <option key={currencies} value={currencies}>{currencies}</option>)}

            </select>

        </div>
    )
}
