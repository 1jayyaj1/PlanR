import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
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
      <div className="calendar" style={{height: '700px', width: '100%', paddingLeft: '15%', paddingRight: '15%', paddingTop: '5%', height: '10%'}}>
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
              'start': moment().add(5, "hours").toDate(),
              'end': moment().add(6, "hours").toDate()
            }
            ]}
            startAccessor='start'
            endAccessor='end'
        />
        <div>
        <Modal 
            visible={this.state.visible}
            width="40%"
            height="50%"
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
                   <div class="ui input" style={{paddingBottom: '5%', paddingTop: '5%', width: '100%'}}>
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
    );
  }
}

export default App;
