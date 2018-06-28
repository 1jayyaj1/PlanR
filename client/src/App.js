import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class App extends Component {
  constructor() {
    super();

    this.state = {
      events: []
    }
  }

  render() {
    return (
      <div className="calendar" style={{height: '700px', width: '75%', padding: '5%'}}>
        <BigCalendar
            selectable={true}
           events={[{
              'title': 'Woohoo',
              'allDay': false,
              'start': moment().toDate(),
              'end': moment().add(4, "hours").toDate()
            },
            {
              'title': 'Ok',
              'allDay': false,
              'start': moment().add(1, "day").toDate(),
              'end': moment().add(26, "hours").toDate()
            }
            ]}
            startAccessor='start'
            endAccessor='end'
        />
      </div>
    );
  }
}

export default App;
