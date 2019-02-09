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
            createConfirmPassword: { value: "", valid: true, match: true},
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
        this.username = React.createRef();
        this.password = React.createRef();
        this.name = React.createRef();
        this.email = React.createRef();
        this.confirmPassword = React.createRef();

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
            console.log(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
        this.toggleAddAdminModal();
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
        this.setState({ login: user, });
    }

    displayLogIn() {
        var user = { username: null, admin: false };
        this.setState({ login: user, });
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
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error);
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
            if (confirm === "") {
                this.setState({
                    createConfirmPassword: {value: "", valid: false, match: true},
                });
            }
            if (password !== confirm) {
                this.setState({
                    createConfirmPassword: {value: "", valid: false, match: false},
                });
            }
        }
    }

    handleLoginSubmit() {
        const name = this.username.current.value;
        const password = this.password.current.value;
        axios.post('/login', { username: name, password: password })
        .then(function (response) {
            console.log(response);
            window.location.reload();
        })
        .catch(function (error) {
            if (error.response.status.toString() === "404") {
                toast.error('The username or password you entered is incorrect.', {
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

    handleChange(event) {
        const target = event.target;
        var valid = true;
        if (target.name === "name" && !/^[#/&a-zA-Z0-9- ]*$/.test(target.value)) {
            valid = false;
        }
        else if (target.name === "capacity" && /\D+/.test(target.value)) {
            valid = false;
        }
        else if (target.name === "location" && /[^A-Za-z0-9- ]+/.test(target.value)) {
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
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        })
        this.setState({ viewModal: !this.state.viewModal, });
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
            .then(toast.success('The announcement was sent to the participants of your event.', {
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
              <Row className="basicInfo">
                <Col xs="6" sm="6" md="6" lg="6">
                  <Row>
                      <label>Name</label>
                      <Input name="name" value={this.state.name.value} onChange={this.handleChange} className={this.state.name.valid? "form-control" : "form-control is-invalid"} placeholder="What will it be called?"/>
                      <div className="invalid-feedback">Alphanumeric and can't be empty</div>
                  </Row>
                  <Row>
                      <label>Capacity</label>
                      <Input name="capacity" value={String(this.state.capacity.value)} onChange={this.handleChange} className={this.state.capacity.valid? "form-control" : "form-control is-invalid"} placeholder="How many people?"/>
                      <div className="invalid-feedback">Numbers and can't be empty</div>
                  </Row>
                  <Row>
                      <label>Location</label>
                      <Input name="location" value={this.state.location.value} onChange={this.handleChange} className={this.state.location.valid? "form-control" : "form-control is-invalid"} placeholder="Where will it take place?"/>
                      <div className="invalid-feedback">Alphanumeric and can't be empty</div>
                  </Row> 
                  <Row>
                      <label>Recurrence</label>
                      <fieldset className="inputRecurrence">
                          <select className={this.state.isRecurrent.valid? "custom-select w-100" : "custom-select w-100 is-invalid"} name="isRecurrent" value={this.state.isRecurrent.value} onChange={this.handleChange}>
                            <option disabled='disabled' value="">Will it be a recurring event?</option>
                            <option value="recurring">Yes</option>
                            <option value="non-recurring">No</option>
                          </select>
                          <div className="invalid-feedback">Recurrence type is required</div>
                      </fieldset>
                  </Row>
                </Col>
                <Col xs="6" sm="6" md="6" lg="6">
                  <Row  className="rightInputInBasicInfo">
                    <label>Description</label>
                      <textarea name="description" value={this.state.description.value} onChange={this.handleChange} className={this.state.description.valid? "form-control" : "form-control is-invalid"} placeholder="What will it be about?" rows={5} style={{maxHeight:'199pt', minHeight:'199pt'}}></textarea>
                      <div className="invalid-feedback">Can't be empty</div>
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
                      <span className="input-group-append" id="startIcon">
                        <span className="input-group-text" id="startIcon">
                          <i className="fa fa-calendar"></i>
                        </span>
                      </span>
                      <DatePicker
                        className="input-sm form-control startDate"
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
                        className="input-sm form-control startDate"
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
                      <span className="input-group-prepend" id="endIcon">
                        <span className="input-group-text" id="endIcon">
                          <i className="fa fa-calendar"></i>
                        </span>
                      </span>
                      <div className="invalid-input" style={{visibility: this.state.dateValidLabel}}>Start and end dates are required</div>
                    </div>
                </Col>
              </Row><br/>
              <Row className="recurrenceLabel">
                <Col xs="10" sm="10" md="10" lg="10">
                  <label className="inputName" style={{color: this.state.recurrenceValid}}>Recurrence</label>
                  <ButtonGroup>
                    <Button className="radioButtons" style={{fontSize: '12pt'}} color="secondary" onClick={() => this.updateRecurence("Weekly")} active={this.state.recurrence === "Weekly"}>Weekly</Button>
                    <Button className="radioButtons" style={{fontSize: '12pt'}} color="secondary" onClick={() => this.updateRecurence("Biweekly")} active={this.state.recurrence === "Biweekly"}>Biweekly</Button>
                    <Button className="radioButtons" style={{fontSize: '12pt'}} color="secondary" onClick={() => this.updateRecurence("Triweekly")} active={this.state.recurrence === "Triweekly"}>Triweekly</Button>
                    <Button className="radioButtons" style={{fontSize: '12pt'}} color="secondary" onClick={() => this.updateRecurence("Monthly")} active={this.state.recurrence === "Monthly"}>Monthly</Button>
                  </ButtonGroup>
                  <div className="invalid-input" style={{visibility: this.state.recurrenceValidLabel}}>Recurrence type is required</div>
                </Col>
              </Row><br/>
              <Row className="occurenceLabel">
                <Col xs="10" sm="10" md="10" lg="10">
                  <label className="inputName" style={{color: this.state.daysSelectedValid}}>Weekly Occurence</label>
                  <ButtonGroup name="weeklyOcurrence">
                    <Button className="checkButtons" style={{fontSize: '11.5pt'}} color="secondary" onClick={() => this.updateDaysSelection("Monday")} active={this.state.daysSelected.includes("Monday")}>Monday</Button>
                    <Button className="checkButtons" style={{fontSize: '11.5pt'}} color="secondary" onClick={() => this.updateDaysSelection("Tuesday")} active={this.state.daysSelected.includes("Tuesday")}>Tuesday</Button>
                    <Button className="checkButtons" style={{fontSize: '11.5pt'}} color="secondary" onClick={() => this.updateDaysSelection("Wednesday")} active={this.state.daysSelected.includes("Wednesday")}>Wednesday</Button>
                    <Button className="checkButtons" style={{fontSize: '11.5pt'}} color="secondary" onClick={() => this.updateDaysSelection("Thursday")} active={this.state.daysSelected.includes("Thursday")}>Thursday</Button>
                    <Button className="checkButtons" style={{fontSize: '11.5pt'}} color="secondary" onClick={() => this.updateDaysSelection("Friday")} active={this.state.daysSelected.includes("Friday")}>Friday</Button>
                  </ButtonGroup>
                  <div className="invalid-input" style={{visibility: this.state.daysSelectedValidLabel}}>Weekly occurence is required</div>
                </Col>
              </Row>
            </fieldset>;
          }
          else {
            wizardContentCreate = 
            <fieldset>
              <Row className="allDayLabel">
                <Col xs="8" sm="8" md="8" lg="8">
                  <label className="inputName">Type of event</label>
                  <fieldset>
                    <div className="custom-control custom-toggle d-block my-2">
                      <input type="checkbox" id="customToggle1" name="allDay" onClick={() => this.onRadioBtnClick()} className="custom-control-input"/>
                      <label className="custom-control-label" htmlFor="customToggle1">Will your event last all day?</label>
                    </div>
                  </fieldset>
                </Col>
              </Row><br/>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12">
                  <label className="inputName" style={{color: this.state.dateValidNonRecurr}}>Date & time</label>
                    <div className="input-daterange input-group" id="datepicker-example-2">
                      <span className="input-group-append" id="startIcon">
                        <span className="input-group-text" id="startIcon">
                          <i className="fa fa-calendar"></i>
                        </span>
                      </span>
                      <DatePicker
                        className="input-sm form-control startDate"
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
                        className="input-sm form-control startDate"
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
                      <span className="input-group-prepend" id="endIcon">
                        <span className="input-group-text" id="endIcon">
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
                  <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
                  <label className="inputName" style={{fontSize: '21px'}}>{this.state.name.value}</label>
                  <ul style={{fontSize: '15px'}}>
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
                  <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
                  <label className="inputName" style={{fontSize: '21px'}}>{this.state.name.value}</label>
                  <ul style={{fontSize: '15px'}}>
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
                <div className='sweet-loading center-screen'>
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
                    <div className="py-4" Style="margin-top: 2%">
                        <div className="container py-4">
                            <div className="row justify-content-md-center px-4">
                                <div className="col-sm-12 col-md-7 col-lg-5 p-4 mb-4 card">
                                    <form> 
                                        <h3 Style="text-align: center; padding-bottom: 5%"> Create an account </h3>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group" Style="text-align: left">
                                                        <label htmlFor="name" Style="margin-left: 15%; width: 70%">Full name</label>
                                                        <Input type="text" name="createName" value={this.state.createName.value} onChange={this.handleChange} className={this.state.createName.valid? "form-control" : "form-control is-invalid"} placeholder="Enter your full name" Style="margin-left: 15%; width: 70%"/>
                                                        <div className="invalid-feedback" Style="margin-left: 15%; width: 70%">Name can't be left empty.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group" Style="text-align: left">
                                                        <label htmlFor="email" Style="margin-left: 15%; width: 70%">Email</label>
                                                        <Input type="text" name="createEmail" value={this.state.createEmail.value} onChange={this.handleChange} className={this.state.createEmail.valid? "form-control" : "form-control is-invalid"} placeholder="Enter your email" Style="margin-left: 15%; width: 70%"/>
                                                        <div className="invalid-feedback" Style="margin-left: 15%; width: 70%">Email format should be a@b.c.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group" Style="text-align: left">
                                                        <label htmlFor="username" Style="margin-left: 15%; width: 70%">Username</label>
                                                        <Input type="text" name="createUserName" value={this.state.createUserName.value} onChange={this.handleChange} className={this.state.createUserName.valid? "form-control" : "form-control is-invalid"} placeholder="Enter your username" Style="margin-left: 15%; width: 70%"/>
                                                        <div className="invalid-feedback" Style="margin-left: 15%; width: 70%">Username can't be left empty.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group" Style="text-align: left">
                                                        <label htmlFor="password" Style="margin-left: 15%; width: 70%">Password</label>
                                                        <Input type="text" name="createPassword" value={this.state.createPassword.value} onChange={this.handleChange} className={this.state.createPassword.valid? "form-control" : "form-control is-invalid"} placeholder="Enter your password" Style="margin-left: 15%; width: 70%"/>
                                                        <div className="invalid-feedback" Style="margin-left: 15%; width: 70%">Password can't be left empty.</div>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group" Style="text-align: left">
                                                        <label htmlFor="confirmPassword" Style="margin-left: 15%; width: 70%">Confirm your password</label>
                                                        <Input type="password" name="createConfirmPassword" value={this.state.createConfirmPassword.value} onChange={this.handleChange} className={this.state.createConfirmPassword.valid? "form-control" : "form-control is-invalid"} placeholder="Confirm your password" Style="margin-left: 15%; width: 70%"></Input>
                                                        <div className="invalid-feedback" Style="margin-left: 15%; width: 70%">Passwords do not match.</div>
                                                    </div>
                                                </div>
                                            </Row>  
                                        <input className="btn btn-primary d-flex ml-auto mr-auto" onClick={this.createAccount} Style="margin: 2%" type="button" value="Create"></input>
                                    </form>
                                </div>
                            </div>
                            <p onClick={this.displayLogIn} Style="text-align: center; color: #007bff; cursor: pointer"> Return to log in </p>
                        </div>
                    </div>
                </div>
            )
        } else if (!this.state.login.username) {
            return (
                <div className="section-invert">
                    <div className="py-4" Style="margin-top: 10%">
                        <div className="container py-4">
                            <div className="row justify-content-md-center px-4">
                                <div className="col-sm-12 col-md-7 col-lg-5 p-4 mb-4 card">
                                    <form> 
                                        <h3 Style="text-align: center; padding-bottom: 5%"> Sign In </h3>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group" Style="text-align: left">
                                                        <label htmlFor="username" Style="margin-left: 15%; width: 70%">Username</label>
                                                        <input type="text" className="form-control" id="username" ref={this.username} Style="margin-left: 15%; width: 70%" placeholder="Enter your username"></input>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group" Style="text-align: left">
                                                        <label htmlFor="password" Style="margin-left: 15%; width: 70%">Password</label>
                                                        <input type="password" className="form-control" id="password" ref={this.password} Style="margin-left: 15%; width: 70%" placeholder="Enter your password"></input>
                                                    </div>
                                                </div>
                                            </Row>
                                        <input className="btn btn-primary d-flex ml-auto mr-auto" onClick={this.handleLoginSubmit} Style="margin: 2%" type="button" value="Log in"></input>
                                    </form>
                                </div>
                            </div>
                            <p onClick={this.displayCreateAccount} Style="text-align: center; color: #007bff; cursor: pointer"> Create an account </p>
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
                            <a className="navbar-brand">
                                Umba
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a onClick={this.logOut} className="nav-link">Log Out</a>
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
                                <label className="bottomHomePageText">Scroll down to get started</label>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                            {/*<----------------------- CALENDAR PAGE ----------------------->*/}
                            <div id="our-services" className="our-services section py-4">
                            <div className="counter-alert">
                                {this.state.secondsElapsed > 0 &&
                                    (<Alert color="primary" isOpen={this.state.visible} fade={false}>
                                        <div>
                                            <h4 className="stopwatch-timer">Time left to register for added events: {formattedSeconds(this.state.secondsElapsed)}</h4>
                                        </div>
                                    </Alert>)}
                                    {this.state.secondsElapsed === 0 &&
                                    ( this.unRegisterEvent() )}
                            </div>
                            <h3 className="section-title text-center my-5">Your schedule</h3>
                    
                            <div className="container py-4">
                                <div className="row justify-content-md-center px-4">
                                <div className="contact-form col-sm-12 col-md-12 col-lg-12 p-4 mb-4 card"> 
                    
                                    <Row>
                                        <Col xs="12" sm="12" md="12" lg="12">
                                            <div className="calendar" style={{height: '700px', width: '100%', paddingTop: '5%'}}>
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
                                        <Col xs="12" sm="12" md="12" lg="12" style={{paddingTop: '3%'}}>
                                            <Button outline className="btn btn-secondary" style={{float: 'right'}} onClick={this.toggleRegisterModal}>My Events</Button>
                                            <label className="myEventsErrorLabel" style={{float: 'right', display: this.state.myEventsErrorLabel}}> No added events to show. </label>
                                        </Col>
                                    </Row>
                    
                                    {/*<----------------------- EVENT CREATION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.createModal} toggle={this.toggleCreateModal} className={this.props.className}>
                                        <ModalHeader>
                                            <h2> New Event </h2>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form>
                                                <Row>
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                        <Steps current={this.state.step}>
                                                            {steps.map(item => <Step key={item.title} title={item.title} />)}
                                                        </Steps>
                                                        <div className="steps-content">
                                                            {wizardContentCreate}
                                                        </div>
                                                        <div className="steps-action">
                                                            {
                                                                this.state.step > 0
                                                                && (<Button color="primary" style={{ marginLeft: 8, marginRight: 8 }} onClick={() => this.prevStep()}> Previous </Button>)
                                                            }
                                                            {
                                                                this.state.step < steps.length - 1
                                                                && <Button color="primary" className="" type="submit" onClick={this.nextStep}>Next</Button>
                                                            }
                                                            {
                                                                this.state.step === steps.length - 1
                                                                && <Button color="primary" type="button" onClick={() => this.createEvent()}>Create</Button>
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
                                                                                <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
                                                                                <label className="inputName" style={{fontSize: '21px'}}>{event.calendarInfo.title}</label>
                                                                                <i className="fas fa-times pull-right unregisterFromEvent" onClick={() => this.unregisterFromSingleEvent(event._id)}></i>
                                                                                <ul style={{fontSize: '15px'}}>
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
                                                ? <button type="button" className="btn btn-outline-success pull-right" align="right"onClick={() => {this.registerForEvents()}}>Register</button>
                                                : null
                                                )}
                                        </ModalFooter>
                                    </Modal>


                                    {/*<----------------------- EVENT ANNOUNCE MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.announceModal} toggle={this.toggleAnnounceModal} className={this.props.className}>
                                        <ModalHeader><h2>Announcement</h2></ModalHeader>
                                        <ModalBody>
                                        <form onSubmit={this.notifyEvent} id="announceModal">
                                            <div className="row">
                                                <div className="col">
                                                <div className="form-group">
                                                    <textarea id="announceMessage" ref={this.announceMessage} className="form-control mb-4" rows="10" required="required" placeholder="Enter your message..." style={{minHeight: '250pt', maxHeight:'250pt'}}></textarea>
                                                </div>
                                                </div>
                                            </div>
                                            <div className="announceButton">
                                                <input className="btn btn-success announceButton" type="submit" value="Announce"></input>
                                            </div>
                                        </form>
                                        </ModalBody>
                                    </Modal>

                                    {/*<----------------------- ADD ADMIN MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.addAdminModal} toggle={this.toggleAddAdminModal} className={this.props.className}>
                                        <ModalHeader><h2>Add Admin</h2></ModalHeader>
                                        <ModalBody>
                                            
                                                <label htmlFor="contactFormEmail">Search by email</label>
                                                <Row>
                                                    <div className="col-md-9 col-sm-9 searchInputEmailAddAdmin">
                                                        <input name="email" value={this.state.email.value} onChange={this.handleChangeSearchNewAdmin} className={this.state.email.valid? "form-control" : "form-control is-invalid"} type="email" id="contactFormEmail" required="required" placeholder="Enter the new admin's email" style={{borderTopRightRadius: '0px', borderBottomRightRadius: '0px'}}></input>
                                                        <div className="invalid-feedback">Email address {this.state.email.value} doesn't exist, or is already an admin.</div>
                                                    </div>
                                                    <div className="col-md-3 col-sm-3 searchButtonEmailAddAdmin">
                                                        <Button color="secondary light searchButtonEmailAddAdminChild" onClick={() => {this.searchAdminEmail(this.state.email.value)}}>Search</Button>
                                                    </div>
                                                
                                                    <Col xs="12" sm="12" md="12" lg="12" className="userSelectEventModal" style={{display: this.state.newAdminSearchTable}}>
                                                    <Table className="userSelectEventTable">
                                                        <tbody>
                                                            <tr>
                                                                <td scope="row" className="userTableTop"><span className="userSelectLabel">Name:</span></td>
                                                                <td className="userTableTop"><span className="userSelectData">{this.state.nameUserModal}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="row"><span className="userSelectLabel">Username:</span></td>
                                                                <td><span className="userSelectData">{this.state.userNameModal}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="row"><span className="userSelectLabel">Email:</span></td>
                                                                <td><span className="userSelectData">{this.state.emailUserModal}</span></td>
                                                            </tr>
                                                        </tbody>
                                                    </Table> 
                                                    </Col>
                                                    <div className="col-md-12 col-sm-12">
                                                        <button type="button" className="btn btn-secondary pull-right" align="right" style={{display: this.state.newAdminSearchTable}} onClick={() => {this.addAdmin()}}>Add</button>
                                                    </div>
                                                </Row>
                                        </ModalBody>
                                    </Modal>

                                    {/*<----------------------- EVENT SELECTION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.viewModal} toggle={this.toggleViewModal} className={this.props.className}>
                                        <ModalHeader className="userSelcectModalHeader editEventLabel">
                                        {this.state.instructor !== this.state.login.username &&
                                            (<h2>{this.state.calendarInfo.title}</h2>)}
                                        {this.state.instructor === this.state.login.username &&
                                            (<h2>Edit Event</h2>)}
                                        </ModalHeader>
                                        <ModalBody className="userSelectEventModalParent">
                                            {this.state.instructor !== this.state.login.username &&
                                            (<Row className="userSelectEventModal">
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                    <Table className="userSelectEventTable">
                                                        <tbody>
                                                        <tr>
                                                            <td scope="row" className="userTableTop"><span className="userSelectLabel">Instructor:</span></td>
                                                            <td className="userTableTop"><span className="userSelectData">{this.state.instructor}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="userSelectLabel">Date:</span></td>
                                                            <td><span className="userSelectData">{moment(this.state.calendarInfo.start).format("dddd [,] MMMM Do YYYY")}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="userSelectLabel">Time:</span></td>
                                                            <td><span className="userSelectData">From {moment(this.state.calendarInfo.start).format("H:mm")} to {moment(this.state.calendarInfo.end).format("H:mm")}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="userSelectLabel">Location:</span></td>
                                                            <td><span className="userSelectData">{this.state.location.value}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="userSelectLabel">Capacity:</span></td>
                                                            <td><span className="userSelectData">{this.state.liveCapacity} / {this.state.capacity.value}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><span className="userSelectLabel">Description:</span></td>
                                                            <td><span className="userSelectData">{this.state.description.value}</span></td>
                                                        </tr>
                                                        {this.state.isRecurrent.value &&
                                                        <tr>
                                                            <td scope="row"><span className="userSelectLabel">Recurrence:</span></td>
                                                            <td><span className="userSelectData">{this.state.recurrence}</span></td>
                                                        </tr>} 
                                                        </tbody>
                                                    </Table> 
                                                    </Col>
                                                </Row> )}
                                            {this.state.instructor === this.state.login.username &&
                                            (<Row>
                                            <fieldset>
                                                <Row className="basicInfo">
                                                    <Col xs="6" sm="6" md="6" lg="6">
                                                    <Row>
                                                        <label>Name</label>
                                                        <Input name="name" value={this.state.name.value} onChange={this.handleChange} className={this.state.name.valid? "form-control" : "form-control is-invalid"} placeholder="What will it be called?"/>
                                                        <div className="invalid-feedback">Characters only and can't be empty</div>
                                                    </Row>
                                                    <Row>
                                                        <label>Capacity</label>
                                                        <Input name="capacity" value={String(this.state.capacity.value)} onChange={this.handleChange} className={this.state.capacity.valid? "form-control" : "form-control is-invalid"} placeholder="How many people?"/>
                                                        <div className="invalid-feedback">Numbers only and can't be empty</div>
                                                    </Row>
                                                    <Row>
                                                        <label>Location</label>
                                                        <Input name="location" value={this.state.location.value} onChange={this.handleChange} className={this.state.location.valid? "form-control" : "form-control is-invalid"} placeholder="Where will it take place?"/>
                                                        <div className="invalid-feedback">Alphanumeric only and can't be empty</div>
                                                    </Row> 
                                                    <Row>
                                                        <label className="inputName editLabel">Activation day</label>
                                                        <div className="input-daterange input-group" id="datepicker-example-2">
                                                        <span className="input-group-append" id="startIcon">
                                                            <span className="input-group-text" id="startIcon">
                                                            <i className="fa fa-calendar"></i>
                                                            </span>
                                                        </span>
                                                            <DatePicker
                                                                className="input-sm form-control activationDate"
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
                                                    <Row  className="rightInputInBasicInfo">
                                                        <label>Description</label>
                                                        <textarea name="description" value={this.state.description.value} onChange={this.handleChange} className={this.state.description.valid? "form-control" : "form-control is-invalid"} placeholder="What is your event about?" style={{minHeight:'204pt', maxHeight:'204pt'}}></textarea>
                                                        <div className="invalid-feedback">Can't be empty</div>
                                                    </Row>
                                                    </Col>
                                                </Row>
                                                </fieldset>
                                                <Col xs="12" sm="12" md="12" lg="12" className="editDatesLabel">
                                                <label className="inputName editLabel">Date & time</label>
                                                    <div className="input-daterange input-group" id="datepicker-example-2">
                                                    <span className="input-group-append" id="startIcon">
                                                        <span className="input-group-text" id="startIcon">
                                                        <i className="fa fa-calendar"></i>
                                                        </span>
                                                    </span>
                                                    <DatePicker
                                                        className="input-sm form-control startDate"
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
                                                        className="input-sm form-control startDate"
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
                                                    <span className="input-group-prepend" id="endIcon">
                                                        <span className="input-group-text" id="endIcon">
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
                                            <Button color="primary" onClick={() => {this.addEventBasket(this.state.eventId, this.state.currentEventId)}} style={{float: 'right'}}>Add</Button>
                                            <label className="myEventsErrorLabel" style={{float: 'right', paddingRight: '4%', display: this.state.allReadyRegisteredErrorLabel}}> You're already registered to this event. </label>
                                            <label className="myEventsErrorLabel" style={{float: 'right', paddingRight: '4%', display: this.state.fullCapacityErrorLabel}}> This event is already full. </label>
                                            </Col>)}
                                        {this.state.instructor === this.state.login.username &&
                                            (<Button color="warning" onClick={() => {this.editEvent()}}>Save</Button>)}
                                        </ModalFooter>
                                    </Modal>

                                    {/*<----------------------- EVENT ACTIVATION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.activateModal} toggle={this.toggleActivateModal} className={this.props.className}>
                                        <ModalHeader>
                                        <h2>Registration set-up</h2>
                                        </ModalHeader>
                                        <ModalBody>
                                        <Row className="allDayLabel">
                                            <Col xs="8" sm="8" md="8" lg="8">
                                            <fieldset>
                                                <div className="custom-control custom-toggle d-block my-2">
                                                <input type="checkbox" id="customToggle1" name="activateToday" onClick={() => this.onRadioBtnActivateClick()} className="custom-control-input"/>
                                                <label className="custom-control-label" htmlFor="customToggle1">Today</label>
                                                </div>
                                            </fieldset>
                                            </Col>
                                        </Row><br/>
                                        <Row>
                                            <Col xs="12" sm="12" md="12" lg="12">
                                                <div className="input-daterange input-group" id="datepicker-example-2">
                                                <span className="input-group-append" id="startIcon">
                                                    <span className="input-group-text" id="startIcon">
                                                    <i className="fa fa-calendar"></i>
                                                    </span>
                                                </span>
                                                <DatePicker
                                                    className="input-sm form-control activationDate"
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
                                        <Row className="activateButtonRow pull-right">
                                            <Button color="success" onClick={() => this.activateEvent()} >Activate</Button>  
                                        </Row>
                                        </ModalBody>
                                    </Modal>
                                    {/*<----------------------- EVENT DELETE MODAL ----------------------->*/}

                                    <Modal isOpen={this.state.deleteModal} toggle={this.toggleDeleteModal} className={this.props.className}>
                                        <ModalHeader>
                                        <h2>Delete event</h2>
                                        </ModalHeader>
                                        <ModalBody>
                                        <Row className="allDayLabel">
                                        <p className="deleteMessage">Are you sure you wish to delete this event?</p>
                                        </Row><br/>
                                        <Row className="deleteButtonRow pull-right">
                                            <Button color="danger" onClick={() => {this.deleteEvent()}}>Delete</Button>
                                        </Row>
                                        </ModalBody>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="contact section-invert py-4">
                        {this.state.login.admin === false &&
                        (<div>
                            <Row>
                                <div className="col-md-12 col-sm-12">
                                    <h1 className="adminName">My Events</h1>
                                </div>
                            </Row>
                            <Row className="unpublishedTable">
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
                                            <label className="noEventsMessage">Get started by creating an event</label>
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
                                                                <td><Button outline color="warning" onClick={() => {this.toggleViewModal(event.calendarInfo)}}>Edit</Button></td>
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
                        </div>)}
                    </div>
                    



                    <div className="contact section-invert py-4">
                        {this.state.login.admin === true &&
                        (<div>
                            <Row>
                                <div className="col-md-12 col-sm-12">
                                    <h1 className="adminName">Admin</h1>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-12 col-sm-12">
                                    <h3 className="adminInactiveName">Inactive Events</h3>
                                </div>
                            </Row>
                            <Row className="unpublishedTable">
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
                                            <label className="noEventsMessage">Get started by creating an event</label>
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
                                                                <td><Button outline color="warning" onClick={() => {this.toggleViewModal(event.calendarInfo)}}>Edit</Button></td>
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
                                    <h3 className="adminInactiveName">Active Events</h3>
                                </div>
                            </Row>
                            <Row className="publishedTable">
                                <div className="col-md-12 col-sm-12">
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Location</th>
                                            <th>Current Capacity</th>
                                            <th>Registration Started</th>
                                        </tr>
                                        </thead>
                                        {flatten3(this.state.events, this.state.login.username).length === 0 &&
                                            <label className="noEventsMessage">Activate an event to make it public</label>
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
                                                                    <td><Button outline color="warning" onClick={() => {this.toggleViewModal(event.calendarInfo)}}>Edit</Button></td>
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
                                    <Row className="createEventButton">
                                        <div className="bottomAdminButton">
                                            <Button className="templateButton" color="secondary" onClick={() => this.toggleCreateModal()} >Create Event</Button>
                                        </div>
                                        <div className="bottomAdminButton">
                                            <Button className="templateButton" color="secondary" onClick={() => this.toggleAddAdminModal()} >Add Admin</Button>
                                        </div>
                                    </Row>
                                </div>
                            </div>)}

                    </div>
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggablePercent={60} pauseOnHover={false}/>
                    
                    <footer>
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                            <div className="container">
                                <a className="navbar-brand">Umba</a>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                            </div>
                        </nav>
                    </footer>
                </div>
            );
        }
    }
}


export default App;
