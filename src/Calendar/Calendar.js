import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import '../App.css';

import React, { useEffect, useState } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { initFetchEvents, initCreateEvent, initUpdateEvent, initDeleteEvent, initLogout } from '../store/actions';
import ModalComponent from '../Components/Modal/Modal';
import moment from 'moment-timezone';
import _ from 'lodash';
import AppbarComponent from '../Components/Appbar/Appbar';
import { toast } from 'react-toastify';

function Calendar(props) {
    const [modalState, setModalState] = useState({
        showModal: false,
        isModalEditable: false,
        hideEditDeleteButtons: true,
        title: "",
        description: "",
        startDate: moment().tz('Asia/Kolkata'),
        endDate: moment().tz('Asia/Kolkata').clone().add(1, "hours"),
        isAllDay: false,
        eventId: null,
        isUpdateMode: false
    })
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initFetchEvents(props.userId));
    }, [dispatch])

    const customButtons = {
        newEvent: {
            text: 'Create',
            click: () => setModalState({
                ...modalState,
                showModal: true,
                isModalEditable: true,
                hideEditDeleteButtons: true
            }),
        },
    }

    const headerToolbar = {
        center: 'dayGridMonth,timeGridWeek,timeGridDay newEvent'
    }

    //if all day equals true, then time is not required
    // const events = [
    //     {
    //         id: 1,
    //         title: 'event 1',
    //         start: '2021-08-30T10:00:00',
    //         color: eventColors[2],
    //         allDay: false      //if end date/time not given then specify allDay property true/false
    //     },
    //     {
    //         id: 2,
    //         title: 'event 2',
    //         start: '2021-08-30T15:30:00',
    //         color: eventColors[2],
    //         allDay: false         //if end date/time not given then specify allDay property true/false
    //     },
    //     {
    //         // id: 6,
    //         title: 'meeting',
    //         start: '2021-08-30T08:00:00',
    //         end: '2021-08-30T08:30:00',
    //         color: eventColors[0],
    //         allDay: true    //if end date/time not given then specify allDay property true/false
    //     },
    //     {
    //         id: 3,
    //         title: 'event 3',
    //         start: '2021-08-30T10:35:00',
    //         color: eventColors[1],
    //         allDay: true      //if end date/time not given then specify allDay property true/false
    //     },
    //     {
    //         // id: 5,
    //         title: 'event 5',
    //         start: '2021-08-30T11:00:00',
    //         color: eventColors[2],
    //         allDay: true      //if end date/time not given then specify allDay property true/false
    //     },
    //     {
    //         // id: 2,
    //         title: 'event 7',
    //         start: '2021-08-23T13:00:00',
    //         end: '2021-08-24T18:00:00',
    //         color: eventColors[1]
    //     },
    //     // { 
    //     //   id: 3, 
    //     //   title: 'event 3', 
    //     //   start: '2021-08-29', 
    //     //   end: '2021-09-1' },
    // ];

    const eventTimeFormat = {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: true,
        meridiem: 'short'
    }

    const handleCreateEvent = ({ title, description, startDate, endDate, isAllDay }) => {
        if (!modalState.isUpdateMode)
            props.createEventHandler(title, description, startDate, endDate, isAllDay, props.userId)
        else handleUpdateEvent(title, description, startDate, endDate, isAllDay)
    }
    const handleUpdateEvent = (title, description, startDate, endDate, isAllDay) => {
        props.updateEventHandler(title, description, startDate, endDate, isAllDay, props.userId, modalState.eventId)
    }
    const handleDeleteEvent = () => {
        props.deleteEventHandler(props.userId, modalState.eventId);
    }
    const handleLogout = () => {
        props.logoutHandler(props.userId);
    }

    var calendar = <div className="App">
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={headerToolbar}
            customButtons={customButtons}
            events={props.userEvents}
            nowIndicator
            dateClick={(details) => {
                var _selectedDate = _.get(details, "date");
                var _endDate;
                if (_selectedDate) {
                    _selectedDate = moment(_selectedDate).tz('Asia/Kolkata');
                    _endDate = moment(_selectedDate).tz('Asia/Kolkata').clone().add(1, "hours")
                }

                setModalState({
                    ...modalState,
                    showModal: true,
                    isModalEditable: true,
                    hideEditDeleteButtons: true,
                    startDate: _selectedDate,
                    endDate: _endDate
                })
            }}
            eventClick={(details) => {
                var _description = _.get(details, "event._def.extendedProps.description")
                var _isAllDay = _.get(details, "event.allDay")
                var _startDate = _.get(details, "event.start")
                var _endDate = _.get(details, "event.end")
                var _title = _.get(details, "event.title")

                if (_startDate) _startDate = moment(_startDate).tz('Asia/Kolkata')
                if (_endDate) _endDate = moment(_endDate).tz('Asia/Kolkata')

                setModalState({
                    ...modalState,
                    showModal: true,
                    isUpdateMode: true,
                    isModalEditable: false,
                    hideEditDeleteButtons: false,
                    description: _description,
                    title: _title,
                    startDate: _startDate,
                    endDate: _endDate,
                    isAllDay: _isAllDay,
                    eventId: _.get(details, "event._def.extendedProps._id")
                })
            }}
            eventTimeFormat={eventTimeFormat}
            eventOrderStrict={true}

        />
    </div>
    if (!props.isLoggedIn)
        calendar = <Redirect to="/login" />
    return (
        <React.Fragment>
            <AppbarComponent handleLogout={handleLogout} />
            {calendar}
            <ModalComponent
                showModal={modalState.showModal}
                hideEditDeleteButtons={modalState.hideEditDeleteButtons}
                isModalEditable={modalState.isModalEditable}
                modalState={modalState}
                setModalState={setModalState}
                handleCreateEvent={handleCreateEvent}
                handleUpdateEvent={handleUpdateEvent}
                handleDeleteEvent={handleDeleteEvent}
                description={modalState.description}
                title={modalState.title}
                startDate={modalState.startDate}
                endDate={modalState.endDate}
                isAllDay={modalState.isAllDay}
                isUpdateMode={modalState.isUpdateMode}
            />
        </React.Fragment>
    );
}

const mapStateToProps = (store) => {
    return {
        isLoggedIn: store.authToken ? true : false,
        userEvents: store.userEvents,
        userId: store.userId,
        isError: store.isError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEvents: (userId) => dispatch(initFetchEvents(userId)),
        createEventHandler: (title, description, startDate, endDate, isAllDay, userId) => dispatch(initCreateEvent(title, description, startDate, endDate, isAllDay, userId)),
        updateEventHandler: (title, description, startDate, endDate, isAllDay, userId, eventId) => dispatch(initUpdateEvent(title, description, startDate, endDate, isAllDay, userId, eventId)),
        deleteEventHandler: (userId, eventId) => dispatch(initDeleteEvent(userId, eventId)),
        logoutHandler: (userId) => dispatch(initLogout(userId))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Calendar));