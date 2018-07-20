import React, { Component } from 'react';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Button, ButtonGroup, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';
import { Steps, message } from 'antd';
import 'antd/dist/antd.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';

const Step = Steps.Step;

const steps = [{
  title: 'Basic info',
}, {
  title: 'Schedule',
}, {
  title: 'Summary',
}];

var events =
  [
    {
      capacity: "",
      location: "",
      description: "",
      recurrenceSelectorSwitch: "",
      recurrence: "",
      weeklyOcurrence: "",
      allDay: "",
      calendarInfo: 
        {
          title: 'Woohoo2',
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
      modal : false,
      modal2: false,
      modal3: false,
      display : 0,
      step: 0,
      cSelected: [],
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      capacity: "",
      recurrenceSelectorSwitch: "",
      recurrence: "",
      allDay: "",
      weeklyOcurrence: "",
      events: events
    }

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.toggle3 = this.toggle3.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
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

  onRadioBtnClick(allDay) {
    this.setState({ allDay });
  }

  onCheckboxBtnClick(selected) {
    const index = this.state.cSelected.indexOf(selected);
    if (index < 0) {
      this.state.cSelected.push(selected);
    } else {
      this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected] });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

   toggle2() {
    this.setState({
      modal2: !this.state.modal2
    });
  }
  toggle3() {
    this.setState({
      modal3: !this.state.modal3
    });
  }

  next() {
    this.setState({
      display: this.state.display + 1
    });
  }

  previous() {
    this.setState({
      display: this.state.display - 1
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
    var eDate = moment(this.state.endDate).format()
    var event = {
      title: this.state.name,
      allDay: false,
      start:  new Date(sDate) ,
      end: new Date(eDate)
    }
    var obj = {capacity: this.state.capacity, description: this.state.description, location: this.state.location, recurrenceSelectorSwitch: this.state.recurrenceSelectorSwitch, recurrence: this.state.rSelected, allDay: this.state.allDay, weeklyOcurrence: this.state.cSelected, calendarInfo: event }
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
                      <select class="custom-select w-100" required="" name="recurrenceSelectorSwitch" value={this.state.recurrenceSelectorSwitch} onChange={this.handleChange}>
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
      if (this.state.recurrenceSelectorSwitch === "recurring"){
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
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Monday")} active={this.state.cSelected.includes("Monday")}>Monday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Tuesday")} active={this.state.cSelected.includes("Tuesday")}>Tuesday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Wednesday")} active={this.state.cSelected.includes("Wednesday")}>Wednesday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Thursday")} active={this.state.cSelected.includes("Thursday")}>Thursday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick("Friday")} active={this.state.cSelected.includes("Friday")}>Friday</Button>
              </ButtonGroup>
            </Col>
          </Row>
        </fieldset>;
      }
      else if (this.state.recurrenceSelectorSwitch === "non-recurring"){
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
                <div class="custom-control custom-toggle d-block my-2">
                  <input type="checkbox" id="customToggle1" name="customToggle1" class="custom-control-input"/>
                  <label class="custom-control-label" for="customToggle1">Will your event last all day?</label>
                </div>
              </fieldset>
            </Col>
          </Row>
        </fieldset>;
      }
    }  else {
      if (this.state.recurrenceSelectorSwitch === "non-recurring"){
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
                <li><span>All-day event:</span> <span>{this.state.allDay}</span></li>
                <li><span>Time & date:</span> <span>{moment(this.state.startDate).format("dddd [,] MMMM Do YYYY")} from {this.state.startTime} to {this.state.endTime}</span></li>
                <li><span>Location:</span> <span>{this.state.location}</span></li>
                <li><span>Description:</span> <span>{this.state.description}</span></li>
              </ul> 
              <hr/>
            </Col>
          </Row>
        </fieldset>;
      }
      else if (this.state.recurrenceSelectorSwitch === "recurring"){
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
                <li><span>Day of the week:</span> <span>{this.state.cSelected.join(", ")}</span></li>
                <li><span>Time:</span> <span>From {moment(this.state.startDate).format("H:mm")} to {moment(this.state.endDate).format("HH:mm")}</span></li>
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
                        onSelectEvent={() => this.toggle3()}
                        onSelectSlot={(date) => this.toggle(date)}
                        events={this.state.events.map(calendarInput => calendarInput.calendarInfo)}
                          startAccessor='start'
                          endAccessor='end'>
                      </BigCalendar>
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" style={{paddingTop: '3%'}}>
                    <Button className="btn btn-outline-danger btn-pill" style={{float: 'right'}} onClick={this.toggle2}>Register</Button>
                  </Col>
                </Row>

                {/*<----------------------- EVENT CREATION MODAL ----------------------->*/}
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="eventCreationModal" className={this.props.className}>
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
                <Modal isOpen={this.state.modal2} toggle={this.toggle2} className={this.props.className}>
                  <ModalHeader toggle={this.toggle2}>New Event</ModalHeader>
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
                <Modal isOpen={this.state.modal3} toggle={this.toggle3} className={this.props.className}>
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
