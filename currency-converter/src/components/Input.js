import React, {useState, useCallback} from 'react'

const Input = ({type, label, val}) => {

    const [value, setValue] = useState();
    console.log(value);

    const handleValueChange = useCallback(()=>{
        setValue()
    })

    return(
        <form>
            <label htmlFor={label}>{label}</label>
            <input type={type} name={label} value={handleValueChange}/>
        </form>
    )
}

export default Input