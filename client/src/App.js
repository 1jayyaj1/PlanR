import React, { Component } from 'react';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Button, ButtonGroup, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';
import { Steps, message } from 'antd';
import 'antd/dist/antd.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Step = Steps.Step;

const steps = [{
  title: 'Basic info',
}, {
  title: 'Time & date',
}, {
  title: 'Summary',
}];

var events =
  [
    {
      capacity: "",
      location: "",
      description: "",
      isRecurrent: "",
      recurrence: "",
      weeklyOcurrence: "",
      calendarInfo: 
        {
          title: 'Dummy event',
          allDay: false,
          start: new Date('2018-07-17T10:24:00'),
          end: new Date('2018-07-17T13:27:00')
        }
    }
]

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
      daysSelected: [],
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      capacity: "",
      isRecurrent: "",
      recurrence: "",
      events: events
    }

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
    this.toggleCreateModal = this.toggleCreateModal.bind(this);
    this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
    this.toggleViewModal = this.toggleViewModal.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }

  handleChangeStart(date) {
    this.setState({
      startDate: date,
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: date,
    });
  }

  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }

  onCheckboxBtnClick(selected) {
    const index = this.state.daysSelected.indexOf(selected);
    if (index < 0) {
      this.state.daysSelected.push(selected);
    } else {
      this.state.daysSelected.splice(index, 1);
    }
    this.setState({ daysSelected: [...this.state.daysSelected] });
  }

  toggleCreateModal() {
    this.setState({
      createModal: !this.state.createModal
    });
  }

   toggleRegisterModal() {
    this.setState({
      registerModal: !this.state.registerModal
    });
  }
  toggleViewModal() {
    this.setState({
      viewModal: !this.state.viewModal
    });
  }

  nextStep() {
    const step = this.state.step + 1;
    this.setState({ step });
  }

  prevStep() {
    const step = this.state.step - 1;
    this.setState({ step });
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  createEvent() {
    var sDate = moment(this.state.startDate).format()
    var sTime = this.state.startTime
    var sDateTime = sDate.replace(/00:00{1}/, sTime);
    var eDate = moment(this.state.endDate).format()
    var eTime = this.state.endTime
    var eDateTime = eDate.replace(/00:00{1}/, eTime);
    var event = {
      title: this.state.name,
      allDay: false,
      start:  new Date(sDateTime) ,
      end: new Date(eDateTime)
    }
    var obj = {capacity: this.state.capacity, description: this.state.description, location: this.state.location, isRecurrent: this.state.isRecurrent, recurrence: this.state.rSelected, weeklyOcurrence: this.state.daysSelected, calendarInfo: event }
    this.setState({events: this.state.events.concat(obj)});
    console.log(obj);
  }

  render() {

    let wizardContent;
    if (this.state.step === 0) {
      wizardContent = 
        <fieldset>
          <Row className="basicInfo">
            <Col xs="6" sm="6" md="6" lg="6">
              <Row>
                  <label>Name</label>
                  <Input name="name" value={this.state.name} onChange={this.handleChange} className="inputName" placeholder="What will it be called?" />
              </Row>
              <Row>
                  <label>Capacity</label>
                  <Input name="capacity" value={this.state.capacity} onChange={this.handleChange} className="inputCapacity" placeholder="How many people?" />
              </Row>
              <Row>
                  <label>Location</label>
                  <Input name="location" value={this.state.location} onChange={this.handleChange} className="inputLocation" placeholder="Where will it take place?" />
              </Row>
              
              <Row>
                  <label>Recurrence</label>
                  <fieldset className="inputRecurrence">
                      <select class="custom-select w-100" required="" name="isRecurrent" value={this.state.isRecurrent} onChange={this.handleChange}>
                        <option value="">Will it be a recurring event?</option>
                        <option value="recurring">Yes</option>
                        <option value="non-recurring">No</option>
                      </select>
                  </fieldset>
              </Row>

            </Col>
            <Col xs="6" sm="6" md="6" lg="6">
              <Row  className="rightInputInBasicInfo">
                <label>Description</label>
                  <Input name="description" value={this.state.description} onChange={this.handleChange} className="inputDescription" placeholder="What is your event about?" />
              </Row>
            </Col>
          </Row>
        </fieldset>;
    }
    else if (this.state.step === 1) {
      wizardContent = 
        <fieldset> 
          <Row>
            <Col xs="12" sm="12" md="12" lg="12">
              <label className="inputName">Date</label>
                <div className="input-daterange input-group" id="datepicker-example-2">
                  <span className="input-group-append" id="startIcon">
                    <span className="input-group-text" id="startIcon">
                      <i className="fa fa-calendar"></i>
                    </span>
                  </span>
                  <DatePicker selected={this.state.startDate} onChange={this.handleChangeStart} className="input-sm form-control startDate" name="start" placeholderText="Start date"/>
                  <DatePicker selected={this.state.endDate} onChange={this.handleChangeEnd} className="input-sm form-control endDate" name="end" placeholderText="End date"/>
                  <span className="input-group-prepend" id="endIcon">
                    <span className="input-group-text" id="endIcon">
                      <i className="fa fa-calendar"></i>
                    </span>
                  </span>
                </div>
            </Col>
          </Row><br/>
          <Row>
            <Col xs="10" sm="10" md="10" lg="10">
              <Row className="startTime">
                <Col xs="6" sm="6" md="6" lg="6">
                  <label className="inputName">Start time</label>
                    <fieldset>
                      <select class="custom-select w-100" required="" name="startTime" value={this.state.startTime} onChange={this.handleChange}>
                        <option value="">When will it start?</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="09:15">9:15 AM</option>
                        <option value="09:30">9:30 AM</option>
                        <option value="09:45">9:45 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:15">10:15 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="10:45">10:45 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:15">11:15 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="11:45">11:45 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:15">12:15 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="12:45">12:45 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="13:15">1:15 PM</option>
                        <option value="13:30">1:30 PM</option>
                        <option value="13:45">1:45 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="14:15">2:15 PM</option>
                        <option value="14:30">2:30 PM</option>
                        <option value="14:45">2:45 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="15:15">3:15 PM</option>
                        <option value="15:30">3:30 PM</option>
                        <option value="15:45">3:45 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="16:15">4:15 PM</option>
                        <option value="16:30">4:30 PM</option>
                        <option value="16:45">4:45 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="17:15">5:15 PM</option>
                        <option value="17:30">5:30 PM</option>
                        <option value="17:45">5:45 PM</option>
                        <option value="18:00">6:00 PM</option>
                      </select>
                    </fieldset>
                </Col>
                <Col xs="6" sm="6" md="6" lg="6">
                  <label className="inputName">End time</label>
                  <fieldset>
                      <select class="custom-select w-100" required="" name="endTime" value={this.state.endTime} onChange={this.handleChange}>
                        <option value="">When will it end?</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="09:15">9:15 AM</option>
                        <option value="09:30">9:30 AM</option>
                        <option value="09:45">9:45 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:15">10:15 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="10:45">10:45 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:15">11:15 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="11:45">11:45 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:15">12:15 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="12:45">12:45 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="13:15">1:15 PM</option>
                        <option value="13:30">1:30 PM</option>
                        <option value="13:45">1:45 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="14:15">2:15 PM</option>
                        <option value="14:30">2:30 PM</option>
                        <option value="14:45">2:45 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="15:15">3:15 PM</option>
                        <option value="15:30">3:30 PM</option>
                        <option value="15:45">3:45 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="16:15">4:15 PM</option>
                        <option value="16:30">4:30 PM</option>
                        <option value="16:45">4:45 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="17:15">5:15 PM</option>
                        <option value="17:30">5:30 PM</option>
                        <option value="17:45">5:45 PM</option>
                        <option value="18:00">6:00 PM</option>
                      </select>
                    </fieldset>
                </Col>
              </Row>
            </Col>
          </Row><br/>
          <Row className="recurrenceLabel">
            <Col xs="10" sm="10" md="10" lg="10">
              <label className="inputName">Recurrence</label>
              <ButtonGroup>
                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.onRadioBtnClick("Weekly")} active={this.state.rSelected === "Weekly"} name="recurrence" checked={this.state.recurrence === 'weekly'}  >Weekly</Button>
                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.onRadioBtnClick("Biweekly")} active={this.state.rSelected === "Biweekly"}>Biweekly</Button>
                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.onRadioBtnClick("Triweekly")} active={this.state.rSelected === "Triweekly"}>Triweekly</Button>
                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.onRadioBtnClick("Monthly")} active={this.state.rSelected === "Monthly"}>Monthly</Button>
              </ButtonGroup>
            </Col>
          </Row><br/>
          <Row className="occurenceLabel">
            <Col xs="10" sm="10" md="10" lg="10">
              <label className="inputName">Weekly Occurence</label>
              <ButtonGroup name="weeklyOcurrence">
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Monday")} active={this.state.daysSelected.includes("Monday")}>Monday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Tuesday")} active={this.state.daysSelected.includes("Tuesday")}>Tuesday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Wednesday")} active={this.state.daysSelected.includes("Wednesday")}>Wednesday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Thursday")} active={this.state.daysSelected.includes("Thursday")}>Thursday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Friday")} active={this.state.daysSelected.includes("Friday")}>Friday</Button>
              </ButtonGroup>
            </Col>
          </Row>
        </fieldset>;
    }  else {
      if (this.state.isRecurrent === "non-recurring"){
        wizardContent = 
        <fieldset> 
          <Row>
            <Col xs="12" sm="12" md="12" lg="12">
              <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
              <label className="inputName" style={{fontSize: '21px'}}>{this.state.name}</label>
              <ul style={{fontSize: '15px'}}>
                <li><span>Instructor:</span> <span>Leyla Kinaze</span></li>
                <li><span>Capacity:</span> <span>{this.state.capacity}</span></li>
                <li><span>Type of event:</span> <span>Non-recurring</span></li>
                <li><span>Time & date:</span> <span>{moment(this.state.startDate).format("dddd [,] MMMM Do YYYY")} from {this.state.startTime} to {this.state.endTime}</span></li>
                <li><span>Location:</span> <span>{this.state.location}</span></li>
                <li><span>Description:</span> <span>{this.state.description}</span></li>
              </ul> 
              <hr/>
            </Col>
          </Row>
        </fieldset>;
      }
      else if (this.state.isRecurrent === "recurring"){
        wizardContent = 
        <fieldset> 
          <Row>
            <Col xs="12" sm="12" md="12" lg="12">
              <i className="fa fa-check-circle icon-pass cycle-status" style={{fontSize: '21px', color: '#28A745', paddingRight: '1%'}}></i>
              <label className="inputName" style={{fontSize: '21px'}}>{this.state.name}</label>
              <ul style={{fontSize: '15px'}}>
                <li><span>Instructor:</span> <span>Leyla Kinaze</span></li>
                <li><span>Capacity:</span> <span>{this.state.capacity}</span></li>
                <li><span>Type of event:</span> <span>Recurring</span></li>
                <li><span>Day of the week:</span> <span>{this.state.daysSelected.join(", ")}</span></li>
                <li><span>Time:</span> <span>From {this.state.startTime} to {this.state.endTime}</span></li>
                <li><span>Recurring basis:</span> <span>{this.state.rSelected} from {moment(this.state.startDate).format("MMMM Do YYYY")} to {moment(this.state.endDate).format("MMMM Do YYYY")}</span></li>
                <li><span>Location:</span> <span>{this.state.location}</span></li>
                <li><span>Description:</span> <span>{this.state.description}</span></li>
              </ul> 
              <hr/>
            </Col>
          </Row>
        </fieldset>;
      }
    }

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
                        events={this.state.events.map(calendarInput => calendarInput.calendarInfo)}
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
                              && (
                              <Button style={{ marginLeft: 8 }} onClick={() => this.prevStep()}>
                                Previous
                              </Button>
                              )
                            }
                            {
                              this.state.step < steps.length - 1
                              && <Button className="" onClick={() => this.nextStep()}>Next</Button>
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
                              this.state.step < steps.length - 1
                              && <Button onClick={() => this.nextStep()}>Next</Button>
                            }
                            {
                              this.state.step === steps.length - 1
                              && <Button onClick={() => message.success('Processing complete!')}>Done</Button>
                            }
                            {
                              this.state.step > 0
                              && (
                              <Button style={{ marginLeft: 8 }} onClick={() => this.prevStep()}>
                                Previous
                              </Button>
                              )
                            }
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                  </ModalFooter>
                </Modal>
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

export default App;
