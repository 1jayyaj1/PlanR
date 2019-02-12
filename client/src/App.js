import React, { Component } from 'react';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Button, ButtonGroup, Table, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, Alert} from 'reactstrap';
import { Steps} from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';
import { PulseLoader } from 'react-spinners';
import './css/logIn.css';
import './css/createAccount.css';
import './css/createEvent.css';
import './css/calendarPage.css';
import './css/submitEvent.css';
import './css/announceEvent.css';
import './css/addAdmin.css';
import './css/selectEvent.css';
import './css/deleteEvent.css';
import './css/activateEvent.css';
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
    var test = arr.reduce(function (flat, toFlatten) {

        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);

    return test;
}

function flatten2(l) {
    var test = l.map(events => {
        return events.data
    })
    
    test = flatten(test).filter(x => { return ( new Date(moment().format()) >= new Date(moment(x.activationDay).format())) }).map(x => { return x.calendarInfo });
   
    return test;
}

function flatten3(l, currentUser) {
    var test = l.map(events => {
        return events.data
    })
    
    test = flatten(test).filter(x => { if ( x.instructor === currentUser ){ return ( new Date(moment().format()) >= new Date(moment(x.activationDay).format())) }});

    return test;
}

function activeChecker(l, currentUser) {
    var test = l.map(events => {
        return events.data
    })
    test = flatten(test).filter(x => { if ( x.instructor === currentUser ){ return ( new Date(moment().format()) <= new Date(moment(x.activationDay).format())) }});
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
            createModal : false,
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
            createConfirmPassword: { value: "", valid: true},
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
            login: { username: "default", email: "default", admin: false },
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
        this.handleChangeAdminInactive = this.handleChangeAdminInactive.bind(this);
        this.handleChangeActivationDate = this.handleChangeActivationDate.bind(this);
        this.handleChangeSearchNewAdmin = this.handleChangeSearchNewAdmin.bind(this);
        this.activateEvent = this.activateEvent.bind(this);
        this.updateRecurence = this.updateRecurence.bind(this);
        this.updateDaysSelection = this.updateDaysSelection.bind(this);
        this.toggleCreateModal = this.toggleCreateModal.bind(this);
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

    handleStartClick() {
        if(this.state.secondsElapsed !== 0) {
            this.incrementer = setInterval( () =>
                this.setState({
                    secondsElapsed: this.state.secondsElapsed - 1,
                })
            , 1000);
        }
    }
      
    handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
        lastClearedIncrementer: this.incrementer,
    });
    }
    
    handleResetClick() {
    clearInterval(this.incrementer);
    this.setState({
        secondsElapsed: 300,
        laps: [],
    });
    }
    
    handleLabClick() {
    this.setState({
        laps: this.state.laps.concat([this.state.secondsElapsed]),
    })
    }

    handleChangeStart(date) {
        if (this.state.isRecurrent.value === "non-recurring") {
            var nonRecurStartDate = moment(this.state.startDate);
            var nonRecurEndDate = moment(date).add(15, "minutes");
            this.setState({ startDate: nonRecurStartDate, });
            this.setState({ endDate: nonRecurEndDate, });
        }

        if (this.state.allDay === true) {
            this.setState({ startDate: moment(date).hours(9).minutes(0), });
            this.setState({ endDate: moment(date).hours(18).minutes(0), });
        }
        this.setState({ startDate: date, });
    }

    handleChangeEnd(date) {
        this.setState({ endDate: date, });
    }

    handleChangeActivationDate(date) {
        this.setState({
            activationDay: date,
            activateToday: false,
        });
    }

    handleChangeAdminInactive(eventData) {
        this.setState({ 
            events: this.state.events.concat([eventData]),
        })
    }

    handleChangeSearchNewAdmin(emailAdress) {
        const target = emailAdress.target;
        var valid = true;
        this.setState({ [target.name]: { value: target.value, valid: valid }, });
    }

    findFirstName(fullName) {
        if (/\s/g.test(fullName) === true) {
            var firstName = fullName.substr(0,fullName.indexOf(' '));
            return firstName.charAt(0).toUpperCase() + firstName.substr(1);
        } else {
            return fullName.charAt(0).toUpperCase() + fullName.substr(1);
        }
    }

    searchAdminEmail(email) {
        let myComponent = this;
        axios.get('/users/')
        .then(function (response) {
            var users = response.data
            var BreakException = {};
            try {
                users.forEach(function(user) {
                    if (email === user.email) {
                        if (user.admin === true) {
                            myComponent.setState({
                                newAdminSearchTable: 'none',
                                email: { value: myComponent.state.email.value, valid: false },
                            });
                        }
                        else if (user.admin === false) {
                            myComponent.setState({ 
                                nameUserModal: user.name,
                                userNameModal: user.username,
                                emailUserModal: user.email,
                                idUserModal: user._id,
                                newAdminSearchTable: 'block',
                                email: { value: myComponent.state.email.value, valid: true },
                            });
                        }
                    throw BreakException;
                    } else{
                        myComponent.setState({
                            newAdminSearchTable: 'none',
                            email: { value: myComponent.state.email.value, valid: false },
                        });
                    }
                });
            }
            catch (e) {
                if (e !== BreakException) throw e;
                }
            })
        .catch(function (error) {
            console.log(error);
        })
    }

    addAdmin() {
        axios.put('/users/' + this.state.idUserModal, {admin: true})
        .then(function (response) {
            console.log(response.data);
            this.toggleAddAdminModal();
            toast.success("The user was set as an administrator!", {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggablePercent: 60,
                closeButton: false,
            });
        })
        .catch(function (error) {
            console.log(error);
            toast.error('The user was not set as an administrator, please try again later.', {
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
    updateRecurence(selection) {
        this.setState({ recurrence: selection, });
    }

    startTime() {
        if (this.state.startDate === null && this.state.endDate === null) {
          return moment().hours(9).minutes(15);
        } else {
          return moment(this.state.startDate).add(15, "minutes");
        }
    }

    onRadioBtnClick() {
        if (this.state.allDay === false) {
            if (this.state.startDate === null || this.state.endDate === null) {
                this.setState({ startDate: moment().hours(9).minutes(0), });
                this.setState({ endDate: moment().hours(18).minutes(0), });
            } else {
                this.setState({ startDate: moment(this.state.startDate).hours(9).minutes(0), });
                this.setState({ endDate: moment(this.state.endDate).hours(18).minutes(0), });
            }
            this.setState({ allDay: true, });
        } else {
            this.setState({ startDate: null, });
            this.setState({ endDate: null, });
            this.setState({ allDay: false, });
        }
    }

    onRadioBtnActivateClick() {
        if (this.state.activateToday === false) {
            this.setState({ activateToday: true, });
            this.setState({ activationDay: moment(), });
        } else if (this.state.activateToday === true) {
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

    toggleCreateModal() {
        this.setState({ createModal: !this.state.createModal, });
    }

    toggleRegisterModal() {
        if(this.state.registerEvents.length > 0) {
            if(this.state.registerModal === false) {
                this.handleStopClick();
            } 
            else if(this.state.registerModal === true) {
                this.handleStartClick();
            }
            this.setState({
                registerModal: !this.state.registerModal,
                myEventsErrorLabel: 'none',
            });
        }
        else {
            this.setState({
                myEventsErrorLabel: 'block',
            });
        }
    }

    toggleActivateModal(id, start, end) {
        this.handleChangeActivationDate(null);
        this.setState({ 
            activateModal: !this.state.activateModal,
            currentEventId: id,
         });
    }

    toggleDeleteModal(id) {
        this.setState({ 
            deleteModal: !this.state.deleteModal,
            currentEventId: id,
        });
    }

    toggleViewModal(obj) {
        const x = this;
        this.state.events.forEach(function(e) {
            var dataSet = e.data;
            dataSet.forEach(function(event){
                if (obj.title === event.calendarInfo.title && obj.start === event.calendarInfo.start) {
                    x.setState({
                        eventId: e._id,
                        name: {value: event.calendarInfo.title, valid: true}, 
                        capacity: {value: event.capacity, valid: true}, 
                        description: {value: event.description, valid: true},
                        location: {value: event.location, valid: true},
                        isRecurrent: {value: event.isRecurrent, valid: true}, 
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
                    if (event.recurrence === "") {
                        x.setState({ recurrence: "non-recurring", })
                    }
                }
            })
            
        });
        if (this.state.viewModal === true) {
            this.setState({ 
                eventId: "",
                name: {value: "", valid: true}, 
                capacity: {value: "", valid: true}, 
                description: {value: "", valid: true},
                location: {value: "", valid: true},
                isRecurrent: {value: "", valid: true}, 
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

    toggleAddAdminModal() {
        this.setState({
            addAdminModal: !this.state.addAdminModal,
            nameUserModal: "",
            userNameModal: "",
            emailUserModal: "",
            idUserModal: "",
            newAdminSearchTable: 'none',
            email: { value: "", valid: true },
        });
    }

    toggleAnnounceModal(event) {
        var myComponent = this;
        axios.get('/users/')
        .then(function (response) {
            var users = response.data
            var BreakException = {};
            try {
                users.forEach(function(user) {
                    if (myComponent.state.login.username === user.name) {
                            myComponent.setState({ 
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
        .catch(function (error) {
            console.log(error);
        })
        if(this.state.announceModal === false){
            this.setState({ 
                announceModal: !this.state.announceModal,
                currentEventId: event._id,
                name: {value: event.calendarInfo.title, valid: true},
                startDate: event.calendarInfo.start,
            });
        }
        if(this.state.announceModal === true){
            this.setState({ 
                announceModal: !this.state.announceModal,
                currentEventId: "",
                name: {value: "", valid: true},
                startDate: "",
            });
        }
    }

    registerForEvents() {
        this.setState({ 
            registerEvents: [],
            registerModal: !this.state.registerModal,
            visible: false,
        });
        this.handleResetClick();
    }

    unregisterFromSingleEvent(id) {
        const myComponent = this;
            axios.get('/events/' + id)
            .then(function (event) {
                console.log(event)
                    var i = 0;
                    var index;
                    myComponent.state.registerEvents.forEach(function(event){
                        if(event._id === id) {
                            index = i;
                        }
                        i++;
                    })
                    var emailCounter = 0;
                    event.data.registeredEmail.forEach(function(email){
                        if (myComponent.state.registerEventEmail === email) {
                            event.data.registeredEmail.splice(emailCounter, 1)
                            axios.put('/events/' + id, {registeredEmail: event.data.registeredEmail})
                            .then(function (response) {
                                console.log(response.data)
                                if (myComponent.state.registerEvents.length === 1) {
                                    console.log(index);
                                    myComponent.state.registerEvents.splice(index, 1);
                                    console.log(myComponent.state.registerEvents);
                                    myComponent.setState({
                                        registerEvents: myComponent.state.registerEvents,
                                        registerModal: false,
                                        visible: false,
                                    });
                                    myComponent.handleResetClick();
                                }
                                else {
                                    console.log(index);
                                    myComponent.state.registerEvents.splice(index, 1);
                                    console.log(myComponent.state.registerEvents);
                                    myComponent.setState({
                                        registerEvents: myComponent.state.registerEvents,
                                    });
                                }
                                
                            })
                            .catch(function (error) {
                                console.log(error);
                                });
                        }
                        emailCounter++;
                    })
                        
                    
                })
            .catch(function (error) {
                console.log(error);
            });
    }

    unRegisterEvent() {
        const myComponent = this;
        this.state.registerEventId.forEach(function(id){
            axios.get('/events/' + id)
            .then(function (event) {
                console.log(event)
                    var i = 0;
                    event.data.registeredEmail.forEach(function(email){
                        if (myComponent.state.registerEventEmail === email) {
                            event.data.registeredEmail.splice(i, 1)
                            axios.put('/events/' + id, {registeredEmail: event.data.registeredEmail})
                            .then(function (response) {
                                console.log(response.data)
                                this.setState({ 
                                    registerEvents: [],
                                    visible: false,
                                });
                                myComponent.handleResetClick();
                            })
                            .catch(function (error) {
                                console.log(error);
                                });
                        }
                        i++;
                    })
                        
                    
                })
            .catch(function (error) {
                console.log(error);
            });
            })
    }

    addEventBasket(eventId, currentEventId) {
        let myComponent = this;
        let alreadyRegistered = false;
        let fullCapacity = false;
        axios.get('/users/')
        .then(function (response) {
            var users = response.data
            var BreakException = {};
            try {
                users.forEach(function(user) {
                    if (myComponent.state.login.username === user.name) {
                            axios.get('/events/' + currentEventId)
                                .then(function (response) {
                                    console.log(response.data)
                                    if (response.data.registeredEmail.length === response.data.capacity){
                                        fullCapacity = true
                                    }
                                    myComponent.setState({
                                        registerEventId: myComponent.state.registerEventId.concat(currentEventId),
                                        registerEventEmail: user.email,
                                    });
                                    response.data.registeredEmail.forEach(function(email) {
                                        if (user.email === email) {
                                            alreadyRegistered = true;
                                        }
                                    });
                                    if (alreadyRegistered === false && fullCapacity === false) {
                                        axios.put('/events/' + currentEventId, {registeredEmail: response.data.registeredEmail.concat(user.email)})
                                            .then(function (response) {
                                                console.log(response.data)
                                                myComponent.handleResetClick()
                                                myComponent.handleStartClick()
                                                myComponent.setState({ 
                                                    visible: true,
                                                    myEventsErrorLabel: 'none',
                                                });
                                                axios.get('/events/' + currentEventId)
                                                .then(function (response) {
                                                    myComponent.setState({ 
                                                        registerEvents: myComponent.state.registerEvents.concat(response.data),
                                                    });
                                                    myComponent.setState({ viewModal: !myComponent.state.viewModal });
                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                })
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                        });
                                    }
                                    else if(alreadyRegistered === true) {
                                        myComponent.setState({ 
                                            allReadyRegisteredErrorLabel: 'block',
                                        });
                                    }
                                    else if(fullCapacity === true) {
                                        myComponent.setState({ 
                                            fullCapacityErrorLabel: 'block',
                                        });
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                            });
                    throw BreakException;
                    }
                });
            }
            catch (e) {
                if (e !== BreakException) throw e;
                }
            })
        .catch(function (error) {
            console.log(error);
        })
    }
   
    minMaxTime() {
        if(this.state.startDate === null && this.state.endDate === null) {
          return moment();
        } else {
          return moment(this.state.startDate);
        }
    }

    displayCreateAccount() {
        var user = { username: "account", admin: false };
        this.setState({
            login: user,
            username: {value: "", valid: true},
            password: {value: "", valid: true},
        });
    }

    displayLogIn() {
        var user = { username: null, admin: false };
        this.setState({ 
            login: user,
            createName: {value: "", valid: true},
            createEmail: {value: "", valid: true},
            createUserName: {value: "", valid: true},
            createPassword: {value: "", valid: true},
            createConfirmPassword: {value: "", valid: true},
        });
    }

    logOut() {
        var user = { username: null, admin: false };
        this.setState({ login: user, });
    }

    nextStep(event) {
        event.preventDefault();
        if (this.state.step === 0) {
            var recurrenceValid = this.state.isRecurrent;
            var nameValid = this.state.name;
            var capacityValid = this.state.capacity;
            var locationValid = this.state.location;
            var descriptionValid = this.state.description;
            var valid = true;
            if (recurrenceValid.value === "" || nameValid.value === "" || capacityValid.value === "" || locationValid.value === "" || descriptionValid.value === "" || nameValid.valid === false || capacityValid.valid === false || locationValid.valid === false || descriptionValid.valid === false){
                if (recurrenceValid.value === "") {
                    valid = false;
                    this.setState({
                        isRecurrent: {value: recurrenceValid.value, valid: valid},
                    });
                }
                if (nameValid.value === "") {
                    valid = false;
                    this.setState({
                        name: {value: nameValid.value, valid: valid},
                    });
                }
                if (capacityValid.value === "") {
                    valid = false;
                    this.setState({
                        capacity: {value: capacityValid.value, valid: valid},
                    });
                }
                if (locationValid.value === "") {
                    valid = false;
                    this.setState({
                        location: {value: locationValid.value, valid: valid},
                    });
                }
                if (descriptionValid.value === "") {
                    valid = false;
                    this.setState({
                        description: {value: descriptionValid.value, valid: valid},
                    });
                }
            }
                else {
                    if (this.state.isRecurrent.value === "non-recurring" && this.state.startDate  !== null && this.state.endDate !== null) {
                        var nonRecurStartDate = moment(this.state.startDate);
                        var nonRecurEndDate = moment(this.state.startDate).add(15, "minutes");
                        this.setState({ startDate: nonRecurStartDate, });
                        this.setState({ endDate: nonRecurEndDate, });
                    }
                    const step = this.state.step + 1;
                    this.setState({ step, });
                }
        }
        else if (this.state.step === 1) {
            if (this.state.isRecurrent.value === "recurring") {
                if (new Date(this.state.startDate) >= new Date(this.state.endDate) || this.state.recurrence === "" || this.state.startDate === null || this.state.endDate === null || this.state.daysSelected.length === 0) {
                    if (new Date(this.state.startDate) >= new Date(this.state.endDate) || this.state.startDate === null || this.state.endDate === null) {
                        this.setState({ dateValid: '#c4183c', });
                        this.setState({ dateValidLabel: 'visible', });
                    }
                    if (this.state.recurrence === "") {
                        this.setState({ recurrenceValid: '#c4183c', });
                        this.setState({ recurrenceValidLabel: 'visible', });
                    }
                    if (this.state.daysSelected.length === 0) {
                        this.setState({ daysSelectedValid: '#c4183c', });
                        this.setState({ daysSelectedValidLabel: 'visible', });
                    }
                    if (this.state.startDate !== null && this.state.endDate !== null) {
                        this.setState({ dateValid: 'black', });
                        this.setState({ dateValidLabel: 'hidden', });
                    }
                    if (this.state.recurrence !== "") {
                        this.setState({ recurrenceValid: 'black', });
                        this.setState({ recurrenceValidLabel: 'hidden', });
                    }
                    if (this.state.daysSelected.length !== 0) {
                        this.setState({ daysSelectedValid: 'black', });
                        this.setState({ daysSelectedValidLabel: 'hidden', });
                    }
                }
                else {
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
            else {
                if (new Date(this.state.startDate) >= new Date(this.state.endDate) || this.state.startDate === null || this.state.endDate === null) {
                    //CODE TO MAKE FIELDS UNVALID NON-RECURRING
                    if (new Date(this.state.startDate) >= new Date(this.state.endDate) || this.state.startDate === null || this.state.endDate === null) {
                        this.setState({ dateValidNonRecurr: '#c4183c', });
                        this.setState({ dateValidLabelNonRecurr: 'visible', });
                    }
                    if (this.state.startDate !== null && this.state.endDate !== null) {
                        this.setState({ dateValidNonRecurr: 'black', });
                        this.setState({ dateValidLabelNonRecurr: 'hidden', });
                    }
                } else {
                    this.setState({ dateValidNonRecurr: 'black', });
                    this.setState({ dateValidLabelNonRecurr: 'hidden', });
                    const step = this.state.step + 1;
                    this.setState({ step, });
                }
            }
        }
    }
    
    prevStep() {
        if (this.state.allDay === true) {
            this.setState({ allDay: false, });
            this.setState({ startDate: null, });
            this.setState({ endDate: null, });
        }
        const step = this.state.step - 1;
        this.setState({ step, });
    }

    createAccount() {
        const myComponent = this;
        const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const username = this.state.createUserName.value;
        const password = this.state.createPassword.value;
        const email = this.state.createEmail.value;
        const name = this.state.createName.value;
        const confirm = this.state.createConfirmPassword.value;

        if (name !== "" && email !== "" && emailRegex.test(email) && username !== "" && password !== ""  && confirm !== "" && password === confirm) {
            var user = {
                name: name,
                username: username,
                email: email,
                admin: false,
                password: password
            }
            axios.post('/users', user)
            .then(function (response) {
                myComponent.displayLogIn();
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
            .catch(function (error) {
                if (error.response.data.toString() === "Bad Request") {
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
                else {
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
        else {
            if (name === "") {
                this.setState({
                    createName: {value: "", valid: false},
                });
            }
            if (email === "" || !emailRegex.test(email)) {
                this.setState({
                    createEmail: {value: "", valid: false},
                });
            }
            if (username === "") {
                this.setState({
                    createUserName: {value: "", valid: false},
                });
            }
            if (password === "") {
                this.setState({
                    createPassword: {value: "", valid: false},
                });
            }
            if (password !== confirm || confirm === "") {
                this.setState({
                    createConfirmPassword: {value: "", valid: false},
                });
            }
        }
    }

    handleLoginSubmit() {
        const name = this.state.username.value;
        const password = this.state.password.value;
        if (name !== "" && password !== "") {
            axios.post('/login', { username: name, password: password })
            .then(function (response) {
                console.log(response);
                window.location.reload();
            })
            .catch(function (error) {
                if (error.response.status.toString() === "401") {
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
                else if (error.response.status.toString() === "404") {
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
                    console.log(error);
                }
            });
        }
        else {
            if (name === "") {
                this.setState({
                    username: {value: "", valid: false},
                });
            }
            if (password === "") {
                this.setState({
                    password: {value: "", valid: false},
                });
            }
        }
    }

    handleChange(event) {
        const target = event.target;
        var valid = true;
        if (target.name === "name" && !/^[#/&a-z,.()àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœA-Z0-9- ]*$/.test(target.value)) {
            valid = false;
        }
        else if (target.name === "capacity" && /\D+/.test(target.value)) {
            valid = false;
        }
        else if (target.name === "location" && /[^,.()#/$àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœA-Za-z0-9- ]+/.test(target.value)) {
            valid = false;
        }
        this.setState({ [target.name]: { value: target.value, valid: valid }, });
    }

    handleRecurrenceChange(event) {
        this.setState({ recurrence: event.target.value, });
    }

    weekDaysToNumbers(dayINeed) {
        var number = 0;
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

    createEvent() {
        const x = this;
        var sDate = moment(this.state.startDate).format();
        var eDate = moment(this.state.endDate).format();
        var aDate = moment(this.state.startDate).add(1, 'days').format();
        var event = {
            title: this.state.name.value,
            allDay: false,
            start:  new Date(sDate),
            end: new Date(eDate)
        }
        var newEvent = {
            capacity: this.state.capacity.value, 
            description: this.state.description.value, 
            location: this.state.location.value, 
            allDay: this.state.allDay,
            activationDay: new Date(aDate),
            instructor: this.state.login.username,
            registeredEmail: this.state.registerEvents,
            calendarInfo: event 
        }

        var events = this.splitEvent(newEvent);

        axios.post('/events', events)
        .then(function (response) {
            console.log(response);
            x.fetchEvents();
            x.setState({
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
            x.toggleCreateModal();
            this.setState({ events: this.state.events.concat(newEvent), });
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
        .catch(function (error) {
            console.log(error);
        });
    }

    activateEvent() {
        const x = this;
        axios.put('/events/' + this.state.currentEventId, {activationDay: new Date(this.state.activationDay)})
        .then(function (response) {
            x.fetchEvents();
        })
        .catch(function (error) {
            console.log(error);
        });
        this.setState({
            activationDay: null,
            activateToday: false,
        });
        this.toggleActivateModal();
    }

    editEvent () {
        let myComponent = this;
        axios.get('/events/' + myComponent.state.currentEventId)
        .then(function (response) {
                 axios.put('/events/' + myComponent.state.currentEventId, {
                    calendarInfo: {
                        title: myComponent.state.name.value,
                        allDay: false,
                        start: new Date(myComponent.state.startDate),
                        end: new Date(myComponent.state.endDate)
                    }, 
                    capacity:  myComponent.state.capacity.value,
                    description: myComponent.state.description.value,
                    location: myComponent.state.location.value,
                    activationDay: new Date(myComponent.state.activationDay)
                })
                .then(function (response) {
                    myComponent.fetchEvents();
                    myComponent.setState({
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
                    });
                    myComponent.setState({ viewModal: !this.state.viewModal, });
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
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    componentWillMount() {
        var user = {};
        let component = this;
        axios.get('/info')
        .then(function (response) {
            user.username = response.data.username;
            user.admin = response.data.admin;
            console.log(response);
            component.setState({ login: user, });

            component.fetchEvents();
        })
        .catch(function (error) {
            console.log("Redirecting to login");
            component.setState({ login: {}, });
        });
    }

    deleteEvent() {
        const x = this;
        axios.delete('/events/' + this.state.currentEventId)
        .then(res => {
            x.fetchEvents();
            console.log(res);
            console.log(res.data);
            this.toggleDeleteModal();
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
        .catch(function (error) {
            console.log(error);
        });
    }
      
    splitEvent(event) {
        var myComponent = this;
        var eventList = [];
        var hours = moment(event.calendarInfo.start).hour();
        var delta = moment(event.calendarInfo.end).subtract(hours, 'hours');
        if (this.state.isRecurrent.value === "recurring") {
            var recurrenceWeeks = 0;
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
            var i = 0;
            outer:
            while (true) {
                for (var z = 0; z < this.state.daysSelected.length; z++) {
                    var dayINeed = this.state.daysSelected[z];
                    if (new Date(moment().add(i, 'weeks').isoWeekday(myComponent.weekDaysToNumbers(dayINeed))) > new Date(moment(event.calendarInfo.end))){
                        break outer;
                    } else {
                        var s2Date = moment(event.calendarInfo.start).add(i, 'weeks').isoWeekday(myComponent.weekDaysToNumbers(dayINeed));
                        var e2Date = moment(event.calendarInfo.start).add(i, 'weeks').isoWeekday(myComponent.weekDaysToNumbers(dayINeed)).add(delta.hours(), "hours").add(delta.minutes(), "minutes");
                        var a2Date = moment(event.calendarInfo.start).add(i, 'weeks').isoWeekday(myComponent.weekDaysToNumbers(dayINeed)).add(1, 'days');
                        if (s2Date >= moment(event.calendarInfo.start)) {
                            var newEvent = {
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

    fetchEvents() {
        let myComponent = this;
        axios.get('/events')
        .then(function (response) {
            // handle success
            response.data.forEach(events => {
                events.data.forEach(event => {
                    event.calendarInfo.start = new Date(event.calendarInfo.start);
                    event.calendarInfo.end = new Date(event.calendarInfo.end);
                    event.activationDay = new Date(event.activationDay);
                })
            });
            myComponent.setState({ events: response.data });
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    notifyEvent(event) {
        var myComponent = this;
        event.preventDefault();
        axios.get('/events/' + this.state.currentEventId)
        .then(function (response) {
            var startDateNotifyEmail = moment(myComponent.state.startDate).format('LLLL')
            var data = {
                notifyFullName: myComponent.state.login.username,
                notifyEmailSender: myComponent.state.email.value,
                notifyEmailRecepients: response.data.registeredEmail, 
                notifyMessage: myComponent.announceMessage.current.value,
                notifyEventName: myComponent.state.name.value,
                notifyEventStart: startDateNotifyEmail.toString()
            }
                  
            axios.post('/notification', data)
            .then(
                myComponent.toggleAnnounceModal(),
                toast.success('The announcement was sent to the participants of your event.', {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggablePercent: 60,
                closeButton: false,
                }))
            .catch(function (error) {
                console.log(error);
            });
            document.getElementById("announceModal").reset();
        })
        .catch(function (error) {
            console.log(error);
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
                      <Input name="name" value={this.state.name.value} onChange={this.handleChange} className={this.state.name.valid? "form-control" : "form-control is-invalid"} placeholder="What will it be called?"/>
                      <div className="invalid-feedback">Alphanumeric and can't be empty.</div>
                  </Row>
                  <Row>
                      <label>Capacity</label>
                      <Input name="capacity" value={String(this.state.capacity.value)} onChange={this.handleChange} className={this.state.capacity.valid? "form-control" : "form-control is-invalid"} placeholder="How many people?"/>
                      <div className="invalid-feedback">Numbers and can't be empty.</div>
                  </Row>
                  <Row>
                      <label>Location</label>
                      <Input name="location" value={this.state.location.value} onChange={this.handleChange} className={this.state.location.valid? "form-control" : "form-control is-invalid"} placeholder="Where will it take place?"/>
                      <div className="invalid-feedback">Alphanumeric and can't be empty.</div>
                  </Row> 
                  <Row>
                      <label>Recurrence</label>
                      <fieldset className="create-event-recurrence-dropdown">
                          <select className={this.state.isRecurrent.valid? "custom-select w-100" : "custom-select w-100 is-invalid"} name="isRecurrent" value={this.state.isRecurrent.value} onChange={this.handleChange}>
                            <option disabled='disabled' value="">Will it be a recurring event?</option>
                            <option value="recurring">Yes</option>
                            <option value="non-recurring">No</option>
                          </select>
                          <div className="invalid-feedback">Recurrence type is required.</div>
                      </fieldset>
                  </Row>
                </Col>
                <Col xs="6" sm="6" md="6" lg="6">
                  <Row  className="create-event-description-row">
                    <label>Description</label>
                      <textarea name="description" value={this.state.description.value} onChange={this.handleChange} className={this.state.description.valid? "form-control create-event-description" : "form-control is-invalid create-event-description"} placeholder="What will it be about?" rows={5}/>
                      <div className="invalid-feedback">Can't be empty.</div>
                  </Row>
                </Col>
              </Row>
            </fieldset>;
        }
        
        else if (this.state.step === 1) {
          if (this.state.isRecurrent.value === "recurring"){
            wizardContentCreate = 
            <fieldset> 
              <Row>
                <Col xs="12" sm="12" md="12" lg="12">
                  <label className="inputName" style={{color: this.state.dateValid}}>Date & time</label>
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
                      <div className="invalid-input" style={{visibility: this.state.dateValidLabel}}>Start and end dates are required</div>
                    </div>
                </Col>
              </Row><br/>
              <Row className="create-event-row">
                <Col xs="10" sm="10" md="10" lg="10">
                  <label className="inputName" style={{color: this.state.recurrenceValid}}>Recurrence</label>
                  <ButtonGroup>
                    <Button className="create-event-recurrence-radio" color="secondary" onClick={() => this.updateRecurence("Weekly")} active={this.state.recurrence === "Weekly"}>Weekly</Button>
                    <Button className="create-event-recurrence-radio" color="secondary" onClick={() => this.updateRecurence("Biweekly")} active={this.state.recurrence === "Biweekly"}>Biweekly</Button>
                    <Button className="create-event-recurrence-radio" color="secondary" onClick={() => this.updateRecurence("Triweekly")} active={this.state.recurrence === "Triweekly"}>Triweekly</Button>
                    <Button className="create-event-recurrence-radio" color="secondary" onClick={() => this.updateRecurence("Monthly")} active={this.state.recurrence === "Monthly"}>Monthly</Button>
                  </ButtonGroup>
                  <div className="invalid-input" style={{visibility: this.state.recurrenceValidLabel}}>Recurrence type is required</div>
                </Col>
              </Row><br/>
              <Row className="create-event-row">
                <Col xs="10" sm="10" md="10" lg="10">
                  <label className="inputName" style={{color: this.state.daysSelectedValid}}>Weekday</label>
                  <ButtonGroup name="weeklyOcurrence">
                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Monday")} active={this.state.daysSelected.includes("Monday")}>Monday</Button>
                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Tuesday")} active={this.state.daysSelected.includes("Tuesday")}>Tuesday</Button>
                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Wednesday")} active={this.state.daysSelected.includes("Wednesday")}>Wednesday</Button>
                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Thursday")} active={this.state.daysSelected.includes("Thursday")}>Thursday</Button>
                    <Button className="create-event-weekday-check" color="secondary" onClick={() => this.updateDaysSelection("Friday")} active={this.state.daysSelected.includes("Friday")}>Friday</Button>
                  </ButtonGroup>
                  <div className="invalid-input" style={{visibility: this.state.daysSelectedValidLabel}}>Weekday is required</div>
                </Col>
              </Row>
            </fieldset>;
          }
          else {
            wizardContentCreate = 
            <fieldset>
              <Row className="create-event-row">
                <Col xs="8" sm="8" md="8" lg="8">
                  <label className="inputName">Type of event</label>
                  <fieldset>
                    <div className="custom-control app-custom-toggle d-block my-2">
                      <input type="checkbox" id="customToggle1" name="allDay" onClick={() => this.onRadioBtnClick()} className="custom-control-input"/>
                      <label className="app-custom-control-label" htmlFor="customToggle1">Will your event last all day?</label>
                    </div>
                  </fieldset>
                </Col>
              </Row><br/>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12">
                  <label className="inputName" style={{color: this.state.dateValidNonRecurr}}>Date & time</label>
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
                    <div className="invalid-input" style={{visibility: this.state.dateValidLabelNonRecurr}}>Start and end dates are required</div>
                </Col>
              </Row>
            </fieldset>;
          }
        }  else {
          if (this.state.isRecurrent.value === "non-recurring") {
            wizardContentCreate = 
            <fieldset> 
              <Row>
                <Col xs="12" sm="12" md="12" lg="12">
                  <i className="fa fa-check-circle icon-pass cycle-status create-event-summary-icon"></i>
                  <label className="create-event-summary-name">{this.state.name.value}</label>
                  <ul className="create-event-summary-list">
                    <li><span>Instructor:</span> <span>{this.state.login.username}</span></li>
                    <li><span>Capacity:</span> <span>{String(this.state.capacity.value)}</span></li>
                    <li><span>Type of event:</span> <span>Non-recurring</span></li>
                    <li><span>Time & date:</span> <span>{moment(this.state.startDate).format("dddd [,] MMMM Do YYYY")} from {moment(this.state.startDate).format("H:mm")} to {moment(this.state.endDate).format("H:mm")}</span></li>
                    <li><span>Location:</span> <span>{this.state.location.value}</span></li>
                    <li><span>Description:</span> <span>{this.state.description.value}</span></li>
                  </ul> 
                  <hr/>
                </Col>
              </Row>
            </fieldset>;
          }
          else if (this.state.isRecurrent.value === "recurring") {
            wizardContentCreate = 
            <fieldset> 
              <Row>
                <Col xs="12" sm="12" md="12" lg="12">
                  <i className="fa fa-check-circle icon-pass cycle-status create-event-summary-icon"></i>
                  <label className="create-event-summary-name">{this.state.name.value}</label>
                  <ul className="create-event-summary-list">
                    <li><span>Instructor:</span> <span>{this.state.login.username}</span></li>
                    <li><span>Capacity:</span> <span>{this.state.capacity.value}</span></li>
                    <li><span>Type of event:</span> <span>Recurring</span></li>
                    <li><span>Day of the week:</span> <span>{this.state.daysSelected.join(", ")}</span></li>
                    <li><span>Time:</span> <span>From {moment(this.state.startDate).format("H:mm")} to {moment(this.state.endDate).format("H:mm")}</span></li>
                    <li><span>Recurring basis:</span> <span>{this.state.recurrence} from {moment(this.state.startDate).format("MMMM Do YYYY")} to {moment(this.state.endDate).format("MMMM Do YYYY")}</span></li>
                    <li><span>Location:</span> <span>{this.state.location.value}</span></li>
                    <li><span>Description:</span> <span>{this.state.description.value}</span></li>
                  </ul> 
                  <hr/>
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
                                                        <Input type="text" name="createName" value={this.state.createName.value} onChange={this.handleChange} className={this.state.createName.valid? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Enter your full name"/>
                                                        <div className="invalid-feedback create-account-elements">Name can't be left empty.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group create-account-elements-container">
                                                        <label htmlFor="email" className="create-account-elements">Email</label>
                                                        <Input type="text" name="createEmail" value={this.state.createEmail.value} onChange={this.handleChange} className={this.state.createEmail.valid? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Enter your email"/>
                                                        <div className="invalid-feedback create-account-elements">Email format should be a@b.c.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group create-account-elements-container">
                                                        <label htmlFor="username" className="create-account-elements">Username</label>
                                                        <Input type="text" name="createUserName" value={this.state.createUserName.value} onChange={this.handleChange} className={this.state.createUserName.valid? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Enter your username"/>
                                                        <div className="invalid-feedback create-account-elements">Username can't be left empty.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group create-account-elements-container">
                                                        <label htmlFor="password" className="create-account-elements">Password</label>
                                                        <Input type="text" name="createPassword" value={this.state.createPassword.value} onChange={this.handleChange} className={this.state.createPassword.valid? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Enter your password"/>
                                                        <div className="invalid-feedback create-account-elements">Password can't be left empty.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group reate-account-elements-container">
                                                        <label htmlFor="confirmPassword" className="create-account-elements">Confirm your password</label>
                                                        <Input type="password" name="createConfirmPassword" value={this.state.createConfirmPassword.value} onChange={this.handleChange} className={this.state.createConfirmPassword.valid? "form-control create-account-elements" : "form-control is-invalid create-account-elements"} placeholder="Confirm your password"/>
                                                        <div className="invalid-feedback create-account-elements">Passwords do not match.</div>
                                                    </div>
                                                </div>
                                            </Row>  
                                        <input className="btn btn-primary d-flex ml-auto mr-auto create-account-button" onClick={this.createAccount} type="button" value="Create"></input>
                                    </form>
                                </div>
                            </div>
                            <p className="switch-login-createaccount-link" onClick={this.displayLogIn}> Return to log in </p>
                            <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false}/>
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
                                        <h3 className="log-in-label"> Log In </h3>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group log-in-form">
                                                        <label htmlFor="username" className="log-in-elements">Username</label>
                                                        <Input type="text" name="username" value={this.state.username.value} onChange={this.handleChange} className={this.state.username.valid? "form-control log-in-elements" : "form-control is-invalid log-in-elements"} placeholder="Enter your username"></Input>
                                                        <div className="invalid-feedback log-in-elements">Username can't be left empty.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group log-in-form">
                                                        <label htmlFor="password" className="log-in-elements">Password</label>
                                                        <Input type="password" name="password" value={this.state.password.value} onChange={this.handleChange} className={this.state.password.valid? "form-control log-in-elements" : "form-control is-invalid log-in-elements"} placeholder="Enter your password"></Input>
                                                        <div className="invalid-feedback log-in-elements">Password can't be left empty.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                        <input className="btn btn-primary d-flex ml-auto mr-auto log-in-button" onClick={this.handleLoginSubmit} type="button" value="Log In"></input>
                                    </form>
                                </div>
                            </div>
                            <p className="switch-login-createaccount-link" onClick={this.displayCreateAccount}> Create an account </p>
                            <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false}/>
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
                                <h1 className="welcome-heading display-4 text-white">Hello {this.findFirstName(this.state.login.username)}</h1>
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
                                    ( this.unRegisterEvent() )}
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
                                            <label className="calendar-my-events-label" style={{display: this.state.myEventsErrorLabel}}> No added events to show. </label>
                                        </Col>
                                    </Row>
                    
                                    {/*<----------------------- EVENT CREATION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.createModal} toggle={this.toggleCreateModal} className={this.props.className}>
                                        <ModalHeader>
                                            <h2 className="create-event-new-event-label">New Event</h2>
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
                                        <ModalHeader><h2>Selected Events</h2></ModalHeader>
                                        <ModalBody>
                                            <form>
                                                {this.state.registerEvents.length > 0 &&
                                                (
                                                    this.state.registerEvents.map((registerEvents, index) => {
                                                        var event = registerEvents;
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
                                                                                <hr/>
                                                                            </Col>
                                                                    </Row>;
                                                            } else return
                                                    })
                                                )}
                                            </form>
                                        </ModalBody>
                                        <ModalFooter>
                                                {(this.state.secondsElapsed !== 0 &&
                                                this.incrementer === this.state.lastClearedIncrementer
                                                ? <button type="button" className="btn btn-success pull-right" align="right"onClick={() => {this.registerForEvents()}}>Register</button>
                                                : null
                                                )}
                                        </ModalFooter>
                                    </Modal>

                                    {/*<----------------------- EVENT ANNOUNCE MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.announceModal} toggle={this.toggleAnnounceModal} className={this.props.className}>
                                        <form onSubmit={this.notifyEvent} id="announceModal">
                                            <ModalHeader><h2 className="announce-event-announcement-label">Announcement</h2></ModalHeader>
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
                                        <ModalHeader><h2 className="add-admin-label">Add Admin</h2></ModalHeader>
                                        <ModalBody>
                                            
                                                <label htmlFor="contactFormEmail">Search by email</label>
                                                <Row>
                                                    <div className="col-md-9 col-sm-9 add-admin-input-email-container">
                                                        <input name="email" value={this.state.email.value} onChange={this.handleChangeSearchNewAdmin} className={this.state.email.valid? "form-control add-admin-input-email" : "form-control is-invalid add-admin-input-email"} type="email" id="contactFormEmail" required="required" placeholder="Enter the new admin's email"></input>
                                                        <div className="invalid-feedback">Email address {this.state.email.value} doesn't exist, or is already an admin.</div>
                                                    </div>
                                                    <div className="col-md-3 col-sm-3 add-admin-search-button-container">
                                                        <Button className="add-admin-search-button" color="secondary light" onClick={() => {this.searchAdminEmail(this.state.email.value)}}>Search</Button>
                                                    </div>
                                                
                                                    <Col xs="12" sm="12" md="12" lg="12" className="add-admin-modal" style={{display: this.state.newAdminSearchTable}}>
                                                    <Table className="add-admin-table">
                                                        <tbody>
                                                            <tr>
                                                                <td scope="row" className="add-admin-user-top"><span className="add-admin-user-info">Name:</span></td>
                                                                <td className="add-admin-user-top"><span className="add-admin-user-info-data">{this.state.nameUserModal}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="row"><span className="add-admin-user-info">Username:</span></td>
                                                                <td><span className="add-admin-user-info-data">{this.state.userNameModal}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="row"><span className="add-admin-user-info">Email:</span></td>
                                                                <td><span className="add-admin-user-info-data">{this.state.emailUserModal}</span></td>
                                                            </tr>
                                                        </tbody>
                                                    </Table> 
                                                    </Col>
                                                </Row>
                                        </ModalBody>
                                        <ModalFooter className="add-admin-modal-footer" style={{display: this.state.newAdminSearchTable}}>
                                            <div className="col-md-12 col-sm-12">
                                                <button type="button" className="btn btn-secondary pull-right" align="right" style={{display: this.state.newAdminSearchTable}} onClick={() => {this.addAdmin()}}>Add</button>
                                            </div>
                                        </ModalFooter>        
                                    </Modal>
                                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false}/>

                                    {/*<----------------------- EVENT SELECTION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.viewModal} toggle={this.toggleViewModal} className={this.props.className}>
                                        <ModalHeader>
                                        {this.state.instructor !== this.state.login.username &&
                                            (<h2 className="select-event-view-header-label">{this.state.calendarInfo.title}</h2>)}
                                        {this.state.instructor === this.state.login.username &&
                                            (<h2 className="select-event-edit-header-label">Edit Event</h2>)}
                                        </ModalHeader>
                                        <ModalBody>
                                            {this.state.instructor !== this.state.login.username &&
                                            (<Row className="select-event-modal">
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                    <Table className="select-event-table">
                                                        <tbody>
                                                        <tr>
                                                            <td scope="row" className="select-event-top"><span className="select-event-info">Instructor:</span></td>
                                                            <td className="select-event-top"><span className="select-event-info-data">{this.state.instructor}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="select-event-info">Date:</span></td>
                                                            <td><span className="select-event-info-data">{moment(this.state.calendarInfo.start).format("dddd [,] MMMM Do YYYY")}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="select-event-info">Time:</span></td>
                                                            <td><span className="select-event-info-data">From {moment(this.state.calendarInfo.start).format("H:mm")} to {moment(this.state.calendarInfo.end).format("H:mm")}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="select-event-info">Location:</span></td>
                                                            <td><span className="select-event-info-data">{this.state.location.value}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="select-event-info">Capacity:</span></td>
                                                            <td><span className="select-event-info-data">{this.state.liveCapacity} / {this.state.capacity.value}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="select-event-info">Description:</span></td>
                                                            <td><span className="select-event-info-data">{this.state.description.value}</span></td>
                                                        </tr>
                                                        {this.state.isRecurrent.value &&
                                                        <tr>
                                                            <td scope="row"><span className="select-event-info">Recurrence:</span></td>
                                                            <td><span className="select-event-info-data">{this.state.recurrence}</span></td>
                                                        </tr>} 
                                                        </tbody>
                                                    </Table> 
                                                    </Col>
                                                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false}/>
                                                </Row> )}
                                            {this.state.instructor === this.state.login.username &&
                                            (<Row>
                                            <fieldset>
                                                <Row className="select-event-row">
                                                    <Col xs="6" sm="6" md="6" lg="6">
                                                    <Row>
                                                        <label className="select-event-edit-label-top">Name</label>
                                                        <Input name="name" value={this.state.name.value} onChange={this.handleChange} className={this.state.name.valid? "form-control" : "form-control is-invalid"} placeholder="What will it be called?"/>
                                                        <div className="invalid-feedback">Characters only and can't be empty.</div>
                                                    </Row>
                                                    <Row>
                                                        <label className="select-event-edit-label-top">Capacity</label>
                                                        <Input name="capacity" value={String(this.state.capacity.value)} onChange={this.handleChange} className={this.state.capacity.valid? "form-control" : "form-control is-invalid"} placeholder="How many people?"/>
                                                        <div className="invalid-feedback">Numbers only and can't be empty.</div>
                                                    </Row>
                                                    <Row>
                                                        <label className="select-event-edit-label-top">Location</label>
                                                        <Input name="location" value={this.state.location.value} onChange={this.handleChange} className={this.state.location.valid? "form-control" : "form-control is-invalid"} placeholder="Where will it take place?"/>
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
                                                        <textarea name="description" value={this.state.description.value} onChange={this.handleChange} className={this.state.description.valid? "form-control select-event-description" : "form-control is-invalid select-event-description"} placeholder="What is your event about?"></textarea>
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
                                        {this.state.instructor !== this.state.login.username &&
                                            (<Col xs="12" sm="12" md="12" lg="12">
                                            <Button className="select-event-add-button" color="primary" onClick={() => {this.addEventBasket(this.state.eventId, this.state.currentEventId)}}>Add</Button>
                                            <label className="select-event-error-label" style={{display: this.state.allReadyRegisteredErrorLabel}}> You're already registered to this event. </label>
                                            <label className="select-event-error-label" style={{display: this.state.fullCapacityErrorLabel}}> This event is already full. </label>
                                            </Col>)}
                                        {this.state.instructor === this.state.login.username &&
                                            (<Button color="warning" onClick={() => {this.editEvent()}}>Save</Button>)}
                                        </ModalFooter>
                                    </Modal>

                                    {/*<----------------------- EVENT ACTIVATION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.activateModal} toggle={this.toggleActivateModal} className={this.props.className}>
                                        <ModalHeader>
                                        <h2 className="activate-event-label">Activate Event</h2>
                                        </ModalHeader>
                                        <ModalBody>
                                        <Row className="activate-event-row">
                                            <Col xs="8" sm="8" md="8" lg="8">
                                            <fieldset>
                                                <div className="custom-control app-custom-toggle d-block my-2">
                                                <input type="checkbox" id="customToggle1" name="activateToday" onClick={() => this.onRadioBtnActivateClick()} className="custom-control-input"/>
                                                <label className="app-custom-control-label" htmlFor="customToggle1">Today</label>
                                                </div>
                                            </fieldset>
                                            </Col>
                                        </Row><br/>
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
                                        <h2 className="delete-event-delete-event-label">Delete Event</h2>
                                        </ModalHeader>
                                        <ModalBody>
                                        <Row className="delete-event-row">
                                        <p className="delete-event-message">Are you sure you wish to delete this event?</p>
                                        </Row>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Row className="delete-event-button-row pull-right">
                                                <Button color="danger" onClick={() => {this.deleteEvent()}}>Delete</Button>
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
                                        {activeChecker(this.state.events, this.state.login.username).length === 0 &&
                                            <label className="app-no-events-message">Get started by creating an event</label>
                                        }    
                                        {activeChecker(this.state.events, this.state.login.username).length !== 0 &&
                                            <tbody>
                                            {
                                                activeChecker(this.state.events, this.state.login.username).map((events, index) => {
                                                    var event = events;
                                                    if (event) {
                                                        return <tr key={index + 1}>
                                                                <th>{event.calendarInfo.title}</th>
                                                                <td>{moment(event.calendarInfo.start).format('dddd[,] MMMM Do YYYY')}</td>
                                                                <td>{moment(event.calendarInfo.start).format('LT')} - {moment(event.calendarInfo.end).format('LT')}</td>
                                                                <td>{event.location}</td>
                                                                <td>{event.capacity}</td>
                                                                <td><Button outline color="success" onClick={() => {this.toggleActivateModal(event._id, event.calendarInfo.start, event.calendarInfo.end)}}>Activate</Button></td>
                                                                <td><Button outline color="warning" onClick={() => {this.toggleViewModal(event.calendarInfo)}}>View</Button></td>
                                                                <td><Button outline color="danger" onClick={() => {this.toggleDeleteModal(event._id)}}>Delete</Button></td>
                                                            </tr>;
                                                    } else return
                                                })
                                            }
                                            </tbody>
                                        }
                                    </Table>
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
                                        {flatten3(this.state.events, this.state.login.username).length === 0 &&
                                            <label className="app-no-events-message">Activate an event to make it public</label>
                                        }
                                        {flatten3(this.state.events, this.state.login.username).length !== 0 &&
                                            <tbody>
                                                {
                                                    flatten3(this.state.events, this.state.login.username).map((events, index) => {
                                                        var event = events;
                                                        if (event) {
                                                            return <tr key={index + 1}>
                                                                    <th>{event.calendarInfo.title}</th>
                                                                    <td>{moment(event.calendarInfo.start).format('dddd[,] MMMM Do YYYY')}</td>
                                                                    <td>{moment(event.calendarInfo.start).format('LT')} - {moment(event.calendarInfo.end).format('LT')}</td>
                                                                    <td>{event.location}</td>
                                                                    <td>{event.registeredEmail.length} / {event.capacity}</td>
                                                                    <td>{moment(event.activationDay).format('dddd[,] MMMM Do YYYY')}</td>
                                                                    <td><Button outline color="success" onClick={() => {this.toggleAnnounceModal(event)}}>Announce</Button></td>
                                                                    <td><Button outline color="warning" onClick={() => {this.toggleViewModal(event.calendarInfo)}}>View</Button></td>
                                                                    <td><Button outline color="danger" onClick={() => {this.toggleDeleteModal(event._id)}}>Delete</Button></td>
                                                                </tr>;
                                                        } else return
                                                    })
                                                }
                                            </tbody>
                                        }
                                    </Table>
                                </div>
                            </Row>
                                <div className="col-md-12 col-sm-12">
                                    <Row className="app-button-container-row">
                                        <div className="app-button-container">
                                            <Button className="app-button" color="secondary" onClick={() => this.toggleCreateModal()} >Create Event</Button>
                                        </div>
                                        <div className="app-button-container">
                                            <Button className="app-button" color="secondary" onClick={() => this.toggleAddAdminModal()} >Add Admin</Button>
                                        </div>
                                    </Row>
                                </div>
                            </div>)}

                    </div>
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false}/>
                </div>
            );
        }
    }
}


export default App;
