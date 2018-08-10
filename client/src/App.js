import React, { Component } from 'react';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Button, ButtonGroup, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';
import { Steps} from 'antd';
import 'antd/dist/antd.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';
import { BeatLoader, PulseLoader } from 'react-spinners';
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

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            createModal : false,
            registerModal: false,
            viewModal: false,
            step: 0,
            name: { value: "", valid: true },
            description: { value: "", valid: true },
            location: { value: "", valid: true },
            capacity: { value: 0, valid: true },
            daysSelected: [],
            isRecurrent: { value: "", valid: true },
            recurrence: "",
            allDay: false,
            events: [],
            login: { username: "default", admin: false }
        }

        this.username = React.createRef();
        this.password = React.createRef();

        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.updateRecurence = this.updateRecurence.bind(this);
        this.updateDaysSelection = this.updateDaysSelection.bind(this);
        this.toggleCreateModal = this.toggleCreateModal.bind(this);
        this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
        this.toggleViewModal = this.toggleViewModal.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }

    handleChangeStart(date) {
        this.setState({ startDate: date });
    }

    handleChangeEnd(date) {
        this.setState({ endDate: date });
    }

    updateRecurence(selection) {
        this.setState({ recurrence: selection });
    }

    updateDaysSelection(selected) {
        const index = this.state.daysSelected.indexOf(selected);
        if (index < 0) {
            this.state.daysSelected.push(selected);
        } else {
            this.state.daysSelected.splice(index, 1);
        }
        
        this.setState({ daysSelected: [...this.state.daysSelected] });
    }

    toggleCreateModal() {
        this.setState({ createModal: !this.state.createModal });
    }

    toggleRegisterModal() {
        this.setState({ registerModal: !this.state.registerModal });
    }
    toggleViewModal() {
        this.setState({ viewModal: !this.state.viewModal });
    }

    nextStep(event) {
        event.preventDefault();
        if (this.state.step == 0) {
            var recurrence = this.state.isRecurrent.value;
            var name = this.state.name.value;
            var capacity = this.state.capacity.value;
            var location = this.state.location.value;
            var description = this.state.description.value;
            if ((name && capacity && location && description) == false) {
                if (recurrence == "") {
                    this.setState({ isRecurrent: { value: recurrence, valid: false } });
                }
                if (name == "") {
                    this.setState({ name: { value: name, valid: false } });
                }
                if (capacity == "") {
                    this.setState({ capacity: { value: capacity, valid: false } });
                }
                if (location == "") {
                    this.setState({ location: { value: location, valid: false } }); 
                }
                if (description == "") {
                    this.setState({  description: { value: description, valid: false } });
                }
            } else {
                const step = this.state.step + 1;
                this.setState({ step });
            }
        } else if (this.state.step == 1) {

            const step = this.state.step + 1;
            this.setState({ step });
            // if (TO JAY: FILL IN HERE CONDITION FOR START AND END DATE){
                
            // }
            // else {
            //   const step = this.state.step + 1;
            //   this.setState({ step });
            // }
        }
    }
    prevStep() {
        const step = this.state.step - 1;
        this.setState({ step });
    }

    handleLoginSubmit() {
        console.log(this.username.current.value);
        console.log(this.password.current.value);
        // axios.post('/login', { username: this.state.username })
        // .then(function (response) {
        //     console.log(response);
        //     this.setState({events: this.state.events.concat(newEvent)});
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
    }

    handleChange(event) {
        const target = event.target;
        var valid = true;
        if (target.name === "name" && !/^[a-zA-Z- ]*$/.test(target.value)) {
            valid = false;
        }
        else if (target.name === "capacity" && /\D+/.test(target.value)) {
            valid = false;
        }
        else if (target.name === "location" && /[^A-Za-z0-9- ]+/.test(target.value)) {
            valid = false;
        }
        this.setState({ [target.name]: { value: target.value, valid: valid } });
    }

    createEvent() {
        var sDate = moment(this.state.startDate).format()
        var eDate = moment(this.state.endDate).format()
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
            isRecurrent: this.state.isRecurrent.value == "recurring", 
            daysSelected: this.state.daysSelected, 
            recurrence: this.state.recurrence,
            allDay: this.state.allDay,
            calendarInfo: event 
        }

        axios.post('/events', newEvent)
        .then(function (response) {
            console.log(response);
            this.setState({events: this.state.events.concat(newEvent)});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    componentWillMount() {

        var user = {};
        let component = this;
        axios.get('/info')
        .then(function (response) {
            console.log(response.data.username);
            user.username = response.data.username;
            user.admin = response.data.admin;
            component.setState({login: user});

            axios.get('/events')
            .then(function (response) {
                response.data.forEach(event => {
                    event.calendarInfo.start = new Date(event.calendarInfo.start);
                    event.calendarInfo.end = new Date(event.calendarInfo.end);
                });
                component.setState({events: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
        })
        .catch(function (error) {
            console.log("Redirecting to login");
            component.setState({login: {}});
        });
    }

    render() {

        var events = this.state.events.map(x => x.calendarInfo);
        let wizardContent;
        if (this.state.step === 0) {
            wizardContent = 
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
                            <Input name="description" value={this.state.description.value} onChange={this.handleChange} className={this.state.description.valid? "form-control" : "form-control is-invalid"} placeholder="What is your event about?" style={{height:'199pt'}}/>
                            <div className="invalid-feedback">Can't be empty</div>
                        </Row>
                        </Col>
                    </Row>
                </fieldset>;
        } else if (this.state.step === 1) {
            if (this.state.isRecurrent.value === "recurring") {
                wizardContent = 
                    <fieldset> 
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12">
                            <label className="inputName">Date & time</label>
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
                                    minTime={moment().hours(9).minutes(0)}
                                    maxTime={moment().hours(18).minutes(0)}
                                    dateFormat="LLL"
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
                                    minTime={moment().hours(9).minutes(0)}
                                    maxTime={moment().hours(18).minutes(0)}
                                    dateFormat="LLL"
                                />
                                <span className="input-group-prepend" id="endIcon">
                                    <span className="input-group-text" id="endIcon">
                                    <i className="fa fa-calendar"></i>
                                    </span>
                                </span>
                                </div>
                            </Col>
                        </Row><br/>
                        <Row className="recurrenceLabel">
                            <Col xs="10" sm="10" md="10" lg="10">
                            <label className="inputName">Recurrence</label>
                            <ButtonGroup>
                                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.updateRecurence("Weekly")} active={this.state.recurrence === "Weekly"}>Weekly</Button>
                                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.updateRecurence("Biweekly")} active={this.state.recurrence === "Biweekly"}>Biweekly</Button>
                                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.updateRecurence("Triweekly")} active={this.state.recurrence === "Triweekly"}>Triweekly</Button>
                                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.updateRecurence("Monthly")} active={this.state.recurrence === "Monthly"}>Monthly</Button>
                            </ButtonGroup>
                            </Col>
                        </Row><br/>
                        <Row className="occurenceLabel">
                            <Col xs="10" sm="10" md="10" lg="10">
                            <label className="inputName">Weekly Occurence</label>
                            <ButtonGroup name="weeklyOcurrence">
                                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.updateDaysSelection("Monday")} active={this.state.daysSelected.includes("Monday")}>Monday</Button>
                                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.updateDaysSelection("Tuesday")} active={this.state.daysSelected.includes("Tuesday")}>Tuesday</Button>
                                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.updateDaysSelection("Wednesday")} active={this.state.daysSelected.includes("Wednesday")}>Wednesday</Button>
                                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.updateDaysSelection("Thursday")} active={this.state.daysSelected.includes("Thursday")}>Thursday</Button>
                                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.updateDaysSelection("Friday")} active={this.state.daysSelected.includes("Friday")}>Friday</Button>
                            </ButtonGroup>
                            </Col>
                        </Row>
                    </fieldset>;
            } else {
                wizardContent = 
                    <fieldset> 
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12">
                            <label className="inputName">Date & time</label>
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
                                    minTime={moment().hours(9).minutes(0)}
                                    maxTime={moment().hours(18).minutes(0)}
                                    dateFormat="LLL"
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
                                    minTime={moment().hours(9).minutes(0)}
                                    maxTime={moment().hours(18).minutes(0)}
                                    dateFormat="LLL"
                                />
                                <span className="input-group-prepend" id="endIcon">
                                    <span className="input-group-text" id="endIcon">
                                    <i className="fa fa-calendar"></i>
                                    </span>
                                </span>
                                </div>
                            </Col>
                        </Row><br/>
                        <Row className="allDayLabel">
                            <Col xs="8" sm="8" md="8" lg="8">
                            <label className="inputName">Type of event</label>
                            <fieldset>
                                <div className="custom-control custom-toggle d-block my-2">
                                <input type="checkbox" id="customToggle1" name="customToggle1" className="custom-control-input"/>
                                <label className="custom-control-label" htmlFor="customToggle1">Will your event last all day?</label>
                                </div>
                            </fieldset>
                            </Col>
                        </Row>
                    </fieldset>
            }
        } else {
            if (this.state.isRecurrent.value === "non-recurring") {
                wizardContent = 
                    <fieldset> 
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12">
                            <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
                            <label className="inputName" style={{fontSize: '21px'}}>{this.state.name.value}</label>
                            <ul style={{fontSize: '15px'}}>
                                <li><span>Instructor:</span> <span>Leyla Kinaze</span></li>
                                <li><span>Capacity:</span> <span>{String(this.state.capacity.value)}</span></li>
                                <li><span>Type of event:</span> <span>Non-recurring</span></li>
                                <li><span>All-day event:</span> <span>{this.state.allDay}</span></li>
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
                wizardContent = 
                    <fieldset> 
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12">
                            <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
                            <label className="inputName" style={{fontSize: '21px'}}>{this.state.name.value}</label>
                            <ul style={{fontSize: '15px'}}>
                                <li><span>Instructor:</span> <span>Leyla Kinaze</span></li>
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

        console.log(this.state.login);

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
                                                    <div className="form-group" Style="text-align: center">
                                                        <label htmlFor="username">Email</label>
                                                        <input type="text" className="form-control" id="username" ref={this.username} Style="margin-left: 15%; width: 70%" placeholder="Enter your email"></input>
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <div className="col-md-12 col-sm-12">
                                                    <div className="form-group" Style="text-align: center">
                                                        <label htmlFor="password">Password</label>
                                                        <input type="password" className="form-control" id="password" ref={this.password} Style="margin-left: 15%; width: 70%" placeholder="Enter your password"></input>
                                                    </div>
                                                </div>
                                            </Row>
                                        <input className="btn btn-primary btn-pill d-flex ml-auto mr-auto" onClick={this.handleLoginSubmit} Style="margin-top: 12%" type="button" value="Log in"></input>
                                    </form>
                                </div>
                            </div>
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
                        <a className="navbar-brand" href="#">
                            Umba
                        </a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">My profile</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Log Out</a>
                            </li>
                            </ul>
                        </div>
                        </nav>
                    </div>
    
                    {/*<----------------------- MAIN PAGE ----------------------->*/}
                    <div className="inner-wrapper mt-auto mb-auto container">
                        <div className="row">
                        <div className="col-md-7">
                            <h1 className="welcome-heading display-4 text-white">Let's move.</h1>
                            <button href="#our-services" className="btn btn-lg btn-outline-white btn-pill align-self-center">Get started</button>
                        </div>
                        </div>
                    </div>
                    </div>
    
                    {/*<----------------------- CALENDAR PAGE ----------------------->*/}
                    <div id="our-services" className="our-services section py-4">
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
                                                onSelectEvent={() => this.toggleViewModal()}
                                                onSelectSlot={(date) => this.toggleCreateModal(date)}
                                                events={events}
                                                startAccessor='start'
                                                endAccessor='end'>
                                            </BigCalendar>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12" md="12" lg="12" style={{paddingTop: '3%'}}>
                                            <Button className="btn btn-outline-danger btn-pill" style={{float: 'right'}} onClick={this.toggleRegisterModal}>Register</Button>
                                        </Col>
                                    </Row>
    
                                    {/*<----------------------- EVENT CREATION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.createModal} toggle={this.toggleCreateModal} className="createModal" className={this.props.className}>
                                        <ModalBody>
                                            <h2> New Event </h2>
                                            <Form>
                                                <Row>
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                        <Steps current={this.state.step}>
                                                            {steps.map(item => <Step key={item.title} title={item.title} />)}
                                                        </Steps>
                                                        <div className="steps-content">
                                                            {wizardContent}
                                                        </div>
                                                        <div className="steps-action">
                                                            {
                                                                this.state.step > 0
                                                                && (<Button style={{ marginLeft: 8 }} onClick={() => this.prevStep()}> Previous </Button>)
                                                            }
                                                            {
                                                                this.state.step < steps.length - 1
                                                                && <Button className="" type="submit" onClick={this.nextStep}>Next</Button>
                                                            }
                                                            {
                                                                this.state.step === steps.length - 1
                                                                && <Button type="button" onClick={() => this.createEvent()}>Create</Button>
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
    
                                    {/*<----------------------- EVENT SUBMIT MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.registerModal} toggle={this.toggleRegisterModal} className={this.props.className}>
                                        <ModalHeader>New Event</ModalHeader>
                                        <ModalBody>
                                            <form>
                                                <Row>
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                    <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
                                                    <label className="inputName" style={{fontSize: '21px'}}>Zumba</label>
                                                    <ul style={{fontSize: '15px'}}>
                                                        <li><span>Instructor:</span> <span>Leyla Kinaze</span></li>
                                                        <li><span>Type of event:</span> <span>recurrent</span></li>
                                                        <li><span>Time & date:</span> <span>every Monday at 11h45AM</span></li>
                                                        <li><span>Location:</span> <span>Ericsson gym</span></li>
                                                    </ul> 
                                                    <hr/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                    <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
                                                    <label className="inputName" style={{fontSize: '21px'}}>Cinema</label>
                                                    <ul style={{fontSize: '15px'}}>
                                                        <li><span>Instructor:</span> <span>Jay Abi-Saad</span></li>
                                                        <li><span>Type of event:</span> <span>recurrent</span></li>
                                                        <li><span>Time & date:</span> <span>every Thursday at 5h00PM</span></li>
                                                        <li><span>Location:</span> <span>Ericsson conference room</span></li>
                                                    </ul> 
                                                    <hr/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="12" md="12" lg="12">
                                                    <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
                                                    <label className="inputName" style={{fontSize: '21px'}}>Hackathon</label>
                                                    <ul style={{fontSize: '15px'}}>
                                                        <li><span>Instructor:</span> <span>Mathieu Lapointe</span></li>
                                                        <li><span>Type of event:</span> <span>one time</span></li>
                                                        <li><span>Time & date:</span> <span>Wednesday at 4h45PM</span></li>
                                                        <li><span>Location:</span> <span>Ericsson garage</span></li>
                                                    </ul> 
                                                    <hr/>
                                                    </Col>
                                                </Row>
                                            </form>
                                        </ModalBody>
                                        <ModalFooter>
                                            <button type="button" className="btn btn-outline-success pull-right" align="right">Register</button>
                                        </ModalFooter>
                                    </Modal>
    
                                    {/*<----------------------- EVENT SELECTION MODAL ----------------------->*/}
                                    <Modal isOpen={this.state.viewModal} toggle={this.toggleViewModal} className={this.props.className}>
                                        <ModalBody>
                                            <h2> Woohoo2 </h2>
                                        </ModalBody>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/*<---------------------FEEDBACK--------------------->*/}
                    <div className="contact section-invert py-4">
                    <h3 className="section-title text-center m-5">Contact Us</h3>
                    <div className="container py-4">
                        <div className="row justify-content-md-center px-4">
                        <div className="contact-form col-sm-12 col-md-10 col-lg-7 p-4 mb-4 card">
                            <form>
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="contactFormFullName">Full Name</label>
                                    <input type="email" className="form-control" id="contactFormFullName" placeholder="Enter your full name"></input>
                                </div>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="contactFormEmail">Email address</label>
                                    <input type="email" className="form-control" id="contactFormEmail" placeholder="Enter your email address"></input>
                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                <div className="form-group">
                                    <label htmlFor="exampleInputMessage1">Message</label>
                                    <textarea id="exampleInputMessage1" className="form-control mb-4" rows="10" placeholder="Enter your message..." name="message"></textarea>
                                </div>
                                </div>
                            </div>
                            <input className="btn btn-primary btn-pill d-flex ml-auto mr-auto" type="submit" value="Send Your Message"></input>
                            </form>
                        </div>
                        </div>
                    </div>
                    </div>
    
                    {/*<----------------------- FOOTER ----------------------->*/}                 
                    <footer>
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                            <div className="container">
                                <a className="navbar-brand" href="#">Ericsson</a>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav ml-auto">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Our Services</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">My profile</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Contact Us</a>
                                    </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </footer>
                </div>
            );
        }
    }
}

export default App;
