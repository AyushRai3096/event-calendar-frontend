import { Input } from '@material-ui/core';

const handleClick = (isStart, func) => {
    if(isStart) func("start")
    else func("end")
}

const CustomInput = (props) => {
    return <Input disableUnderline={true} value={props.val} onClick={() => handleClick(props.isStart, props.handleInputClick)} />
}

export default CustomInput;