import React, { Component } from 'react';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Button, ButtonGroup, Table, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, Alert } from 'reactstrap';
import { Steps } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';
import { PulseLoader } from 'react-spinners';
import './components/logIn/logIn.css';
import './components/createAccount/createAccount.css';
import './components/createEvent/createEvent.css';
import './components/calendarPage/calendarPage.css';
import './components/submitEvent/submitEvent.css';
import './components/announceEvent/announceEvent.css';
import './components/addAdmin/addAdmin.css';
import './components/selectEvent/selectEvent.css';
import './components/deleteEvent/deleteEvent.css';
import './components/activateEvent/activateEvent.css';

const axios = require('axios');

const Step = Steps.Step;

const steps = [{
    title: 'Basic info',
}, {
    title: 'Schedule',
}, {
    title: 'Summary',
}];

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

function flatten(arr) {
    let test = arr.reduce(function (flat, toFlatten) {

        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);

    return test;
}

function flatten2(l) {
    let test = l.map(events => {
        return events.data
    })

    test = flatten(test).filter(x => { return (new Date(moment().format()) >= new Date(moment(x.activationDay).format())) }).map(x => { return x.calendarInfo });

    return test;
}

function flatten3(l, currentUser) {
    let test = l.map(events => {
        return events.data
    })

    test = flatten(test).filter(x => { if (x.instructor === currentUser) { return (new Date(moment().format()) >= new Date(moment(x.activationDay).format())); } else { return null; } });

    return test;
}

function activeChecker(l, currentUser) {
    let test = l.map(events => {
        return events.data
    })
    test = flatten(test).filter(x => { if (x.instructor === currentUser) { return (new Date(moment().format()) <= new Date(moment(x.activationDay).format())); } else { return null; } });
    return test;
}

const formattedSeconds = (sec) =>
    Math.floor(sec / 60) +
    ':' +
    ('0' + sec % 60).slice(-2)

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            registerEvents: [],
            registerUserEmails: [],
            registerEventId: [],
            secondsElapsed: 300,
            laps: [],
            lastClearedIncrementer: null,
            registerEventEmail: "",
            createModal: false,
            registerModal: false,
            viewModal: false,
            activateModal: false,
            deleteModal: false,
            addAdminModal: false,
            announceModal: false,
            step: 0,
            name: { value: "", valid: true },
            email: { value: "", valid: true },
            description: { value: "", valid: true },
            location: { value: "", valid: true },
            capacity: { value: 0, valid: true },
            createName: { value: "", valid: true },
            createEmail: { value: "", valid: true },
            createUserName: { value: "", valid: true },
            createPassword: { value: "", valid: true },
            createConfirmPassword: { value: "", valid: true },
            username: { value: "", valid: true },
            password: { value: "", valid: true },
            daysSelected: [],
            isRecurrent: { value: "", valid: true },
            recurrence: "",
            allDay: false,
            activateToday: false,
            instructor: "",
            startDate: null,
            endDate: null,
            activationDay: null,
            selectedEvent: {},
            calendarInfo: {},
            dateValidNonRecurr: 'black',
            dateValid: 'black',
            recurrenceValid: 'black',
            daysSelectedValid: 'black',
            dateValidLabelNonRecurr: 'hidden',
            dateValidLabel: 'hidden',
            recurrenceValidLabel: 'hidden',
            daysSelectedValidLabel: 'hidden',
            currentEventId: null,
            nameUserModal: "",
            userNameModal: "",
            emailUserModal: "",
            idUserModal: "",
            newAdminSearchTable: 'none',
            login: { username: "default", name: "default", admin: false },
            visible: false,
            liveCapacity: 0,
            myEventsErrorLabel: 'none',
            allReadyRegisteredErrorLabel: 'none',
            fullCapacityErrorLabel: 'none',
        }

        this.incrementer = null;

        this.announceFullname = React.createRef();
        this.announceMessage = React.createRef();

        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.handleChangeActivationDate = this.handleChangeActivationDate.bind(this);
        this.handleChangeSearchNewAdmin = this.handleChangeSearchNewAdmin.bind(this);
        this.activateEvent = this.activateEvent.bind(this);
        this.updateRecurrence = this.updateRecurrence.bind(this);
        this.updateDaysSelection = this.updateDaysSelection.bind(this);
        this.toggleCreateEventModal = this.toggleCreateEventModal.bind(this);
        this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.toggleActivateModal = this.toggleActivateModal.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.toggleAddAdminModal = this.toggleAddAdminModal.bind(this);
        this.toggleAnnounceModal = this.toggleAnnounceModal.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.onRadioBtnActivateClick = this.onRadioBtnActivateClick.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.weekDaysToNumbers = this.weekDaysToNumbers.bind(this);
        this.splitEvent = this.splitEvent.bind(this);
        this.startTime = this.startTime.bind(this);
        this.minMaxTime = this.minMaxTime.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.handleRecurrenceChange = this.handleRecurrenceChange.bind(this);
        this.fetchEvents = this.fetchEvents.bind(this);
        this.addEventBasket = this.addEventBasket.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.displayCreateAccount = this.displayCreateAccount.bind(this);
        this.displayLogIn = this.displayLogIn.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.searchAdminEmail = this.searchAdminEmail.bind(this);
        this.addAdmin = this.addAdmin.bind(this);
        this.findFirstName = this.findFirstName.bind(this);
        this.registerForEvents = this.registerForEvents.bind(this);
        this.notifyEvent = this.notifyEvent.bind(this);
        this.unRegisterEvent = this.unRegisterEvent.bind(this);
        this.unregisterFromSingleEvent = this.unregisterFromSingleEvent.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    //This method serves as a handler for when the event registration timer starts.
    handleStartClick() {
        if (this.state.secondsElapsed !== 0) {
            this.incrementer = setInterval(() =>
                this.setState({
                    secondsElapsed: this.state.secondsElapsed - 1,
                })
                , 1000);
        }
    }

    //This method serves as a handler for when the event registration timer stops.
    handleStopClick() {
        clearInterval(this.incrementer);
        this.setState({
            lastClearedIncrementer: this.incrementer,
        });
    }

    //This method serves as a handler for when the event registration timer is reset to 5 min (300 sec).
    handleResetClick() {
        clearInterval(this.incrementer);
        this.setState({
            secondsElapsed: 300,
            laps: [],
        });
    }

    //This method serves as a handler for when the event start date is changed.
    handleChangeStart(date) {
        if (this.state.isRecurrent.value === "non-recurring") {
            let nonRecurStartDate = moment(this.state.startDate);
            let nonRecurEndDate = moment(date).add(15, "minutes");  //Set default end date to 15 minutes after the start date (because event can't last less than 15 mintutes).
            this.setState({
                startDate: nonRecurStartDate,
                endDate: nonRecurEndDate,
            });
        }
        if (this.state.allDay === true) {
            this.setState({  //All day event lasts from 9am to 6pm.
                startDate: moment(date).hours(9).minutes(0),
                endDate: moment(date).hours(18).minutes(0),
            });
        }
        else {
            this.setState({ startDate: date, });
        }
    }

    //This method serves as a handler for when the event end date is changed.
    handleChangeEnd(date) {
        this.setState({ endDate: date, });
    }

    //This method serves as a handler for when the event activation date is changed.
    handleChangeActivationDate(date) {
        this.setState({
            activationDay: date,
            activateToday: false,  //Sets the "Today" switch to its off position.   
        });
    }

    //This method serves as a handler for when a new admin is searched.
    handleChangeSearchNewAdmin(emailAdress) {
        const target = emailAdress.target;
        let valid = true;
        this.setState({ [target.name]: { value: target.value, valid: valid }, });
    }

    //This method finds the first name of the current logged in user.
    findFirstName(fullName) {
        if (/\s/g.test(fullName) === true) {    //This regex checks if fullName does contain a space " ".
            let firstName = fullName.substr(0, fullName.indexOf(' '));   //Takes the characters before the first space " ", and sets the first character to upper case.
            return firstName.charAt(0).toUpperCase() + firstName.substr(1);
        } else {    //Here, fullName does not contain a space " ".
            return fullName.charAt(0).toUpperCase() + fullName.substr(1);   //Sets the first character to uppercase.
        }
    }

    //This method searches for users in the database using their email address.
    searchAdminEmail(email) {
        axios.get('/users/')    //Get all the users from the database.
            .then(response => {
                let users = response.data   //Users are in the data field of the response.
                let BreakException = {};
                try {
                    users.forEach(user => {  //Loops through each user in the database.
                        if (email === user.email) { //If the user's email matches the email searched, the user was found.
                            if (user.admin === true) {  //If the searched user is already an admin, their info is not displayed.
                                this.setState({
                                    newAdminSearchTable: 'none',
                                    email: { value: this.state.email.value, valid: false },
                                });
                            }
                            else if (user.admin === false) {    //If the searched user in not an admin, their info and an "Add" button are displayed.
                                this.setState({
                                    nameUserModal: user.name,
                                    userNameModal: user.username,
                                    emailUserModal: user.email,
                                    idUserModal: user._id,
                                    newAdminSearchTable: 'block',
                                    email: { value: this.state.email.value, valid: true },
                                });
                            }
                            throw BreakException;
                        } else {
                            this.setState({  //If the user's email doesn't match the email searched, alert and no info is displayed.
                                newAdminSearchTable: 'none',
                                email: { value: this.state.email.value, valid: false },
                            });
                        }
                    });
                }
                catch (e) { //Catch any errors that occur in the try block
                    if (e !== BreakException) throw e;
                }
            })
            .catch(error => {
                // console.log(error); for development purposes.
            })
    }

    //This method sets the user's "admin" field to true.
    addAdmin() {
        axios.put('/users/' + this.state.idUserModal, { admin: true })    //"put" accesses user info with id and sends modified param (admin).
            .then(response => {
                this.toggleAddAdminModal(); //  Closes the add admin modal.
                toast.success("The user was set as an administrator!", {    //Alerts the user that the operation was successful.
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggablePercent: 60,
                    closeButton: false,
                });
            })
            .catch(error => {
                //console.log(error);   for development purposes.
                toast.error('The user was not set as an administrator, please try again later.', {  //Alerts the user that the operation was not successful.
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggablePercent: 60,
                    closeButton: false,
                });
            });
    }

    //When event recurrence radio button is pressed, update state of recurrence so that it's available when event is created.
    updateRecurrence(selection) {
        this.setState({ recurrence: selection, });
    }

    //This method is used to determine the minimum time of an event (15 minutes) based on its start time.
    startTime() {
        if (this.state.startDate === null && this.state.endDate === null) { //If no start and end date set, set them to the current day.
            return moment().hours(9).minutes(15);
        } else {    //If date and time set, 15 minutes because event can't be less than 15 minutes.
            return moment(this.state.startDate).add(15, "minutes");
        }
    }

    //This method updates state of start and end times when "all day" radio button switch is triggered -- only for non-recurring events.
    onRadioBtnClick() {
        if (this.state.allDay === false) {  //If the event won't last all day.
            if (this.state.startDate === null || this.state.endDate === null) { //If date not specified, set min time to 9am, and maxtime to 6pm for the current day.
                this.setState({ startDate: moment().hours(9).minutes(0), });
                this.setState({ endDate: moment().hours(18).minutes(0), });
            } else {    //If date is specified, set min time to 9am, and maxtime to 6pm for the specified day.
                this.setState({ startDate: moment(this.state.startDate).hours(9).minutes(0), });
                this.setState({ endDate: moment(this.state.endDate).hours(18).minutes(0), });
            }
            this.setState({ allDay: true, });   //Set the switch to "on", which means all day.
        } else {    //If the event will last all day, don't sepcify any start or end time.
            this.setState({ startDate: null, });
            this.setState({ endDate: null, });
            this.setState({ allDay: false, });  //Set the switch to "off", which means won't last all day.
        }
    }

    //This method updates the state of the event activation day when the "Today" radio button switch is triggered.
    onRadioBtnActivateClick() {
        if (this.state.activateToday === false) {   //When triggered, if switch is initially false (off), set it to true and update activation day to today.
            this.setState({ activateToday: true, });
            this.setState({ activationDay: moment(), });
        } else if (this.state.activateToday === true) { //When triggered, if switch is initially true (on), set it to false and update activation day to today.
            this.setState({ activateToday: false, });
            this.setState({ activationDay: null, });
        }
    }

    updateDaysSelection(selected) {
        const index = this.state.daysSelected.indexOf(selected);
        if (index < 0) {
            this.state.daysSelected.push(selected);
        } else {
            this.state.daysSelected.splice(index, 1);
        }

        this.setState({ daysSelected: [...this.state.daysSelected], });
    }

    //This method toggles the event creation modal.
    toggleCreateEventModal() {
        this.setState({ createModal: !this.state.createModal, });
    }

    //This method toggles the event registration modal and updates the registration timer accordingly.
    toggleRegisterModal() {
        if (this.state.registerEvents.length > 0) {  //If user is registered to any events.
            if (this.state.registerModal === false) {    //If modal was initially closed, stop the registration timer when modal opens.
                this.handleStopClick();
            }
            else if (this.state.registerModal === true) {    //If modal was initially open, continue the registration timer when modal closes.
                this.handleStartClick();
            }
            this.setState({
                registerModal: !this.state.registerModal,
                myEventsErrorLabel: 'none', //The error labels here refer to the full event and already registered error labels.
            });
        }
        else {  //If user is not registered to any events do not open the modal and notify the user.
            this.setState({
                myEventsErrorLabel: 'block',
            });
        }
    }

    //This method toggles the event activation modal and sets the state of current event id so that it's available if user completes activation.
    toggleActivateModal(id, start, end) {
        this.handleChangeActivationDate(null);
        this.setState({
            activateModal: !this.state.activateModal,
            currentEventId: id,
        });
    }

    //This method toggles the event deletion modal and sets the state ofcurrent event id so that it's available if user completes deletion.
    toggleDeleteModal(id) {
        this.setState({
            deleteModal: !this.state.deleteModal,
            currentEventId: id,
        });
    }

    //This method toggles the view/edit event modal.
    toggleViewModal(obj) {
        this.state.events.forEach(parentEvent => { //Loops through each event (parent) of the events list.
            let dataSet = parentEvent.data; //Data structure for event (parent) contains "data" field that has the actual events (child) -> Did this for recurring events.
            dataSet.forEach(event => { //Loops through each actual event from the parent event object.
                if (obj.title === event.calendarInfo.title && obj.start === event.calendarInfo.start) { //If event title and start date matches, set states for event info fields.
                    this.setState({
                        eventId: parentEvent._id,
                        name: { value: event.calendarInfo.title, valid: true },
                        capacity: { value: event.capacity, valid: true },
                        description: { value: event.description, valid: true },
                        location: { value: event.location, valid: true },
                        isRecurrent: { value: event.isRecurrent, valid: true },
                        daysSelected: event.daysSelected,
                        recurrence: event.recurrence,
                        allDay: event.allDay,
                        startDate: moment(event.calendarInfo.start),
                        endDate: moment(event.calendarInfo.end),
                        activationDay: moment(event.activationDay),
                        instructor: event.instructor,
                        calendarInfo: event.calendarInfo,
                        currentEventId: event._id,
                        liveCapacity: event.registeredEmail.length,
                        allReadyRegisteredErrorLabel: 'none',
                        fullCapacityErrorLabel: 'none',
                    })
                    if (event.recurrence === "") {  //If the event recurrence is empty, then the event is not recurring.
                        this.setState({ recurrence: "non-recurring", })
                    }
                }
            })

        });
        if (this.state.viewModal === true) {    //If view/edit modal is initially open, reset states of event info fields prior to closing the modal.
            this.setState({
                eventId: "",
                name: { value: "", valid: true },
                capacity: { value: "", valid: true },
                description: { value: "", valid: true },
                location: { value: "", valid: true },
                isRecurrent: { value: "", valid: true },
                daysSelected: [],
                recurrence: "",
                allDay: false,
                startDate: null,
                endDate: null,
                activationDay: null,
                instructor: "",
                calendarInfo: {},
                currentEventId: "",
            });
        }
        this.setState({ viewModal: !this.state.viewModal, });
    }

    //This method toggles the add admin modal.
    toggleAddAdminModal() {
        this.setState({ //Reset states of admin info fields prior to opening/closing the modal.
            addAdminModal: !this.state.addAdminModal,
            nameUserModal: "",
            userNameModal: "",
            emailUserModal: "",
            idUserModal: "",
            newAdminSearchTable: 'none',
            email: { value: "", valid: true },
        });
    }

    //This method toggles the announce event modal.
    toggleAnnounceModal(event) {
        axios.get('/users/')    //Gets all the users from the database.
            .then(response => {
                let users = response.data  //Users are in the data field of the response.
                let BreakException = {};
                try {
                    users.forEach(user => {  //Loops through each user received from the database.
                        if (this.state.login.name === user.name && this.state.login.username === user.username) { 
                            //We only store the name of logged in user, therefore this "if" statement
                            this.setState({                          //gives us the logged in user email that will be used to sent the announcement.
                                email: { value: user.email, valid: true },
                            });
                            throw BreakException;
                        }
                    });
                }
                catch (e) {
                    if (e !== BreakException) throw e;
                }
            })
            .catch(error => {
                //console.log(error); for development purposes.
            })
        if (this.state.announceModal === false) { //Fill in event info fields when opening the event announce modal.
            this.setState({
                announceModal: !this.state.announceModal,
                currentEventId: event._id,
                name: { value: event.calendarInfo.title, valid: true },
                startDate: event.calendarInfo.start,
            });
        }
        if (this.state.announceModal === true) {  //Reset the event info fields when closing the event announce modal.
            this.setState({
                announceModal: !this.state.announceModal,
                currentEventId: "",
                name: { value: "", valid: true },
                startDate: "",
            });
        }
    }

    //This method completed the registration of the user for an event.
    registerForEvents() {
        this.setState({     //Reset states and closes modal.
            registerEvents: [],
            registerModal: !this.state.registerModal,
            visible: false,
        });
        this.handleResetClick();    //Resets event registration timer to 5 min so that user successfuly completes event registration.
    }

    //This method removes the event from the user's added events list -- only if they didn't complete registration yet.
    unregisterFromSingleEvent(id) {
        axios.get('/events/' + id)  //Get specific event using id.
            .then(event => {
                let i = 0;
                let index;
                this.state.registerEvents.forEach(event => {   //Loop through all the uncompleted registered events.
                    if (event._id === id) {  //If the event's id matches the one passed with parameters, get the index of the uncompleted registered event.
                        index = i;
                    }
                    i++;
                })
                let emailCounter = 0; //Is used to find the index of the email to remove from the list of registered email of an event.
                event.data.registeredEmail.forEach(email => { //Loops through each registered email of an event.
                    if (this.state.registerEventEmail === email) {   //If event email matches email in parameter, remove it fromt he local AND database list.
                        event.data.registeredEmail.splice(emailCounter, 1)
                        axios.put('/events/' + id, { registeredEmail: event.data.registeredEmail })   //Removes event from database.
                            .then(response => {
                                if (this.state.registerEvents.length === 1) {    //If the unregistered event was the only one in the list, remove event from local list and close modal.
                                    this.state.registerEvents.splice(index, 1);
                                    this.setState({
                                        registerEvents: this.state.registerEvents,
                                        registerModal: false,
                                        visible: false,
                                    });
                                    this.handleResetClick(); //Reset counter to 5 minutes since no events require a completion of registration.
                                }
                                else {  //If the unregistered event was not the only one in the list, remove it from the local list and keep the modal open.
                                    this.state.registerEvents.splice(index, 1);
                                    this.setState({
                                        registerEvents: this.state.registerEvents,
                                    });
                                }
                            })
                            .catch(error => {
                                //console.log(error);   for development purposes.
                            });
                    }
                    emailCounter++;
                })
            })
            .catch(error => {
                //console.log(error); for development purposes.
            });
    }

    //This method removes all of the added events after 5 min if the registration is not completed.
    unRegisterEvent() {
        this.state.registerEventId.forEach(id => {    //Loops through each event that hasn't confirm its registration.
            axios.get('/events/' + id)  //Get specific event from database using id.
                .then(event => {
                    let i = 0;  //Used to find the index.
                    event.data.registeredEmail.forEach(email => { //Loops through each registered email of an event.
                        if (this.state.registerEventEmail === email) {   //If event's email list contains current user's email, remove it and update changes in database.
                            event.data.registeredEmail.splice(i, 1)
                            axios.put('/events/' + id, { registeredEmail: event.data.registeredEmail })
                                .then(response => {
                                    this.setState({
                                        registerEvents: [],
                                        visible: false,
                                    });
                                    this.handleResetClick(); //Reset counter to 5 minutes since no events require a completion of registration.
                                })
                                .catch(error => {
                                    //console.log(error);   for development purposes.
                                });
                        }
                        i++;
                    })


                })
                .catch(error => {
                    //console.log(error);   for development purposes.
                });
        })
    }

    //This method partially registers the user to an event -- user still needs to confirm registration later.
    addEventBasket(currentEventId) {
        let alreadyRegistered = false;
        let fullCapacity = false;
        axios.get('/users/')    //Get users from database.
            .then(response => {
                let users = response.data
                let BreakException = {};
                try {
                    users.forEach(user => {  //Loops through each user from the database.
                        if (this.state.login.name === user.name && this.state.login.username === user.username) {   //If the name of the user matches the one of the logged in user.
                            axios.get('/events/' + currentEventId)  //Get the info of the selected event using its id.
                                .then(response => {
                                    if (response.data.registeredEmail.length === response.data.capacity) {   //If the number of email registered = event capacity, event is full -> can't add it.
                                        fullCapacity = true
                                    }
                                    this.setState({
                                        registerEventId: this.state.registerEventId.concat(currentEventId),  //Add the event id to the local list of registered events.
                                        registerEventEmail: user.email, //Sets the state of the current user's email for later purposes.
                                    });
                                    response.data.registeredEmail.forEach(email => { //Checks if logged in user email is already in the registered email field of the event.
                                        if (user.email === email) {
                                            alreadyRegistered = true;
                                        }
                                    });
                                    if (alreadyRegistered === false && fullCapacity === false) {
                                        axios.put('/events/' + currentEventId, { registeredEmail: response.data.registeredEmail.concat(user.email) }) //Adds the logged in user's email to the registered email field of the event.
                                            .then(response => {
                                                this.handleResetClick()  //Resets the registration counter to 5 min.
                                                this.handleStartClick()  //Starts again the registration counter.
                                                this.setState({
                                                    visible: true,
                                                    myEventsErrorLabel: 'none',
                                                });
                                                axios.get('/events/' + currentEventId)  //Gets the updated event info, adds it to the local list of registered events, and closes the view event modal.
                                                    .then(response => {
                                                        this.setState({
                                                            registerEvents: this.state.registerEvents.concat(response.data),
                                                            viewModal: !this.state.viewModal,
                                                        });
                                                    })
                                                    .catch(error => {
                                                        //console.log(error);   for development purposes.
                                                    })
                                            })
                                            .catch(error => {
                                                //console.log(error);   for development purposes.
                                            });
                                    }
                                    else if (alreadyRegistered === true) {   //Alerts the user if they are already registered to the event.
                                        this.setState({
                                            allReadyRegisteredErrorLabel: 'block',
                                        });
                                    }
                                    else if (fullCapacity === true) {    //Alerts the user if the event is full.
                                        this.setState({
                                            fullCapacityErrorLabel: 'block',
                                        });
                                    }
                                })
                                .catch(error => {
                                    //console.log(error);   for development purposes.
                                });
                            throw BreakException;
                        }
                    });
                }
                catch (e) {
                    if (e !== BreakException) throw e;
                }
            })
            .catch(error => {
                //console.log(error);   for development purposes.
            })
    }

    //This method sets the minimum time so that a user can't set a date from the past.
    minMaxTime() {
        if (this.state.startDate === null && this.state.endDate === null) {
            return moment();
        } else {
            return moment(this.state.startDate);
        }
    }

    //This method brings the user to the "create an account" page.
    displayCreateAccount() {
        let user = { username: "account", admin: false };
        this.setState({
            login: user,
            username: { value: "", valid: true },
            password: { value: "", valid: true },
        });
    }

    //This method brings the user to the "log in" page.
    displayLogIn() {
        let user = { username: null, admin: false };
        this.setState({
            login: user,
            createName: { value: "", valid: true },
            createEmail: { value: "", valid: true },
            createUserName: { value: "", valid: true },
            createPassword: { value: "", valid: true },
            createConfirmPassword: { value: "", valid: true },
        });
    }

    //This method logs the user out by clearing cookies and resetting the user related states.
    logOut() {
        let user = { username: null, admin: false };
        this.setState({ login: user, });
    }

    //This method takes care of moving to the next step of the create event modal.
    nextStep(event) {
        event.preventDefault();
        if (this.state.step === 0) {    //Step 0 represents "basic info".
            let recurrenceValid = this.state.isRecurrent;
            let nameValid = this.state.name;
            let capacityValid = this.state.capacity;
            let locationValid = this.state.location;
            let descriptionValid = this.state.description;
            let valid = true;
            //Checks if fields are empty, or if their valid field is false (checked in the handler method).
            if (recurrenceValid.value === "" || nameValid.value === "" || capacityValid.value === "" || locationValid.value === "" || descriptionValid.value === "" || nameValid.valid === false || capacityValid.valid === false || locationValid.valid === false || descriptionValid.valid === false) {
                if (recurrenceValid.value === "") {
                    valid = false;
                    this.setState({
                        isRecurrent: { value: recurrenceValid.value, valid: valid },
                    });
                }
                if (nameValid.value === "") {
                    valid = false;
                    this.setState({
                        name: { value: nameValid.value, valid: valid },
                    });
                }
                if (capacityValid.value === "") {
                    valid = false;
                    this.setState({
                        capacity: { value: capacityValid.value, valid: valid },
                    });
                }
                if (locationValid.value === "") {
                    valid = false;
                    this.setState({
                        location: { value: locationValid.value, valid: valid },
                    });
                }
                if (descriptionValid.value === "") {
                    valid = false;
                    this.setState({
                        description: { value: descriptionValid.value, valid: valid },
                    });
                }
            }
            else {
                const step = this.state.step + 1;   //If all fields are valid, moves on to step 1 "schedule".
                this.setState({ step, });
            }
        }
        else if (this.state.step === 1) {   //Step 1 represents "schedule".
            if (this.state.isRecurrent.value === "recurring") { //If recurring, will display the according fields.
                //Checks validity of all fields.
                if (new Date(this.state.startDate) >= new Date(this.state.endDate) || this.state.recurrence === "" || this.state.startDate === null || this.state.endDate === null || this.state.daysSelected.length === 0) {
                    if (new Date(this.state.startDate) >= new Date(this.state.endDate) || this.state.startDate === null || this.state.endDate === null) {   //Invalid date fields.
                        this.setState({ dateValid: '#c4183c', });
                        this.setState({ dateValidLabel: 'visible', });
                    }
                    if (this.state.recurrence === "") { //Invalid recurrence field.
                        this.setState({ recurrenceValid: '#c4183c', });
                        this.setState({ recurrenceValidLabel: 'visible', });
                    }
                    if (this.state.daysSelected.length === 0) { //Invalid weekday selected field.
                        this.setState({ daysSelectedValid: '#c4183c', });
                        this.setState({ daysSelectedValidLabel: 'visible', });
                    }
                    if (this.state.startDate !== null && this.state.endDate !== null) { //User corrected the invalid date fields.
                        this.setState({ dateValid: 'black', });
                        this.setState({ dateValidLabel: 'hidden', });
                    }
                    if (this.state.recurrence !== "") { //User corrected the invalid recurrence field.
                        this.setState({ recurrenceValid: 'black', });
                        this.setState({ recurrenceValidLabel: 'hidden', });
                    }
                    if (this.state.daysSelected.length !== 0) { //User corrected the invalid weekday selected field.
                        this.setState({ daysSelectedValid: 'black', });
                        this.setState({ daysSelectedValidLabel: 'hidden', });
                    }
                }
                else {  //All fields are valid, removes any error alerts and moves on to step 2 (final step) "Summary".
                    this.setState({ dateValid: 'black', });
                    this.setState({ dateValidLabel: 'hidden', });
                    this.setState({ recurrenceValid: 'black', });
                    this.setState({ recurrenceValidLabel: 'hidden', });
                    this.setState({ daysSelectedValid: 'black', });
                    this.setState({ daysSelectedValidLabel: 'hidden', });
                    const step = this.state.step + 1;
                    this.setState({ step, });
                }
            }
            else {  //If non-recurring, will display the according fields.
                if (new Date(this.state.startDate) >= new Date(this.state.endDate) || this.state.startDate === null || this.state.endDate === null) {
                    //CODE TO MAKE FIELDS UNVALID NON-RECURRING
                    if (new Date(this.state.startDate) >= new Date(this.state.endDate) || this.state.startDate === null || this.state.endDate === null) { //Invalid date fields.
                        this.setState({ dateValidNonRecurr: '#c4183c', });
                        this.setState({ dateValidLabelNonRecurr: 'visible', });
                    }
                    if (this.state.startDate !== null && this.state.endDate !== null) { //User corrected the invalid date fields.
                        this.setState({ dateValidNonRecurr: 'black', });
                        this.setState({ dateValidLabelNonRecurr: 'hidden', });
                    }
                } else {    //All fields are valid, removes any error alerts and moves on to step 2 (final step) "Summary".
                    this.setState({ dateValidNonRecurr: 'black', });
                    this.setState({ dateValidLabelNonRecurr: 'hidden', });
                    const step = this.state.step + 1;
                    this.setState({ step, });
                }
            }
        }
    }

    //This method takes care of moving to the previous step of the create event modal.
    prevStep() {
        if (this.state.allDay === true) {   //If non-recurring event lasts all day, reset the "Schedule" step field's state.
            this.setState({
                allDay: false,
                startDate: null,
                endDate: null,
            });
        }
        const step = this.state.step - 1;   //Decrements step counter to go to previous step of create event modal.
        this.setState({ step, });
    }

    //This method creates a user account.
    createAccount() {
        const emailRegex = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i;
        const username = this.state.createUserName.value;
        const password = this.state.createPassword.value;
        const email = this.state.createEmail.value;
        const name = this.state.createName.value;
        const confirm = this.state.createConfirmPassword.value;

        //Checks: if fields are empty, if email input respects email format, and if passwords match.
        if (name !== "" && email !== "" && emailRegex.test(email) && username !== "" && password !== "" && confirm !== "" && password === confirm) {
            let user = {    //Create user object from the provided user info, note that new user is not an admin by default.
                name: name,
                username: username,
                email: email,
                admin: false,
                password: password
            }
            axios.post('/users', user)  //Sends user object to be added in database.
                .then(response => {
                    this.displayLogIn(); //Goes back to log in page.
                    toast.success("Woohoo, your account has been created!", {
                        position: "top-center",
                        autoClose: 4000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggablePercent: 60,
                        closeButton: false,
                    })
                })
                .catch(error => {
                    if (error.response.data.toString() === "Bad Request") { //Alerts the user of an error 400 (bad request).
                        toast.error("The account was not created, please try again later.", {
                            position: "top-center",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggablePercent: 60,
                            closeButton: false,
                        })
                    }
                    else {  //Alerts the user of error 500 (user email already exists in database).
                        toast.error(error.response.data, {
                            position: "top-center",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggablePercent: 60,
                            closeButton: false,
                        })
                    }
                })
        }
        else {  //If any of the fields is not valid, check which one and set their valid state to false.
            if (name === "") {
                this.setState({
                    createName: { value: "", valid: false },
                });
            }
            if (email === "" || !emailRegex.test(email)) {
                this.setState({
                    createEmail: { value: "", valid: false },
                });
            }
            if (username === "") {
                this.setState({
                    createUserName: { value: "", valid: false },
                });
            }
            if (password === "") {
                this.setState({
                    createPassword: { value: "", valid: false },
                });
            }
            if (password !== confirm || confirm === "") {
                this.setState({
                    createConfirmPassword: { value: "", valid: false },
                });
            }
        }
    }

    //This method is triggered when the user logs in.
    handleLoginSubmit() {
        const username = this.state.username.value;
        const password = this.state.password.value;
        if (username !== "" && password !== "") {   //Makes sure that log in fields are valid.
            axios.post('/login', { username: username, password: password })
                .then(response => { //Sends credentials to backend, cookie created, and reload to main page.
                    window.location.reload();
                })
                .catch(error => {
                    if (error.response.status.toString() === "401") {   //Alerts user of error 401 (wrong password, but username exists).
                        toast.error('The username or password you entered is incorrect.', {
                            position: "top-center",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggablePercent: 60,
                            closeButton: false,
                        })
                    }
                    else if (error.response.status.toString() === "404") {  //Alerts the user of error 404 (username does not exist in database).
                        toast.error('The username entered does not match any account.', {
                            position: "top-center",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggablePercent: 60,
                            closeButton: false,
                        })
                    } else {
                        //console.log(error);   for development purposes.
                    }
                });
        }
        else {  //If log in fields are invalid, find which and alert the user.
            if (username === "") {
                this.setState({
                    username: { value: "", valid: false },
                });
            }
            if (username === "") {
                this.setState({
                    password: { value: "", valid: false },
                });
            }
        }
    }

    //This method acts as the handler for the fields in the step 1 of the create event modal.
    handleChange(event) {
        const target = event.target;
        let valid = true;
        //Regex for name and location are *hugeeeee* cuz of accents #frenchgang.
        if (target.name === "name" && !/^[#/&a-z,.()àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœA-Z0-9- ]*$/.test(target.value)) {
            valid = false;
        }
        else if (target.name === "capacity" && /\D+/.test(target.value)) {  //Regex makes sure that capacity value is numeric.
            valid = false;
        }
        else if (target.name === "location" && /[^,.()#/$àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœA-Za-z0-9- ]+/.test(target.value)) {
            valid = false;
        }
        this.setState({ [target.name]: { value: target.value, valid: valid }, });   //Set state to reflect if fields are valid or not.
    }

    //This method acts as a handler for when the event recurrence changes.
    handleRecurrenceChange(event) {
        this.setState({ recurrence: event.target.value, });
    }

    //This method converts the week day selected when creating an event to its index in the week -> used in splitEvent() method.
    weekDaysToNumbers(dayINeed) {
        let number = 0;
        if (dayINeed === "Monday") {
            number = 1;
        } else if (dayINeed === "Tuesday") {
            number = 2;
        } else if (dayINeed === "Wednesday") {
            number = 3;
        } else if (dayINeed === "Thursday") {
            number = 4;
        } else if (dayINeed === "Friday") {
            number = 5;
        }
        return number
    }

    //This method creates an event.
    createEvent() {
        let sDate = moment(this.state.startDate).format();  //Start date.
        let eDate = moment(this.state.endDate).format();    //End date.
        let aDate = moment(this.state.startDate).add(1, 'days').format();   //Activation date, default sets it to 1 day after start date.
        let eventCalendarInfo = {   //Calendar info object contains the *only* event fields accepted by react-big-calendar.
            title: this.state.name.value,
            allDay: false,
            start: new Date(sDate),
            end: new Date(eDate)
        }
        let newEvent = {    //New event object contains all of the event fields accepted (calendar info object) or not (remaining fields) by react-big-calendar.
            capacity: this.state.capacity.value,
            description: this.state.description.value,
            location: this.state.location.value,
            allDay: this.state.allDay,
            activationDay: new Date(aDate),
            instructor: this.state.login.name,
            registeredEmail: this.state.registerEvents,
            calendarInfo: eventCalendarInfo,
        }
        let events = this.splitEvent(newEvent); //This method returns an event list if recurring, or returns newEvent unchanged if non-recurring.
        axios.post('/events', events)   //Create the new event in the database.
            .then(response => {
                this.fetchEvents();    //This method updates the event list displayed to reflect the newly created event.
                this.setState({    //Clear out the event field's states from the create event modal.
                    name: { value: "", valid: true },
                    description: { value: "", valid: true },
                    location: { value: "", valid: true },
                    capacity: { value: 0, valid: true },
                    daysSelected: [],
                    isRecurrent: { value: "", valid: true },
                    recurrence: "",
                    allDay: false,
                    startDate: null,
                    endDate: null,
                    activationDay: null,
                    instructor: "",
                    step: 0,
                });
                this.toggleCreateEventModal(); //Closes the create event modal.
                toast.success('The event was created.', {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggablePercent: 60,
                    closeButton: false,
                })
            })
            .catch(error => {
                //console.log(error);   for development purposes.
            });
    }

    //This method sets the activation day of an event so that all users can view, and register for it.
    activateEvent() {
        axios.put('/events/' + this.state.currentEventId, { activationDay: new Date(this.state.activationDay) })  //Modifies the activationDay field of the selected event using its id.
            .then(response => {
                this.fetchEvents();    //This method updates the event list displayed to reflect the new changes.
            })
            .catch(error => {
                //console.log(error);   for development purposes.
            });
        this.setState({
            activationDay: null,
            activateToday: false,
        });
        this.toggleActivateModal(); //Closes activation modal.
    }

    //This method edits the event information.
    editEvent() {
        axios.get('/events/' + this.state.currentEventId)    //Get specific event from database.
            .then(response => {
                axios.put('/events/' + this.state.currentEventId, { //Update event fields in database.
                    calendarInfo: {
                        title: this.state.name.value,
                        allDay: false,
                        start: new Date(this.state.startDate),
                        end: new Date(this.state.endDate)
                    },
                    capacity: this.state.capacity.value,
                    description: this.state.description.value,
                    location: this.state.location.value,
                    activationDay: new Date(this.state.activationDay)
                })
                    .then(response => {
                        this.fetchEvents();  //This method updates the event list displayed to reflect the new changes.
                        this.setState({  //Clear out the event field's states from the edit event modal.
                            name: { value: "", valid: true },
                            description: { value: "", valid: true },
                            location: { value: "", valid: true },
                            capacity: { value: 0, valid: true },
                            allDay: false,
                            activateToday: false,
                            startDate: null,
                            endDate: null,
                            activationDay: null,
                            daysSelected: [],
                            isRecurrent: { value: "", valid: true },
                            recurrence: "",
                            currentEventId: null,
                            viewModal: !this.state.viewModal,
                        });
                        toast.success('The event was modified.', {
                            position: "top-center",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggablePercent: 60,
                            closeButton: false,
                        });
                    })
                    .catch(error => {
                        //console.log(error);   for development purposes.
                    });
            })
            .catch(error => {
                //console.log(error);   for development purposes.
            })
    }

    //This method executes as soon as the page loads.
    componentWillMount() {
        let user = {};
        axios.get('/info')  //Gets the username (full name) and admin status of the logged in user.
            .then(response => {
                user.username = response.data.username;
                user.name = response.data.name;
                user.admin = response.data.admin;
                this.setState({ login: user, });
                this.fetchEvents();    //This method will fetch and display the most recent events.
            })
            .catch(error => {
                this.setState({ login: {}, });    //If fails to get logged in user info, goes back to log in page.
            });
    }

    //This method deletes an event using the event (child) id.
    deleteEvent() {
        axios.delete('/events/' + this.state.currentEventId)
            .then(res => {
                this.fetchEvents();    //This method updates the event list displayed to reflect the new changes.
                this.toggleDeleteModal();   //Close the delete event modal.
                toast.success('The event was deleted.', {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggablePercent: 60,
                    closeButton: false,
                });
            })
            .catch(error => {
                //console.log(error);   for development purposes.
            });
    }

    //This method splits recurring events to many events, or simply returns the event list "event" past as param if non-recurring event.
    splitEvent(event) {
        let eventList = [];
        let hours = moment(event.calendarInfo.start).hour();    //Gets start time.
        let delta = moment(event.calendarInfo.end).subtract(hours, 'hours');    //Event duration (delta) is found by subtracting start time from end time.
        if (this.state.isRecurrent.value === "recurring") { //Converts the recurrence option (string) to its equivalent number (integer).
            let recurrenceWeeks = 0;
            if (this.state.recurrence === "Weekly") {
                recurrenceWeeks = 1;
            }
            else if (this.state.recurrence === "Biweekly") {
                recurrenceWeeks = 2;
            }
            else if (this.state.recurrence === "Triweekly") {
                recurrenceWeeks = 3;
            }
            else if (this.state.recurrence === "Monthly") {
                recurrenceWeeks = 4;
            }
            let i = 0;
            outer:
            while (true) {
                for (let z = 0; z < this.state.daysSelected.length; z++) {
                    let dayINeed = this.state.daysSelected[z];
                    if (new Date(moment().add(i, 'weeks').isoWeekday(this.weekDaysToNumbers(dayINeed))) > new Date(moment(event.calendarInfo.end))) {
                        break outer;
                    } else {
                        let s2Date = moment(event.calendarInfo.start).add(i, 'weeks').isoWeekday(this.weekDaysToNumbers(dayINeed));
                        let e2Date = moment(event.calendarInfo.start).add(i, 'weeks').isoWeekday(this.weekDaysToNumbers(dayINeed)).add(delta.hours(), "hours").add(delta.minutes(), "minutes");
                        let a2Date = moment(event.calendarInfo.start).add(i, 'weeks').isoWeekday(this.weekDaysToNumbers(dayINeed)).add(1, 'days');
                        if (s2Date >= moment(event.calendarInfo.start)) {
                            let newEvent = {
                                capacity: event.capacity,
                                description: event.description,
                                location: event.location,
                                allDay: event.allDay,
                                activationDay: new Date(a2Date.format()),
                                instructor: event.instructor,
                                calendarInfo: {
                                    title: event.calendarInfo.title,
                                    allDay: false,
                                    start: new Date(s2Date.format()),
                                    end: new Date(e2Date.format())
                                }
                            }
                            eventList = eventList.concat(newEvent);
                        }
                    }
                }
                i += recurrenceWeeks;
            }
            return eventList;
        } else {
            return [event];
        }
    }

    //This method updates the event list displayed to reflect new changes.
    fetchEvents() {
        axios.get('/events')
            .then(response => {
                response.data.forEach(events => {
                    events.data.forEach(event => {  //The event dates need to be converted to JS date type before being displayed.
                        event.calendarInfo.start = new Date(event.calendarInfo.start);
                        event.calendarInfo.end = new Date(event.calendarInfo.end);
                        event.activationDay = new Date(event.activationDay);
                    })
                });
                this.setState({ events: response.data });    //Update the state of the events list.
            })
            .catch(error => {
                //console.log(error);   for development purposes.
            })
    }

    //This method notifies the user registered to an event by sending them an announcement via email.
    notifyEvent(event) {
        event.preventDefault();
        axios.get('/events/' + this.state.currentEventId)   //Gets a specific event from database using its id.
            .then(response => {
                let startDateNotifyEmail = moment(this.state.startDate).format('LLLL')   //Adjusts the format of the event date so that it's readable in an email.
                let data = {    //Creates an object with all of the information required to send the announcement.
                    notifyFullName: this.state.login.name,
                    notifyEmailSender: this.state.email.value,
                    notifyEmailRecepients: response.data.registeredEmail,
                    notifyMessage: this.announceMessage.current.value,
                    notifyEventName: this.state.name.value,
                    notifyEventStart: startDateNotifyEmail.toString(),
                }
                axios.post('/notification', data)   //Send announcement data object to backend.
                    .then(
                        this.toggleAnnounceModal(),  //Close the announce modal.
                        toast.success('The announcement was sent to the participants of your event.', {
                            position: "top-center",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggablePercent: 60,
                            closeButton: false,
                        }))
                    .catch(error => {
                        //console.log(error);   for development purposes.
                    });
                document.getElementById("announceModal").reset();   //Clears our the announce message.
            })
            .catch(error => {
                //console.log(error);   for development purposes.
            })
    }

    render() {
        let wizardContentCreate;
        if (this.state.step === 0) {
            wizardContentCreate =
                <fieldset>
                    <Row className="create-event-container">
                        <Col xs="6" sm="6" md="6" lg="6">
                            <Row>
                                <label>Name</label>
                                <Input autoComplete="off" name="name" value={this.state.name.value} onChange={this.handleChange} className={this.state.name.valid ? "form-control" : "form-control is-invalid"} placeholder="What will it be called?" />
                                <div className="invalid-feedback">Alphanumeric and can't be empty.</div>
                            </Row>
                            <Row>
                                <label>Capacity</label>
                                <Input autoComplete="off" name="capacity" value={String(this.state.capacity.value)} onChange={this.handleChange} className={this.state.capacity.valid ? "form-control" : "form-control is-invalid"} placeholder="How many people?" />
                                <div className="invalid-feedback">Numbers and can't be empty.</div>
                            </Row>
                            <Row>
                                <label>Location</label>
                                <Input autoComplete="off" name="location" value={this.state.location.value} onChange={this.handleChange} className={this.state.location.valid ? "form-control" : "form-control is-invalid"} placeholder="Where will it take place?" />
                                <div className="invalid-feedback">Alphanumeric and can't be empty.</div>
                            </Row>
                            <Row>
                                <label>Recurrence</label>
                                <fieldset className="create-event-recurrence-dropdown">
                                    <select className={this.state.isRecurrent.valid ? "custom-select w-100" : "custom-select w-100 is-invalid"} name="isRecurrent" value={this.state.isRecurrent.value} onChange={this.handleChange}>
                                        <option disabled='disabled' value="">Will it be a recurring event?</option>
                                        <option value="recurring">Yes</option>
                                        <option value="non-recurring">No</option>
                                    </select>
                                    <div className="invalid-feedback">Recurrence type is required.</div>
                                </fieldset>
                            </Row>
                        </Col>
                        <Col xs="6" sm="6" md="6" lg="6">
                            <Row className="create-event-description-row">
                                <label>Description</label>
                                <textarea name="description" value={this.state.description.value} onChange={this.handleChange} className={this.state.description.valid ? "form-control create-event-description" : "form-control is-invalid create-event-description"} placeholder="What will it be about?" rows={5} />
                                <div className="invalid-feedback">Can't be empty.</div>
                            </Row>
                        </Col>
                    </Row>
                </fieldset>;
        } else if (this.state.step === 1) {
            if (this.state.isRecurrent.value === "recurring") {
                wizardContentCreate =
                    <fieldset>
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12">
                                <label className="inputName" style={{ color: this.state.dateValid }}>Date & time</label>
                                <div className="input-daterange input-group" id="datepicker-example-2">
                                    <span className="input-group-append create-event-date-picker-icon">
                                        <span className="input-group-text create-event-date-picker-icon">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                    </span>
                                    <DatePicker
                                        className="input-sm form-control create-event-date-picker"
                                        name="start"
                                        placeholderText="Start date"
                                        selected={this.state.startDate}
                                        onChange={this.handleChangeStart}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        minDate={moment()}
                                        minTime={moment().hours(9).minutes(0)}
                                        maxTime={moment().hours(17).minutes(45)}
                                        dateFormat="LLL"
                                        readOnly
                                    />
                                    <DatePicker
                                        className="input-sm form-control create-event-date-picker"
                                        name="end"
                                        placeholderText="End date"
                                        selected={this.state.endDate}
                                        onChange={this.handleChangeEnd}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        minDate={this.minMaxTime()}
                                        minTime={this.startTime()}
                                        maxTime={moment().hours(18).minutes(0)}
                                        dateFormat="LLL"
                                        readOnly
                                    />
                                    <span className="input-group-prepend create-event-enddate-picker-icon">
                                        <span className="input-group-text create-event-enddate-picker-icon">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                    </span>
                                    <div className="invalid-input" style={{ visibility: this.state.dateValidLabel }}>Start and end dates are required</div>
                                </div>
                            </Col>
                        </Row><br />
                        <Row className="create-event-row">
                            <Col xs="10" sm="10" md="10" lg="10">
                                <label className="inputName" style={{ color: this.state.recurrenceValid }}>Recurrence</label>
                                <ButtonGroup>
                                    <Button className="create-event-recurrence-radio" color="secondary" onClick={() => this.updateRecurrence("Weekly")} active={this.state.recurrence === "Weekly"}>Weekly</Button>
                                    <Button className="create-event-recurrence-radio" color="secondary" onClick={() => this.updateRecurrence("Biweekly")} active={this.state.recurrence === "Biweekly"}>Biweekly</Button>
                                    <Button className="create-event-recurrence-radio" color="secondary" onClick={() => this.updateRecurrence("Triweekly")} active={this.state.recurrence === "Triweekly"}>Triweekly</Button>
                                    <Button className="create-event-recurrence-radio" color="secondary" onClick={() => this.updateRecurrence("Monthly")} active={this.state.recurrence === "Monthly"}>Monthly</Button>
                                </ButtonGroup>
                                <div className="invalid-input" style={{ visibility: this.state.recurrenceValidLabel }}>Recurrence type is required</div>
                            </Col>
                        </Row><br />
                        <Row className="create-event-row">
                            <Col xs="10" sm="10" md="10" lg="10">
                                <label className="inputName" style={{ color: this.state.daysSelectedValid }}>Weekday</label>
                                <ButtonGroup name="weeklyOcurrence">
                                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Monday")} active={this.state.daysSelected.includes("Monday")}>Monday</Button>
                                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Tuesday")} active={this.state.daysSelected.includes("Tuesday")}>Tuesday</Button>
                                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Wednesday")} active={this.state.daysSelected.includes("Wednesday")}>Wednesday</Button>
                                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Thursday")} active={this.state.daysSelected.includes("Thursday")}>Thursday</Button>
                                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Friday")} active={this.state.daysSelected.includes("Friday")}>Friday</Button>
                                </ButtonGroup>
                                <div className="invalid-input" style={{ visibility: this.state.daysSelectedValidLabel }}>Weekday is required</div>
                            </Col>
                        </Row>
                    </fieldset>;
            } else {
                wizardContentCreate =
                    <fieldset>
                        <Row className="create-event-row">
                            <Col xs="8" sm="8" md="8" lg="8">
                                <label className="inputName">Type of event</label>
                                <fieldset>
                                    <div className="custom-control custom-toggle d-block my-2">
                                        <input type="checkbox" id="customToggle1" name="allDay" onClick={() => this.onRadioBtnClick()} className="custom-control-input" />
                                        <label className="custom-control-label" htmlFor="customToggle1">Will your event last all day?</label>
                                    </div>
                                </fieldset>
                            </Col>
                        </Row><br />
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12">
                                <label className="inputName" style={{ color: this.state.dateValidNonRecurr }}>Date & time</label>
                                <div className="input-daterange input-group" id="datepicker-example-2">
                                    <span className="input-group-append create-event-date-picker-icon">
                                        <span className="input-group-text create-event-date-picker-icon">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                    </span>
                                    <DatePicker
                                        className="input-sm form-control create-event-date-picker"
                                        name="start"
                                        placeholderText="Start date"
                                        selected={this.state.startDate}
                                        onChange={this.handleChangeStart}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        minDate={moment()}
                                        minTime={moment().hours(9).minutes(0)}
                                        maxTime={moment().hours(17).minutes(45)}
                                        dateFormat="LLL"
                                        readOnly
                                    />
                                    <DatePicker
                                        className="input-sm form-control create-event-date-picker"
                                        name="end"
                                        placeholderText="End date"
                                        selected={this.state.endDate}
                                        onChange={this.handleChangeEnd}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        minDate={this.minMaxTime()}
                                        maxDate={this.minMaxTime()}
                                        minTime={this.startTime()}
                                        maxTime={moment().hours(18).minutes(0)}
                                        dateFormat="LLL"
                                        readOnly
                                    />
                                    <span className="input-group-prepend create-event-enddate-picker-icon">
                                        <span className="input-group-text create-event-enddate-picker-icon">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                    </span>
                                </div>
                                <div className="invalid-input" style={{ visibility: this.state.dateValidLabelNonRecurr }}>Start and end dates are required</div>
                            </Col>
                        </Row>
                    </fieldset>;
            }
        } else {
            if (this.state.isRecurrent.value === "non-recurring") {
                wizardContentCreate =
                    <fieldset>
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12">
                                <i className="fa fa-check-circle icon-pass cycle-status create-event-summary-icon"></i>
                                <label className="create-event-summary-name">{this.state.name.value}</label>
                                <ul className="create-event-summary-list">
                                    <li><span>Instructor:</span> <span>{this.state.login.name}</span></li>
                                    <li><span>Capacity:</span> <span>{String(this.state.capacity.value)}</span></li>
                                    <li><span>Type of event:</span> <span>Non-recurring</span></li>
                                    <li><span>Time & date:</span> <span>{moment(this.state.startDate).format("dddd [,] MMMM Do YYYY")} from {moment(this.state.startDate).format("H:mm")} to {moment(this.state.endDate).format("H:mm")}</span></li>
                                    <li><span>Location:</span> <span>{this.state.location.value}</span></li>
                                    <li><span>Description:</span> <span>{this.state.description.value}</span></li>
                                </ul>
                                <hr />
                            </Col>
                        </Row>
                    </fieldset>;
            } else if (this.state.isRecurrent.value === "recurring") {
                wizardContentCreate =
                    <fieldset>
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12">
                                <i className="fa fa-check-circle icon-pass cycle-status create-event-summary-icon"></i>
                                <label className="create-event-summary-name">{this.state.name.value}</label>
                                <ul className="create-event-summary-list">
                                    <li><span>Instructor:</span> <span>{this.state.login.name}</span></li>
                                    <li><span>Capacity:</span> <span>{this.state.capacity.value}</span></li>
                                    <li><span>Type of event:</span> <span>Recurring</span></li>
                                    <li><span>Day of the week:</span> <span>{this.state.daysSelected.join(", ")}</span></li>
                                    <li><span>Time:</span> <span>From {moment(this.state.startDate).format("H:mm")} to {moment(this.state.endDate).format("H:mm")}</span></li>
                                    <li><span>Recurring basis:</span> <span>{this.state.recurrence} from {moment(this.state.startDate).format("MMMM Do YYYY")} to {moment(this.state.endDate).format("MMMM Do YYYY")}</span></li>
                                    <li><span>Location:</span> <span>{this.state.location.value}</span></li>
                                    <li><span>Description:</span> <span>{this.state.description.value}</span></li>
                                </ul>
                                <hr />
                            </Col>
                        </Row>
                    </fieldset>;
            }
        }
        if (this.state.login.username === "default") {
            return (
                <div className='sweet-loading app-loader'>
                    <PulseLoader
                        color={'#D73636'}
                        loading={true}
                        size={50}
                    />
                </div>
            )
        } else if (this.state.login.username === "account") {
            return (
                <div className="section-invert">
                    <div className="py-4 create-account-container">
                        <div className="container py-4">
                            <div className="row justify-content-md-center px-4">
                                <div className="col-sm-12 col-md-7 col-lg-5 p-4 mb-4 card">
                                    <form>
                                        <h3 className="create-account-label"> Create An Account </h3>
                                        <Row>
                                            <div className="col-md-12 col-sm-12">
                                                <div className="form-group create-account-elements-container">
                                                    <label htmlFor="name" className="create-account-elements">Full name</label>
                                                    <Input autoComplete="off" type="text" name="createName" value={this.state.createName.value} onChange={this.handleChange} className={this.state.createName.valid ? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Enter your full name" />
                                                    <div className="invalid-feedback create-account-elements">Name can't be left empty.</div>
                                                </div>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className="col-md-12 col-sm-12">
                                                <div className="form-group create-account-elements-container">
                                                    <label htmlFor="email" className="create-account-elements">Email</label>
                                                    <Input autoComplete="off" type="text" name="createEmail" value={this.state.createEmail.value} onChange={this.handleChange} className={this.state.createEmail.valid ? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Enter your email" />
                                                    <div className="invalid-feedback create-account-elements">Email format should be a@b.c.</div>
                                                </div>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className="col-md-12 col-sm-12">
                                                <div className="form-group create-account-elements-container">
                                                    <label htmlFor="username" className="create-account-elements">Username</label>
                                                    <Input autoComplete="off" type="text" name="createUserName" value={this.state.createUserName.value} onChange={this.handleChange} className={this.state.createUserName.valid ? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Enter your username" />
                                                    <div className="invalid-feedback create-account-elements">Username can't be left empty.</div>
                                                </div>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className="col-md-12 col-sm-12">
                                                <div className="form-group create-account-elements-container">
                                                    <label htmlFor="password" className="create-account-elements">Password</label>
                                                    <Input autoComplete="off" type="password" name="createPassword" value={this.state.createPassword.value} onChange={this.handleChange} className={this.state.createPassword.valid ? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Enter your password" />
                                                    <div className="invalid-feedback create-account-elements">Password can't be left empty.</div>
                                                </div>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className="col-md-12 col-sm-12">
                                                <div className="form-group reate-account-elements-container">
                                                    <label htmlFor="confirmPassword" className="create-account-elements">Confirm your password</label>
                                                    <Input autoComplete="off" type="password" name="createConfirmPassword" value={this.state.createConfirmPassword.value} onChange={this.handleChange} className={this.state.createConfirmPassword.valid ? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Confirm your password" />
                                                    <div className="invalid-feedback create-account-elements">Passwords do not match.</div>
                                                </div>
                                            </div>
                                        </Row>
                                        <input className="btn btn-primary d-flex ml-auto mr-auto create-account-button" onClick={this.createAccount} type="button" value="Create"></input>
                                    </form>
                                </div>
                            </div>
                            <p className="switch-login-createaccount-link" onClick={this.displayLogIn}> Return to log in </p>
                            <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false} />
                        </div>
                    </div>
                </div>
            )
        } else if (!this.state.login.username) {
            return (
                <div className="section-invert">
                    <div className="py-4 log-in-container">
                        <div className="container py-4">
                            <div className="row justify-content-md-center px-4">
                                <div className="col-sm-12 col-md-7 col-lg-5 p-4 mb-4 card">
                                    <form>
                                        <h3 className="log-in-label"> Umba </h3>
                                        <Row>
                                            <div className="col-md-12 col-sm-12">
                                                <div className="form-group log-in-form">
                                                    <label htmlFor="username" className="log-in-elements">Username</label>
                                                    <Input autoComplete="off" type="text" name="username" value={this.state.username.value} onChange={this.handleChange} className={this.state.username.valid ? "form-control log-in-elements" : "form-control is-invalid log-in-elements"} placeholder="Enter your username"></Input>
                                                    <div className="invalid-feedback log-in-elements">Username can't be left empty.</div>
                                                </div>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className="col-md-12 col-sm-12">
                                                <div className="form-group log-in-form">
                                                    <label htmlFor="password" className="log-in-elements">Password</label>
                                                    <Input autoComplete="off" type="password" name="password" value={this.state.password.value} onChange={this.handleChange} className={this.state.password.valid ? "form-control log-in-elements" : "form-control is-invalid log-in-elements"} placeholder="Enter your password"></Input>
                                                    <div className="invalid-feedback log-in-elements">Password can't be left empty.</div>
                                                </div>
                                            </div>
                                        </Row>
                                        <input className="btn btn-primary d-flex ml-auto mr-auto log-in-button" onClick={this.handleLoginSubmit} type="button" value="Log In"></input>
                                    </form>
                                </div>
                            </div>
                            <p className="switch-login-createaccount-link" onClick={this.displayCreateAccount}> Create an account </p>
                            <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false} />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {/*<----------------------- NAVBAR ----------------------->*/}
                    <div className="welcome d-flex justify-content-center flex-column">
                        <div className="container">
                            <nav className="navbar navbar-expand-lg navbar-dark pt-4 px-0">
                                <a className="app-name">
                                    Umba
                            </a>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <a onClick={this.logOut} className="nav-link app-logout-button">Log Out</a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        {/*<----------------------- MAIN PAGE ----------------------->*/}
                        <div className="inner-wrapper mt-auto mb-auto container">
                            <div className="row">
                                <div className="col-md-7">
                                    <h1 className="welcome-heading display-4 text-white">Hello {this.findFirstName(this.state.login.name)}</h1>
                                    <label className="app-welcome-subheading">Scroll down to get started</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<----------------------- CALENDAR PAGE ----------------------->*/}
                    <div id="our-services" className="our-services section py-4">
                        <div className="app-counter-alert">
                            {this.state.secondsElapsed > 0 &&
                                (<Alert color="primary" isOpen={this.state.visible} fade={false}>
                                    <div>
                                        <h4 className="app-stopwatch-timer">Time left to register for added events: {formattedSeconds(this.state.secondsElapsed)}</h4>
                                    </div>
                                </Alert>)}
                            {this.state.secondsElapsed === 0 &&
                                (this.unRegisterEvent())}
                        </div>
                        <h3 className="section-title text-center my-5">Your Schedule</h3>
                        <div className="container py-4">
                            <div className="row justify-content-md-center px-4">
                                <div className="contact-form col-sm-12 col-md-12 col-lg-12 p-4 mb-4 card">
                                    <Row>
                                        <Col xs="12" sm="12" md="12" lg="12">
                                            <div className="calendar-main">
                                                <BigCalendar
                                                    selectable={true}
                                                    min={new Date('2018, 1, 7, 09:00')}
                                                    max={new Date('2018, 1, 7, 18:00')}
                                                    defaultView='week'
                                                    onSelectEvent={(obj) => this.toggleViewModal(obj)}
                                                    events={flatten2(this.state.events)}
                                                    startAccessor='start'
                                                    endAccessor='end'>
                                                </BigCalendar>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12" md="12" lg="12" className="calendar-my-events-col">
                                            <Button className="btn btn-secondary calendar-my-events-button" onClick={this.toggleRegisterModal}>My Events</Button>
                                            <label className="calendar-my-events-label" style={{ display: this.state.myEventsErrorLabel }}> No added events to show. </label>
                                        </Col>
                                    </Row>
                                    {/*<----------------------- EVENT CREATION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.createModal} toggle={this.toggleCreateEventModal} className={this.props.className}>
                                        <ModalHeader>
                                            <label className="create-event-new-event-label">New Event</label>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form>
                                                <Row>
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                        <Steps current={this.state.step}>
                                                            {steps.map(item => <Step key={item.title} title={item.title} />)}
                                                        </Steps>
                                                        <div className="create-event-steps-content">
                                                            {wizardContentCreate}
                                                        </div>
                                                        <div className="create-event-modal-button-container">
                                                            {
                                                                this.state.step > 0
                                                                && (<Button color="primary" className="create-event-modal-previous-button" onClick={() => this.prevStep()}> Previous </Button>)
                                                            }
                                                            {
                                                                this.state.step < steps.length - 1
                                                                && <Button color="primary" className="create-event-modal-next-button" type="submit" onClick={this.nextStep}>Next</Button>
                                                            }
                                                            {
                                                                this.state.step === steps.length - 1
                                                                && <Button color="primary" className="create-event-modal-create-button" type="button" onClick={() => this.createEvent()}>Create</Button>
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
                                    {/*<----------------------- EVENT SUBMIT MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.registerModal} toggle={this.toggleRegisterModal} className={this.props.className}>
                                        <ModalHeader>
                                            <label className="select-event-selected-event">Selected Events</label>
                                        </ModalHeader>
                                        <ModalBody>
                                            <form>
                                                {this.state.registerEvents.length > 0 &&
                                                    (
                                                        this.state.registerEvents.map((registerEvents, index) => {
                                                            let event = registerEvents;
                                                            if (event) {
                                                                return <Row key={index + 1}>
                                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                                        <i className="fa fa-check-circle icon-pass cycle-status submit-event-icon"></i>
                                                                        <label className="submit-event-name-label">{event.calendarInfo.title}</label>
                                                                        <i className="fas fa-times pull-right submit-event-remove-icon" onClick={() => this.unregisterFromSingleEvent(event._id)}></i>
                                                                        <ul className="submit-event-list">
                                                                            <li><span>Instructor:</span> <span>{event.instructor}</span></li>
                                                                            <li><span>Date:</span> <span>{moment(event.calendarInfo.start).format("dddd [,] MMMM Do YYYY")}</span></li>
                                                                            <li><span>Time:</span> <span>From {moment(event.calendarInfo.start).format("H:mm")} to {moment(event.calendarInfo.end).format("H:mm")}</span></li>
                                                                            <li><span>Location:</span> <span>{event.location}</span></li>
                                                                            <li><span>Capacity:</span> <span>{event.capacity}</span></li>
                                                                            <li><span>Description:</span> <span>{event.description}</span></li>
                                                                        </ul>
                                                                        <hr />
                                                                    </Col>
                                                                </Row>;
                                                            } else return null;
                                                        })
                                                    )}
                                            </form>
                                        </ModalBody>
                                        <ModalFooter>
                                            {(this.state.secondsElapsed !== 0 &&
                                                this.incrementer === this.state.lastClearedIncrementer
                                                ? <button type="button" className="btn btn-success pull-right" align="right" onClick={() => { this.registerForEvents() }}>Register</button>
                                                : null
                                            )}
                                        </ModalFooter>
                                    </Modal>
                                    {/*<----------------------- EVENT ANNOUNCE MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.announceModal} toggle={this.toggleAnnounceModal} className={this.props.className}>
                                        <form onSubmit={this.notifyEvent} id="announceModal">
                                            <ModalHeader>
                                                <label className="announce-event-announcement-label">Announcement</label>
                                            </ModalHeader>
                                            <ModalBody>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <textarea id="announceMessage" ref={this.announceMessage} className="form-control mb-4 announce-event-textarea" rows="10" required="required" placeholder="Enter your message..."></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <div className="announce-event-button">
                                                    <input className="btn btn-success announce-event-button" type="submit" value="Announce"></input>
                                                </div>
                                            </ModalFooter>
                                        </form>
                                    </Modal>
                                    {/*<----------------------- ADD ADMIN MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.addAdminModal} toggle={this.toggleAddAdminModal} className={this.props.className}>
                                        <ModalHeader>
                                            <label className="add-admin-label">Add Admin</label>
                                        </ModalHeader>
                                        <ModalBody>
                                            <label htmlFor="contactFormEmail">Search by email</label>
                                            <Row>
                                                <div className="col-md-9 col-sm-9 add-admin-input-email-container">
                                                    <input autoComplete="off" name="email" value={this.state.email.value} onChange={this.handleChangeSearchNewAdmin} className={this.state.email.valid ? "form-control add-admin-input-email" : "form-control is-invalid add-admin-input-email"} type="email" id="contactFormEmail" required="required" placeholder="Enter the new admin's email"></input>
                                                    <div className="invalid-feedback">Email address {this.state.email.value} doesn't exist, or is already an admin.</div>
                                                </div>
                                                <div className="col-md-3 col-sm-3 add-admin-search-button-container">
                                                    <Button className="add-admin-search-button" color="secondary light" onClick={() => { this.searchAdminEmail(this.state.email.value) }}>Search</Button>
                                                </div>
                                                <Col xs="12" sm="12" md="12" lg="12" className="add-admin-modal" style={{ display: this.state.newAdminSearchTable }}>
                                                    <Table className="add-admin-table">
                                                        <tbody>
                                                            <tr>
                                                                <td className="add-admin-user-top"><span className="add-admin-user-info">Name:</span></td>
                                                                <td className="add-admin-user-top"><span className="add-admin-user-info-data">{this.state.nameUserModal}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td><span className="add-admin-user-info">Username:</span></td>
                                                                <td><span className="add-admin-user-info-data">{this.state.userNameModal}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td><span className="add-admin-user-info">Email:</span></td>
                                                                <td><span className="add-admin-user-info-data">{this.state.emailUserModal}</span></td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </ModalBody>
                                        <ModalFooter className="add-admin-modal-footer" style={{ display: this.state.newAdminSearchTable }}>
                                            <div className="col-md-12 col-sm-12">
                                                <button type="button" className="btn btn-secondary pull-right" align="right" style={{ display: this.state.newAdminSearchTable }} onClick={() => { this.addAdmin() }}>Add</button>
                                            </div>
                                        </ModalFooter>
                                    </Modal>
                                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false} />
                                    {/*<----------------------- EVENT SELECTION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.viewModal} toggle={this.toggleViewModal} className={this.props.className}>
                                        <ModalHeader>
                                            {this.state.instructor !== this.state.login.name &&
                                                (<label className="select-event-view-header-label">{this.state.calendarInfo.title}</label>)}
                                            {this.state.instructor === this.state.login.name &&
                                                (<label className="select-event-edit-header-label">Edit Event</label>)}
                                        </ModalHeader>
                                        <ModalBody>
                                            {this.state.instructor !== this.state.login.name &&
                                                (<Row className="select-event-modal">
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                        <Table className="select-event-table">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="select-event-top"><span className="select-event-info">Instructor:</span></td>
                                                                    <td className="select-event-top"><span className="select-event-info-data">{this.state.instructor}</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><span className="select-event-info">Date:</span></td>
                                                                    <td><span className="select-event-info-data">{moment(this.state.calendarInfo.start).format("dddd [,] MMMM Do YYYY")}</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><span className="select-event-info">Time:</span></td>
                                                                    <td><span className="select-event-info-data">From {moment(this.state.calendarInfo.start).format("H:mm")} to {moment(this.state.calendarInfo.end).format("H:mm")}</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><span className="select-event-info">Location:</span></td>
                                                                    <td><span className="select-event-info-data">{this.state.location.value}</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><span className="select-event-info">Capacity:</span></td>
                                                                    <td><span className="select-event-info-data">{this.state.liveCapacity} / {this.state.capacity.value}</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><span className="select-event-info">Description:</span></td>
                                                                    <td><span className="select-event-info-data">{this.state.description.value}</span></td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </Col>
                                                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false} />
                                                </Row>)}
                                            {this.state.instructor === this.state.login.name &&
                                                (<Row>
                                                    <fieldset>
                                                        <Row className="select-event-row">
                                                            <Col xs="6" sm="6" md="6" lg="6">
                                                                <Row>
                                                                    <label className="select-event-edit-label-top">Name</label>
                                                                    <Input autoComplete="off" name="name" value={this.state.name.value} onChange={this.handleChange} className={this.state.name.valid ? "form-control" : "form-control is-invalid"} placeholder="What will it be called?" />
                                                                    <div className="invalid-feedback">Characters only and can't be empty.</div>
                                                                </Row>
                                                                <Row>
                                                                    <label className="select-event-edit-label-top">Capacity</label>
                                                                    <Input autoComplete="off" name="capacity" value={String(this.state.capacity.value)} onChange={this.handleChange} className={this.state.capacity.valid ? "form-control" : "form-control is-invalid"} placeholder="How many people?" />
                                                                    <div className="invalid-feedback">Numbers only and can't be empty.</div>
                                                                </Row>
                                                                <Row>
                                                                    <label className="select-event-edit-label-top">Location</label>
                                                                    <Input autoComplete="off" name="location" value={this.state.location.value} onChange={this.handleChange} className={this.state.location.valid ? "form-control" : "form-control is-invalid"} placeholder="Where will it take place?" />
                                                                    <div className="invalid-feedback">Alphanumeric only and can't be empty.</div>
                                                                </Row>
                                                                <Row>
                                                                    <label className="select-event-edit-label-top">Activation day</label>
                                                                    <div className="input-daterange input-group" id="datepicker-example-2">
                                                                        <span className="input-group-append select-event-date-picker-icon">
                                                                            <span className="input-group-text select-event-date-picker-icon">
                                                                                <i className="fa fa-calendar"></i>
                                                                            </span>
                                                                        </span>
                                                                        <DatePicker
                                                                            className="input-sm form-control select-event-date-picker"
                                                                            placeholderText="Activation date"
                                                                            selected={this.state.activationDay}
                                                                            onChange={this.handleChangeActivationDate}
                                                                            popperModifiers={{
                                                                                flip: {
                                                                                    enabled: false
                                                                                },
                                                                                preventOverflow: {
                                                                                    enabled: true,
                                                                                    escapeWithReference: false
                                                                                }
                                                                            }}
                                                                            showTimeSelect
                                                                            timeFormat="HH:mm"
                                                                            timeIntervals={15}
                                                                            minDate={moment()}
                                                                            dateFormat="LLL"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </Row>
                                                            </Col>
                                                            <Col xs="6" sm="6" md="6" lg="6">
                                                                <Row className="select-event-description-row">
                                                                    <label className="select-event-edit-label-top">Description</label>
                                                                    <textarea name="description" value={this.state.description.value} onChange={this.handleChange} className={this.state.description.valid ? "form-control select-event-description" : "form-control is-invalid select-event-description"} placeholder="What is your event about?"></textarea>
                                                                    <div className="invalid-feedback">Can't be empty.</div>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </fieldset>
                                                    <Col xs="12" sm="12" md="12" lg="12" className="select-event-edit-date-col">
                                                        <label className="select-event-edit-label">Date & time</label>
                                                        <div className="input-daterange input-group" id="datepicker-example-2">
                                                            <span className="input-group-append select-event-date-picker-icon">
                                                                <span className="input-group-text select-event-date-picker-icon">
                                                                    <i className="fa fa-calendar"></i>
                                                                </span>
                                                            </span>
                                                            <DatePicker
                                                                className="input-sm form-control create-event-date-picker"
                                                                name="start"
                                                                placeholderText="Start date"
                                                                selected={this.state.startDate}
                                                                onChange={this.handleChangeStart}
                                                                popperModifiers={{
                                                                    flip: {
                                                                        enabled: false
                                                                    },
                                                                    preventOverflow: {
                                                                        enabled: true,
                                                                        escapeWithReference: false
                                                                    }
                                                                }}
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={15}
                                                                minDate={moment()}
                                                                minTime={moment().hours(9).minutes(0)}
                                                                maxTime={moment().hours(17).minutes(45)}
                                                                dateFormat="LLL"
                                                                readOnly
                                                            />
                                                            <DatePicker
                                                                className="input-sm form-control create-event-date-picker"
                                                                name="end"
                                                                placeholderText="End date"
                                                                selected={this.state.endDate}
                                                                onChange={this.handleChangeEnd}
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={15}
                                                                minDate={this.minMaxTime()}
                                                                maxDate={this.minMaxTime()}
                                                                minTime={this.startTime()}
                                                                maxTime={moment().hours(18).minutes(0)}
                                                                dateFormat="LLL"
                                                                readOnly
                                                            />
                                                            <span className="input-group-prepend select-event-enddate-picker-icon">
                                                                <span className="input-group-text select-event-enddate-picker-icon">
                                                                    <i className="fa fa-calendar"></i>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                </Row>)}
                                        </ModalBody>
                                        <ModalFooter>
                                            {this.state.instructor !== this.state.login.name &&
                                                (<Col xs="12" sm="12" md="12" lg="12">
                                                    <Button className="select-event-add-button" color="primary" onClick={() => { this.addEventBasket(this.state.currentEventId) }}>Add</Button>
                                                    <label className="select-event-error-label" style={{ display: this.state.allReadyRegisteredErrorLabel }}> You're already registered to this event. </label>
                                                    <label className="select-event-error-label" style={{ display: this.state.fullCapacityErrorLabel }}> This event is already full. </label>
                                                </Col>)}
                                            {this.state.instructor === this.state.login.name &&
                                                (<Button color="warning" onClick={() => { this.editEvent() }}>Save</Button>)}
                                        </ModalFooter>
                                    </Modal>
                                    {/*<----------------------- EVENT ACTIVATION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.activateModal} toggle={this.toggleActivateModal} className={this.props.className}>
                                        <ModalHeader>
                                            <label className="activate-event-label">Activate Event</label>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Row >
                                                <Col xs="8" sm="8" md="8" lg="8">
                                                    <fieldset>
                                                        <div className="custom-control custom-toggle d-block my-2">
                                                            <input type="checkbox" id="customToggle1" name="activateToday" onClick={() => this.onRadioBtnActivateClick()} className="custom-control-input" />
                                                            <label className="custom-control-label" htmlFor="customToggle1">Today</label>
                                                        </div>
                                                    </fieldset>
                                                </Col>
                                            </Row><br />
                                            <Row>
                                                <Col xs="12" sm="12" md="12" lg="12">
                                                    <div className="input-daterange input-group" id="datepicker-example-2">
                                                        <span className="input-group-append create-event-date-picker-icon">
                                                            <span className="input-group-text create-event-date-picker-icon">
                                                                <i className="fa fa-calendar"></i>
                                                            </span>
                                                        </span>
                                                        <DatePicker
                                                            className="input-sm form-control activate-event-date-picker"
                                                            placeholderText="Activation date"
                                                            selected={this.state.activationDay}
                                                            onChange={this.handleChangeActivationDate}
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={15}
                                                            minDate={moment()}
                                                            dateFormat="LLL"
                                                            readOnly
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Row className="activate-event-button-row pull-right">
                                                <Button color="success" onClick={() => this.activateEvent()}>Activate</Button>
                                            </Row>
                                        </ModalFooter>
                                    </Modal>
                                    {/*<----------------------- EVENT DELETE MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.deleteModal} toggle={this.toggleDeleteModal} className={this.props.className}>
                                        <ModalHeader>
                                            <label className="delete-event-delete-label">Delete Event</label>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Row className="delete-event-row">
                                                <p className="delete-event-message">Are you sure you wish to delete this event?</p>
                                            </Row>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Row className="delete-event-button-row pull-right">
                                                <Button color="danger" onClick={() => { this.deleteEvent() }}>Delete</Button>
                                            </Row>
                                        </ModalFooter>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contact section-invert py-4">
                        {this.state.login.admin === true &&
                            (<div>
                                <Row>
                                    <div className="col-md-12 col-sm-12">
                                        <h1 className="app-admin-page-header">Admin</h1>
                                    </div>
                                </Row>
                                <Row>
                                    <div className="col-md-12 col-sm-12">
                                        <h3 className="app-admin-page-subheader">Inactive Events</h3>
                                    </div>
                                </Row>
                                <Row className="app-admin-page-inactive-events">
                                    <div className="col-md-12 col-sm-12">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Location</th>
                                                    <th>Capacity</th>
                                                </tr>
                                            </thead>
                                            {activeChecker(this.state.events, this.state.login.name).length !== 0 &&
                                                <tbody>
                                                    {
                                                        activeChecker(this.state.events, this.state.login.name).map((events, index) => {
                                                            let event = events;
                                                            if (event) {
                                                                return <tr key={index + 1}>
                                                                    <th>{event.calendarInfo.title}</th>
                                                                    <td>{moment(event.calendarInfo.start).format('dddd[,] MMMM Do YYYY')}</td>
                                                                    <td>{moment(event.calendarInfo.start).format('LT')} - {moment(event.calendarInfo.end).format('LT')}</td>
                                                                    <td>{event.location}</td>
                                                                    <td>{event.capacity}</td>
                                                                    <td><Button outline color="success" onClick={() => { this.toggleActivateModal(event._id, event.calendarInfo.start, event.calendarInfo.end) }}>Activate</Button></td>
                                                                    <td><Button outline color="warning" onClick={() => { this.toggleViewModal(event.calendarInfo) }}>View</Button></td>
                                                                    <td><Button outline color="danger" onClick={() => { this.toggleDeleteModal(event._id) }}>Delete</Button></td>
                                                                </tr>;
                                                            } else return null;
                                                        })
                                                    }
                                                </tbody>
                                            }
                                        </Table>
                                        {activeChecker(this.state.events, this.state.login.name).length === 0 &&
                                            <label className="app-no-events-message">Get started by creating an event</label>
                                        }
                                    </div>
                                </Row>
                                <Row>
                                    <div className="col-md-12 col-sm-12">
                                        <h3 className="app-admin-page-subheader">Active Events</h3>
                                    </div>
                                </Row>
                                <Row className="app-admin-page-active-events">
                                    <div className="col-md-12 col-sm-12">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Location</th>
                                                    <th>Capacity</th>
                                                    <th>Registration Started</th>
                                                </tr>
                                            </thead>
                                            {flatten3(this.state.events, this.state.login.name).length !== 0 &&
                                                <tbody>
                                                    {
                                                        flatten3(this.state.events, this.state.login.name).map((events, index) => {
                                                            let event = events;
                                                            if (event) {
                                                                return <tr key={index + 1}>
                                                                    <th>{event.calendarInfo.title}</th>
                                                                    <td>{moment(event.calendarInfo.start).format('dddd[,] MMMM Do YYYY')}</td>
                                                                    <td>{moment(event.calendarInfo.start).format('LT')} - {moment(event.calendarInfo.end).format('LT')}</td>
                                                                    <td>{event.location}</td>
                                                                    <td>{event.registeredEmail.length} / {event.capacity}</td>
                                                                    <td>{moment(event.activationDay).format('dddd[,] MMMM Do YYYY')}</td>
                                                                    <td><Button outline color="success" onClick={() => { this.toggleAnnounceModal(event) }}>Announce</Button></td>
                                                                    <td><Button outline color="warning" onClick={() => { this.toggleViewModal(event.calendarInfo) }}>View</Button></td>
                                                                    <td><Button outline color="danger" onClick={() => { this.toggleDeleteModal(event._id) }}>Delete</Button></td>
                                                                </tr>;
                                                            } else return null;
                                                        })
                                                    }
                                                </tbody>
                                            }
                                        </Table>
                                        {flatten3(this.state.events, this.state.login.name).length === 0 &&
                                            <label className="app-no-events-message">Activate an event to make it public</label>
                                        }
                                    </div>
                                </Row>
                                <div className="col-md-12 col-sm-12">
                                    <Row className="app-button-container-row">
                                        <div className="app-button-container">
                                            <Button className="app-button" color="secondary" onClick={() => this.toggleCreateEventModal()} >Create Event</Button>
                                        </div>
                                        <div className="app-button-container">
                                            <Button className="app-button" color="secondary" onClick={() => this.toggleAddAdminModal()} >Add Admin</Button>
                                        </div>
                                    </Row>
                                </div>
                            </div>)}
                    </div>
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false} />
                </div>
            );
        }
    }
}

export default App;
