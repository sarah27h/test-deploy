import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import './App.css';
import Header from './components/Header'
import MapContainer from './components/MapContainer'
import LocationFilter from './components/LocationFilter'
import LocationsList from './components/LocationsList'


class App extends Component {

  state = {
    locations : [
      {title: 'Egyptian Museum', location: {lat: 30.048218, lng: 31.233628}},
      {title: 'Papyrus Museum', location: {lat: 29.990026, lng: 31.148380}},
      {title: 'Coptic Museum', location: {lat: 30.006382, lng: 31.230183}},
      {title: 'Museum of Islamic Art', location: {lat: 30.044696, lng: 31.252347}},
      {title: 'Child Museum', location: {lat: 30.102544, lng: 31.336957}},
      {title: 'Mohamed Ali Palace', location: {lat: 30.027732, lng: 31.228968}},
      {title: 'Om Kalthoum Museum', location: {lat: 30.007673, lng: 31.225282}},
      {title: 'Cheops Boat Museum', location: {lat: 29.978258, lng: 31.134607}},
      {title: 'Imhotep Museum', location: {lat: 29.870606, lng: 31.225019}},
      // {title: 'Agricultural Museum', location: {lat: 30.046214, lng: 31.210697}},
      {title: 'Abdeen Palace Museum', location: {lat: 30.043375, lng: 31.247780}},
      {title: 'Gayer Anderson Museum', location: {lat: 30.028609, lng: 31.250744}},
      {title: 'Museum of Egyptian Modern Art', location: {lat: 30.043884, lng: 31.224628}},
      {title: 'Mahmoud Moukhtar Museum', location: {lat: 30.040948, lng: 31.222923}},
      {title: 'National Military Museum', location: {lat: 30.034995, lng: 31.261564}}
    ],
    clickedLi : undefined,
    query: '',
    filteredLocations : [],
    markers : [],
    filteredMarkers : [],
    clickedMarker : [],
    listOpen: true
  }

  markerPosition = (marker) => {
    this.setState({ clickedMarker : marker }, () => {
      console.log(this.state.marker);
    })
  }

  markerclicked = (target) => {
      console.log(target);  
  }

  // store markers in markers state property
  updateMarkers = (markers) => {
    this.setState({ markers : markers }, () => {
      console.log(this.state.markers);
    })

  }

  // add filter functionality for locations and markers depend on query state
  updateQuery = (query) => {
    let filteredLocations;
    let filteredMarkers;

    this.setState({query : query}, () => {

      const match = new RegExp(escapeRegExp(this.state.query), 'i');

      if(this.state.query !== '') {

        // add matched markers title to query to filteredMarkers and show them
        filteredMarkers = this.state.markers.filter( (marker) => (match.test(marker.title)));
        filteredMarkers.map((marker) => marker.setVisible(true));

        // add not matched markers title to query to filteredMarkers and hide them
        filteredMarkers = this.state.markers.filter( (marker) => !(match.test(marker.title)));
        filteredMarkers.map((marker) => marker.setVisible(false));

        // add matched location title to query to filteredLocations
        
        filteredLocations = this.state.locations.filter( (location) => match.test(location.title));
        filteredLocations.sort(sortBy('title'));
        console.log(this.state.markers);
        console.log(filteredMarkers);

        // updated filteredLocations state
        this.setState({filteredLocations : filteredLocations}, () => {
          console.log(this.state.filteredMarkers);
          console.log(this.state.filteredLocations);
          console.log(this.state.locations);
        });
          
      } else if (this.state.query === '') {
        // updated filteredLocations state to hold all locations
        this.setState({filteredLocations : this.state.locations, filteredMarkers : this.state.markers}, () => {
          // show all markers when query is empty
          this.state.markers.map((marker) =>marker.setVisible(true));
          console.log(this.state.filteredLocations);
          console.log(this.state.locations);
        });
          
      }

    })
  }


  // get clicked li and then simulate click on marker to open infowindow
  handleClickedLi = (index, target) => {
    this.setState({clickedLi : target.id}, () => {
      console.log(target.innerHTML);
      let liTitle = target.innerHTML;
      let targetMarker = this.state.markers.filter((marker) => marker.title === liTitle);
      console.log(targetMarker[0].id);
      console.log(targetMarker[0].title);

      // a hack for IE11 to work with NodeList.forEach
      // to get ride of this error Object doesn't support property or method 'forEach'
		  NodeList.prototype.forEach = Array.prototype.forEach;
    
      //get map marker for mobile and desktop
      let gmnoprints = document.querySelectorAll('div.gmnoprint');
      let areas = document.querySelectorAll('area');

        gmnoprints.forEach(function(gmnoprint) {
          // for mobile devices check if marker is gmnoprint div contains 'title' 
          if(gmnoprint.hasAttribute('title')) {
            console.log(gmnoprint);
            if (gmnoprint.getAttribute('title') === targetMarker[0].title){
              //simulate click on marker to open infowindow
              gmnoprint.click();
            }
          } else {
            areas.forEach(function(area) {
                  console.log(area);
                  // for desktop devices check if marker is area contains 'title' 
                  if (area.getAttribute('title') === targetMarker[0].title){
                    //simulate click on marker to open infowindow
                    area.click();
                  }
            });
          }
        });
        
      //   let areas = document.querySelectorAll('area');
      //   areas.forEach(function(area) {
      //     console.log(area);
      //     if (area.getAttribute('title') === targetMarker[0].title){
      //       area.click();
      //     }
      //   });
      // }
      
      
    })
  }


  // methode to handle hamburger icon click
  handleHamburgerClick = () => {
    // by depending on prevState we turn our hamburger icon to toggle button 
    this.setState((prevState) => { return {listOpen: !prevState.listOpen}});
  }

  render() {
    // to store classes for list wrapper
    let listClasses;

    if(!this.state.listOpen) {
      // class to hide list
      listClasses = 'locations_section hide'
    } else {
      // class to show list
      listClasses = 'locations_section'
    }

    return (
      <div className="App">

        <Header
          handleHamburgerClick={this.handleHamburgerClick}
        />

        <nav  className={listClasses}>
          <LocationFilter 
            onUpdateQuery={this.updateQuery}
            query={this.state.query}
          />

          <LocationsList 
            locations={this.state.locations}
            onClicked={this.handleClickedLi}
            clicked={this.props.clicked}
            query={this.state.query}
            filteredLocations={this.state.filteredLocations}
          />
        </nav >

        <MapContainer 
          locations={this.state.locations}
          clickedLi={this.state.clickedLi}
          onMarkerclick={this.markerclicked}
          query={this.state.query}
          onUpdateMarkers={this.updateMarkers}
          getMarkerPosition={this.markerPosition}
        />

      </div>
    );
  }
}

export default App;
