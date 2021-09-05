import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import Switch from '@material-ui/core/Switch';
import EditIcon from '@material-ui/icons/Edit';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import TocOutlinedIcon from '@material-ui/icons/TocOutlined';
import Modal from '@material-ui/core/Modal';
import { Icon, FormControlLabel, Input, Button, withStyles } from '@material-ui/core';
import CustomInput from '../CustomInput';
import DatePicker from "react-datepicker";
import './modal.css';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';
import { Navbar } from 'react-bootstrap';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 10
    },
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
        float: 'right'
    },
    saveButton: {
        color: "white",
        background: "#2c3e50",
        float: 'right',
        '&:hover': {
            background: "#2c3e50"
        }
    },
}));

const ToggleSwitch = withStyles({
    switchBase: {
        color: "#2c3e50",
        '&$checked': {
            color: "#2c3e50",
        },
        // '&$checked + $track': {
        //     backgroundColor: "#2c3e50",
        // },
    },
    checked: {},
    track: {},
})(Switch);

function ModalComponent(props) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    var startDate = props.startDate
    var endDate = props.endDate
    var description = props.description
    var title = props.title
    var isAllDay = props.isAllDay
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false)
    const [disableSave, setDisableSave] = useState(true)

    const closeModal = () => {
        props.setModalState({
            ...props.modalState,
            showModal: false,
            title: "",
            description: "",
            startDate: moment().tz('Asia/Kolkata'),
            endDate: moment().tz('Asia/Kolkata').clone().add(1, "hours"),
            isAllDay: false,
            eventId: null,
            isUpdateMode: false
        })
        setDisableSave(true)
    }
    const handleInputClick = (type) => {
        if (type === 'start' && props.isModalEditable) setOpenStartDatePicker(!openStartDatePicker)
        else if (type === 'end' && props.isModalEditable) setOpenEndDatePicker(!openEndDatePicker)
    }
    const handleTitleInput = (event) => {
        var val = event.target.value;
        props.setModalState({
            ...props.modalState,
            title: val
        });

        if (!val.length || !description.length) {
            setDisableSave(true)
        } else {
            setDisableSave(false)
        }
    }
    const handleDescriptionInput = (event) => {
        var val = event.target.value;
        props.setModalState({
            ...props.modalState,
            description: val
        });
        if (!val.length || !title.length) {
            setDisableSave(true)
        } else {
            setDisableSave(false)
        }
    }

    const onSaveEvent = () => {
        props.handleCreateEvent({ title, description, startDate, endDate, isAllDay })
        closeModal();
    }
    const body = (
        <React.Fragment>
            <div style={modalStyle} className={classes.paper}>
                <div className="header-div">
                    <IconButton
                        onClick={closeModal}
                        className={classes.extendedIcon} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    {
                        props.hideEditDeleteButtons ? null :
                            <IconButton
                                onClick={() => {
                                    props.handleDeleteEvent()
                                    closeModal()
                                }}
                                className={classes.extendedIcon}
                                aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                    }

                    {
                        props.hideEditDeleteButtons ? null :
                            <IconButton
                                onClick={() =>
                                    props.setModalState({
                                        ...props.modalState,
                                        isModalEditable: true
                                    })
                                }
                                className={classes.extendedIcon}
                                aria-label="edit">
                                <EditIcon />
                            </IconButton>
                    }


                </div>
                <div className="title-div">
                    <Icon className="icn">
                        <TocOutlinedIcon />
                    </Icon>
                    <span id="title">
                        <Input
                            disabled={!props.isModalEditable}
                            disableUnderline={true}
                            value={title}
                            placeholder="Title"
                            onChange={(event) => handleTitleInput(event)} />
                    </span>

                    <FormControlLabel
                        control={
                            <ToggleSwitch
                                className="toggle"
                                checked={isAllDay}
                                disabled={!props.isModalEditable}
                                onChange={() => props.setModalState({
                                    ...props.modalState,
                                    isAllDay: !props.modalState.isAllDay,
                                    endDate: moment(props.modalState.startDate).tz('Asia/Kolkata').clone().add(1, "hours")
                                })}
                                name="all-day"
                                color="primary"
                            />
                        }
                        label="All Day"
                    />
                    <ul style={{ listStyle: "none" }}>
                        <span>FROM</span>
                        <li>
                            <DatePicker
                                selected={new Date(startDate)}
                                showTimeSelect
                                onChange={date => props.setModalState({
                                    ...props.modalState,
                                    startDate: moment(date).tz('Asia/Kolkata')
                                })}
                                open={openStartDatePicker}
                                onClickOutside={() => setOpenStartDatePicker(false)}
                                customInput={(<CustomInput val={startDate ? startDate.format('MMM DD, YYYY hh:mm A') : null} handleInputClick={handleInputClick} isStart />)}
                            />
                        </li>
                        <br />
                        <span>TO</span>
                        <br />
                        <li>
                            <DatePicker
                                selected={new Date(endDate)}
                                showTimeSelect
                                onChange={date => props.setModalState({
                                    ...props.modalState,
                                    endDate: moment(date).tz('Asia/Kolkata')
                                })}
                                open={openEndDatePicker}
                                onClickOutside={() => setOpenEndDatePicker(false)}
                                customInput={(<CustomInput val={endDate ? endDate.format('MMM DD, YYYY hh:mm A') : null} handleInputClick={handleInputClick} />)}
                            />
                        </li>
                    </ul>
                    <br />
                    <Icon className="icn">
                        <DescriptionOutlinedIcon />
                    </Icon>
                    <span id="description">
                        <Input
                            disabled={!props.isModalEditable}
                            disableUnderline={true}
                            value={description}
                            placeholder="Description"
                            onChange={(event) => handleDescriptionInput(event)} />
                    </span>
                </div>
                <Button
                    disabled={disableSave}
                    onClick={onSaveEvent}
                    className={classes.saveButton}
                    variant="contained"
                    >
                    Save
                </Button>
                <ModalComponent />
            </div>
        </React.Fragment>
    );

    return (
        <div>
            <Modal
                open={props.showModal}
                onClose={closeModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}

export default ModalComponent;