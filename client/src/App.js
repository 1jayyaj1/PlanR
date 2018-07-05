import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
// import Modal from 'react-awesome-modal';
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      modal : false,
      display : 0,
    }

    this.toggle = this.toggle.bind(this);
    this.next = this.next.bind(this);
  }

  // openModal() {
  //     this.setState({
  //         visible : true
  //     });
  // }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  next() {
    this.setState({
      display: this.state.display + 1
    });
  }


  render() {

    return (

    <div>
      <div class="welcome d-flex justify-content-center flex-column">
        <div class="container">
          <nav class="navbar navbar-expand-lg navbar-dark pt-4 px-0">
            <a class="navbar-brand" href="#">
              Umba
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav">
                <li class="nav-item active">
                  <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">My profile</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Log Out</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div class="inner-wrapper mt-auto mb-auto container">
          <div class="row">
            <div class="col-md-7">
                <h1 class="welcome-heading display-4 text-white">Let's move.</h1>
                <button href="#our-services" class="btn btn-lg btn-outline-white btn-pill align-self-center">Get started</button>
            </div>
          </div>
        </div>
      </div>

      <div id="our-services" class="our-services section py-4">
        <h3 class="section-title text-center my-5">Your schedule</h3>


      <div class="container py-4">
          <div class="row justify-content-md-center px-4">
            <div class="contact-form col-sm-12 col-md-12 col-lg-12 p-4 mb-4 card"> 
              <div className="calendar" style={{height: '700px', width: '100%', paddingTop: '5%'}}>
              <BigCalendar
                  selectable={true}
                  min={new Date('2018, 1, 7, 09:00')}
                  max={new Date('2018, 1, 7, 18:00')}
                  defaultView='week'
                  onSelectEvent={event => alert(event.title)}
                onSelectSlot={() => this.toggle()}
                events={[{
                    'title': 'Woohoo2',
                    'allDay': false,
                    'start': moment().add(22, "hours").toDate(),
                    'end': moment().add(23, "hours").toDate()
                  }
                  ]}
                  startAccessor='start'
                  endAccessor='end'
              />
              <div>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>New Event</ModalHeader>
                  <ModalBody>
                   {/* <Row>
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
                  </Row> */}


                  <Form>
                    <h6 className="text-muted"> Progress </h6>
                    <div className="progress progress-lg">
                      <div className="progress-bar bg-success" role="progressbar" Style="width: 20%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">20%</div>
                    </div>
                    <fieldset className={ "fadeout " + (this.state.display == 0 ? "active" : "") }> 
                      <Row>
                        <Col xs="8" sm="8" md="8" lg="8">
                          <label className="inputName">Name 1</label>
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
                    </fieldset>
                    <fieldset  className={ "fadeout " + (this.state.display == 1 ? "active" : "") }> 
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
                    </fieldset>
                  </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Row>
                      <Col>
                        <Button className="btn btn-secondary" onClick={this.toggle}>Previous</Button>
                        <Button className="btn btn-success" Style="width: 93px" onClick={this.next}>Next</Button>
                      </Col>
                    </Row>
                  </ModalFooter>
                </Modal>



            </div>
        </div>


            </div>
          </div>
        </div>

      </div>

      {/*<div class="contact section-invert py-4">
        <h3 class="section-title text-center m-5">Contact Us</h3>
        <div class="container py-4">
          <div class="row justify-content-md-center px-4">
            <div class="contact-form col-sm-12 col-md-10 col-lg-7 p-4 mb-4 card">
              <form>
                <div class="row">
                  <div class="col-md-6 col-sm-12">
                    <div class="form-group">
                      <label for="contactFormFullName">Full Name</label>
                      <input type="email" class="form-control" id="contactFormFullName" placeholder="Enter your full name" />
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <div class="form-group">
                      <label for="contactFormEmail">Email address</label>
                      <input type="email" class="form-control" id="contactFormEmail" placeholder="Enter your email address" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                        <label for="exampleInputMessage1">Message</label>
                        <textarea id="exampleInputMessage1" class="form-control mb-4" rows="10" placeholder="Enter your message..." name="message"></textarea>
                    </div>
                  </div>
                </div>
                <input class="btn btn-primary btn-pill d-flex ml-auto mr-auto" type="submit" value="Send Your Message" />
              </form>
            </div>
          </div>
        </div>
      </div>*/}

      <footer>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container">
            <a class="navbar-brand" href="#">Ericsson</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                  <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Our Services</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">My profile</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Contact Us</a>
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

{/* <form style={{paddingRight: '4%',  paddingTop: '5%'}}>
                              <Form.TextArea
                              onChange={(e) => this.setState({text: e.target.value})}
                              value={this.state.text} placeholder="What are you planning?" style={{maxHeight: '160pt', minHeight: '160pt', resize: 'none'}}/>
                          </form> */}

export default App;



// <label class="inputName">Location</label>
// <div class="ui input" style={{paddingBottom: '5%', paddingTop: '5%', width: '100%'}}>
//   <input type="text" placeholder="Where is it taking place?" />
// </div><br/>

// <label class="inputName">Capacity</label>
// <div class="ui input" style={{ paddingTop: '5%', width: '100%'}}>
//   <input type="text" placeholder="How many attendees?" />
// </div>
// </div>
// <div class="col-lg-12">
// <label class="inputName">Description</label>
// </div>
// {/*<a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>*/}


// <Modal 
// visible={this.state.visible}
// width="35%"
// height="35%"
// effect="fadeInUp"
// onClickAway={() => this.closeModal()}>
// <h1 style={{paddingTop: '4%', paddingLeft: '4%',  paddingBottom: '2%', fontSize: '30pt'}}>New Event</h1>
// <div className="row">
//     <div class="col-lg-12 col-md-12">
//       <label class="inputName">Name</label>
//       <input type="text" placeholder="What will it be called?" />
//     </div>
// </div>
// </Modal>