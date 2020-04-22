import { useEffect } from 'react';

const Listener = (props) => {
    useEffect(() => {
        document.querySelector(props.queryString).addEventListener('click', props.fct);
        return () => {
            document.querySelector(props.queryString).removeEventListener('click', props.fct);
        };
    })

    return (null);
}

export default Listener;