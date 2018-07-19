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
      'title': 'Woohoo2',
      'allDay': false,
      'start': new Date('2018-07-17T10:24:00'),
      'end': new Date('2018-07-17T11:27:00')
    },
    {
      'title': 'Woohoo3',
      'allDay': false,
      'start': new Date('2018-07-18T10:24:00'),
      'end': new Date('2018-07-18T11:27:00')
    },
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
      location: "",
      capacity: 0
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

    this.setState({
      name: name,
      location: location,
      description: description,
      capacity: capacity
    });
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
                  <fieldset>
                      <select className="inputRecurrence" class="custom-select w-100" required="">
                        <option value="">Will it be a recurring event?</option>
                        <option value="1">Yes</option>
                        <option value="2">No</option>
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
            <Col xs="10" sm="10" md="8" lg="10">
              <label className="inputName">Date</label>
                <div className="input-daterange input-group" id="datepicker-example-2">
                  <span className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-calendar"></i>
                        </span>
                          </span>
                            <input type="text" className="input-sm form-control" name="start" placeholder="Start Date"/>
                            <input type="text" className="input-sm form-control" name="end" placeholder="End Date"/>
                          <span className="input-group-append">
                        <span className="input-group-text">
                      <i className="fa fa-calendar"></i>
                    </span>
                      <DatePicker selected={this.state.startDate} onChange={this.handleChangeStart} className="input-sm form-control startDate" name="start" placeholderText="Start date"/>
                      <DatePicker selected={this.state.endDate} onChange={this.handleChangeEnd} className="input-sm form-control endDate" name="end" placeholderText="End date"/>
                    <span className="input-group-prepend" id="endIcon">
                      <span className="input-group-text" id="endIcon">
                        <i className="fa fa-calendar"></i>
                      </span>
                    </span>
                   </Row>
                </div>
            </Col>
          </Row><br/>
          <Row>
            <Col xs="10" sm="10" md="10" lg="10">
              <Row className="startTime">
                <Col xs="6" sm="6" md="6" lg="6">
                  <label className="inputName">Start time</label>
                    <fieldset>
                      <select class="custom-select w-100" required="">
                        <option value="">When will it start?</option>
                        <option value="1">9:00AM</option>
                        <option value="2">9:15AM</option>
                        <option value="3">9:30AM</option>
                        <option value="4">9:45AM</option>
                        <option value="5">10:00AM</option>
                        <option value="6">10:15AM</option>
                        <option value="7">10:30AM</option>
                        <option value="8">10:45AM</option>
                        <option value="9">11:00AM</option>
                        <option value="10">11:15AM</option>
                        <option value="11">11:30AM</option>
                        <option value="12">11:45AM</option>
                        <option value="13">12:00PM</option>
                        <option value="14">12:15PM</option>
                        <option value="15">12:30PM</option>
                        <option value="16">12:45PM</option>
                        <option value="17">13:00PM</option>
                        <option value="18">13:15PM</option>
                        <option value="19">13:30PM</option>
                        <option value="20">13:45PM</option>
                        <option value="21">14:00PM</option>
                        <option value="22">14:15PM</option>
                        <option value="23">14:30PM</option>
                        <option value="24">14:45PM</option>
                        <option value="25">15:00PM</option>
                        <option value="26">15:15PM</option>
                        <option value="27">15:30PM</option>
                        <option value="28">15:45PM</option>
                        <option value="29">16:00PM</option>
                        <option value="30">16:15PM</option>
                        <option value="31">16:30PM</option>
                        <option value="32">16:45PM</option>
                        <option value="33">17:00PM</option>
                        <option value="34">17:15PM</option>
                        <option value="35">17:30PM</option>
                        <option value="36">17:45PM</option>
                        <option value="37">18:00PM</option>
                      </select>
                    </fieldset>
                </Col>
                <Col xs="6" sm="6" md="6" lg="6">
                  <label className="inputName">End time</label>
                  <fieldset>
                      <select class="custom-select w-100" required="">
                        <option value="">When will it end?</option>
                        <option value="1">9:00AM</option>
                        <option value="2">9:15AM</option>
                        <option value="3">9:30AM</option>
                        <option value="4">9:45AM</option>
                        <option value="5">10:00AM</option>
                        <option value="6">10:15AM</option>
                        <option value="7">10:30AM</option>
                        <option value="8">10:45AM</option>
                        <option value="9">11:00AM</option>
                        <option value="10">11:15AM</option>
                        <option value="11">11:30AM</option>
                        <option value="12">11:45AM</option>
                        <option value="13">12:00PM</option>
                        <option value="14">12:15PM</option>
                        <option value="15">12:30PM</option>
                        <option value="16">12:45PM</option>
                        <option value="17">13:00PM</option>
                        <option value="18">13:15PM</option>
                        <option value="19">13:30PM</option>
                        <option value="20">13:45PM</option>
                        <option value="21">14:00PM</option>
                        <option value="22">14:15PM</option>
                        <option value="23">14:30PM</option>
                        <option value="24">14:45PM</option>
                        <option value="25">15:00PM</option>
                        <option value="26">15:15PM</option>
                        <option value="27">15:30PM</option>
                        <option value="28">15:45PM</option>
                        <option value="29">16:00PM</option>
                        <option value="30">16:15PM</option>
                        <option value="31">16:30PM</option>
                        <option value="32">16:45PM</option>
                        <option value="33">17:00PM</option>
                        <option value="34">17:15PM</option>
                        <option value="35">17:30PM</option>
                        <option value="36">17:45PM</option>
                        <option value="37">18:00PM</option>
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
                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.rSelected === 1} >Weekly</Button>
                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.rSelected === 2}>Biweekly</Button>
                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.onRadioBtnClick(3)} active={this.state.rSelected === 3}>Triweekly</Button>
                <Button className="radioButtons" Style="font-size: 12pt;" color="secondary" onClick={() => this.onRadioBtnClick(4)} active={this.state.rSelected === 4}>Monthly</Button>
              </ButtonGroup>
            </Col>
          </Row><br/>
          <Row className="occurenceLabel">
            <Col xs="10" sm="10" md="10" lg="10">
              <label className="inputName">Weekly Occurence</label>
              <ButtonGroup>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick(1)} active={this.state.cSelected.includes(1)}>Monday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick(2)} active={this.state.cSelected.includes(2)}>Tuesday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick(3)} active={this.state.cSelected.includes(3)}>Wednesday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick(4)} active={this.state.cSelected.includes(4)}>Thursday</Button>
                <Button className="checkButtons" Style="font-size: 11.5pt;" color="secondary" onClick={() => this.onCheckboxBtnClick(5)} active={this.state.cSelected.includes(5)}>Friday</Button>
              </ButtonGroup>
            </Col>
          </Row>
        </fieldset>;
    }  else {
        wizardContent = 
        <fieldset> 
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
        </fieldset>;
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
                        events={events}
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
