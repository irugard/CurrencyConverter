import React, { useState, useEffect } from 'react';

function getSavedValue(key, initialValue) {

    try{
        return JSON.parse(localStorage.getItem(key));
    }catch (e){
        return initialValue;
    }
}

export default function usePersistentState(key, initialValue) {
    const [value, setValue] = useState(getSavedValue(key, initialValue));

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value])

    return [value, setValue];
}
