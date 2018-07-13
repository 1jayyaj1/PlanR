import React, { Component } from 'react';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';
import { Steps, message } from 'antd';
import 'antd/dist/antd.css';

const Step = Steps.Step;

const steps = [{
  title: 'First',
}, {
  title: 'Second',
}, {
  title: 'Last',
}];

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
    }

    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.toggle3 = this.toggle3.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
  }

  toggle(date) {
    console.log(date); // TODO (Jay): this object contains info about the event created
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


  render() {

    let wizardContent;
    if (this.state.step === 0) {
      wizardContent = 
        <fieldset> 
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Name</label>
              <Input placeholder="What will it be called?" />
            </Col>
          </Row>
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Email</label>
              <Input placeholder="Your email" />
            </Col>
          </Row>
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Ho ho</label>
              <Input placeholder="Jay will be mad af" />
            </Col>
          </Row>
        </fieldset>;
    }
    else if (this.state.step === 1) {
      wizardContent = 
        <fieldset> 
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Name 1</label>
              <Input placeholder="What will it be called?" />
            </Col>
          </Row>
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Email 1</label>
              <Input placeholder="Your email" />
            </Col>
          </Row>
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Ho ho 1</label>
              <Input placeholder="Jay will be mad af" />
            </Col>
          </Row>
        </fieldset>;
    }  else {
        wizardContent = 
        <fieldset> 
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Name 2</label>
              <Input placeholder="What will it be called?" />
            </Col>
          </Row>
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Email 2</label>
              <Input placeholder="Your email" />
            </Col>
          </Row>
          <Row>
            <Col xs="8" sm="8" md="8" lg="8">
              <label className="inputName">Ho ho 2</label>
              <Input placeholder="Jay will be mad af" />
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
                        events={[{
                            'title': 'Woohoo2',
                            'allDay': false,
                            'start': moment().add(22, "hours").toDate(),
                            'end': moment().add(23, "hours").toDate()
                          }]}
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
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
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
                              this.state.step < steps.length - 1
                              && <Button onClick={() => this.nextStep()}>Next</Button>
                            }
                            {
                              this.state.step === steps.length - 1
                              && <Button type="button">Done</Button>
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
