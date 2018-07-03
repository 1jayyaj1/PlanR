import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-awesome-modal';
import 'semantic-ui-css/semantic.min.css';
import { Form, Input, TextArea, Button } from 'semantic-ui-react'


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      visible : false
    }
  }

  openModal() {
      this.setState({
          visible : true
      });
  }

  closeModal() {
      this.setState({
          visible : false
      });
  }



  render() {

    return (

    <div>
      <div class="welcome d-flex justify-content-center flex-column">
        <div class="container">
          <nav class="navbar navbar-expand-lg navbar-dark pt-4 px-0">
            <a class="navbar-brand" href="#">
              <img src="img/agency-landing/shards-logo-white.svg" class="mr-2" alt="Shards - Agency Landing Page" />
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
                <button href="#our-services" class="btn btn-lg btn-outline-white btn-pill align-self-center">Learn More</button>
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
                onSelectSlot={() => this.openModal()}
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
                <Modal 
                    visible={this.state.visible}
                    width="35%"
                    height="35%"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}>
                    <h1 style={{paddingTop: '4%', paddingLeft: '4%',  paddingBottom: '2%', fontSize: '30pt'}}>New Event</h1>
                    <div style={{paddingLeft: '4%', paddingRight: '4%',}} class="ui grid">
                        <div class="eight wide column" >
                          <label class="inputName">Name</label>
                          <div class="ui input" style={{paddingBottom: '5%', paddingTop: '5%', width: '100%'}}>
                            <input type="text" placeholder="What will it be called?" />
                          </div><br/>

                          <label class="inputName">Location</label>
                          <div class="ui input" style={{paddingBottom: '5%', paddingTop: '5%', width: '100%'}}>
                            <input type="text" placeholder="Where is it taking place?" />
                          </div><br/>

                          <label class="inputName">Capacity</label>
                          <div class="ui input" style={{ paddingTop: '5%', width: '100%'}}>
                            <input type="text" placeholder="How many attendees?" />
                          </div>
                        </div>
                        <div class="eight wide column">
                          <label class="inputName">Description</label>
                          <Form style={{paddingRight: '4%',  paddingTop: '5%'}}>
                              <Form.TextArea
                              onChange={(e) => this.setState({text: e.target.value})}
                              value={this.state.text} placeholder="What are you planning?" style={{maxHeight: '160pt', minHeight: '160pt', resize: 'none'}}/>
                          </Form>
                        </div>
                        {/*<a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>*/}
                    </div>
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

  // render() {

  //   return (
  //     <div className="calendar" style={{height: '700px', width: '100%', paddingLeft: '15%', paddingRight: '15%', paddingTop: '5%', height: '10%'}}>
  //       <BigCalendar
  //           selectable={true}
  //           min={new Date('2018, 1, 7, 09:00')}
  //           max={new Date('2018, 1, 7, 18:00')}
  //           defaultView='week'
  //           onSelectEvent={event => alert(event.title)}
  //         onSelectSlot={() => this.openModal()}
  //          events={[{
  //             'title': 'Woohoo2',
  //             'allDay': false,
  //             'start': moment().add(5, "hours").toDate(),
  //             'end': moment().add(6, "hours").toDate()
  //           }
  //           ]}
  //           startAccessor='start'
  //           endAccessor='end'
  //       />
  //       <div>
  //       <Modal 
  //           visible={this.state.visible}
  //           width="40%"
  //           height="50%"
  //           effect="fadeInUp"
  //           onClickAway={() => this.closeModal()}>
  //           <h1 style={{paddingTop: '4%', paddingLeft: '4%',  paddingBottom: '2%', fontSize: '30pt'}}>New Event</h1>
  //           <div style={{paddingLeft: '4%', paddingRight: '4%',}} class="ui grid">
  //               <div class="eight wide column" >
  //                  <label class="inputName">Name</label>
  //                  <div class="ui input" style={{paddingBottom: '5%', paddingTop: '5%', width: '100%'}}>
  //                    <input type="text" placeholder="What will it be called?" />
  //                  </div><br/>

  //                  <label class="inputName">Location</label>
  //                  <div class="ui input" style={{paddingBottom: '5%', paddingTop: '5%', width: '100%'}}>
  //                    <input type="text" placeholder="Where is it taking place?" />
  //                  </div><br/>

  //                  <label class="inputName">Capacity</label>
  //                  <div class="ui input" style={{paddingBottom: '5%', paddingTop: '5%', width: '100%'}}>
  //                    <input type="text" placeholder="How many attendees?" />
  //                  </div>
  //               </div>
  //               <div class="eight wide column">
  //                  <label class="inputName">Description</label>
  //                  <Form style={{paddingRight: '4%',  paddingTop: '5%'}}>
  //                      <Form.TextArea
  //                      onChange={(e) => this.setState({text: e.target.value})}
  //                      value={this.state.text} placeholder="What are you planning?" style={{maxHeight: '160pt', minHeight: '160pt', resize: 'none'}}/>
  //                  </Form>
  //               </div>
  //               {/*<a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>*/}
  //           </div>
  //       </Modal>
  //       </div>
  //     </div>
  //   );
  // }
}

export default App;
