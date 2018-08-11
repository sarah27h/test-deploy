import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';

export class MapContainer extends Component {

    state = {
        fetchedData : '',
        isLoading : false
    }

    // method to display error message to use depends on the error
    handleError = (message) => {
        let errorParagraph = document.createElement("P");
        let mapWrapperDiv = document.querySelector('.mapWrapper');
        console.log(document.querySelector('.mapWrapper'));
        mapWrapperDiv.appendChild(errorParagraph);
        mapWrapperDiv.insertBefore(errorParagraph, mapWrapperDiv.firstChild);
        errorParagraph.setAttribute('class', 'error')
        errorParagraph.innerHTML = message;
    }

    /* 
        * This methode base on this stackoverflow question and
        * react-async-script-loader package
        * https://www.npmjs.com/package/react-async-script-loader
        *
        * https://stackoverflow.com/questions/41709765/how
        -to-load-the-google-maps-api-script-in-my-react-app-only-when-it-is-require 
        * it help me to load Maps async
    */
    componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed, query, fetchedData }) {
        if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished

          if (isScriptLoadSucceed) {
            console.log(this.state.fetchedData);

            // create our map add its center
            let map = new window.google.maps.Map(document.getElementById('map'), {
                center: {lat: 30.052635, lng: 31.236145},
                zoom: 12
            });

            // add title = "Google Maps" for map iframe when map is loaded
            window.google.maps.event.addListenerOnce(map, 'idle', () => {
                document.getElementsByTagName('iframe')[0].title = "Google Maps";
            })
            

            // create infowindow to add it later to every marker when clicked
            let infowindow = new window.google.maps.InfoWindow();
            let markers = [];

            // add marker to every location
            this.props.locations.forEach((location, index) => {
                let marker = new window.google.maps.Marker({
                    map: map,
                    position: {lat: location.location.lat, lng: location.location.lng},
                    title: location.title,
                    id: index
                });
                
                
                // add click listener for every marker
                marker.addListener('click', () =>{
                    console.log(marker.get('id'), marker);
                    console.log(marker.title);

                    // call fecthData and pass clicked marker to fetch data based on its location
                    fecthData(marker);

                    // animate clicked marker
                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                    // marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
                    // stop animation
                    setTimeout(function() { 
                        marker.setAnimation(null); 
                    }, 1500);

                })

                markers.push(marker);              
            })
            
            this.props.onUpdateMarkers(markers);
            
            // fetch data from FourSquare API
            // https://developer.foursquare.com/
            let fecthData = (marker) =>  {
                let address;
                let lat = marker.getPosition().lat();
                let lng = marker.getPosition().lng();
                let url = 'https://api.foursquare.com/v2/venues/search?client_id=F4JVCTXHB3C2Y1TOJFRQZEXGZI4JMGLFXF0G2ZZ10OEBFO5A&client_secret=M3K4KIBHLKEPXHU15VMWOMOAVBRGEG0M4RPX5X534HVZDRHC&ll='+ lat + ',' + lng + '&limit=1&v=20180801';
                //' + 'query=' + this.state.locations[0].title + '
                
                /*
                    * I take just that its recommended to add message 'Loading ...'
                    *  because fetch may take some time
                    * to improve user experience
                    * https://www.robinwieruch.de/react-fetching-data/
                */
                this.setState({ isLoading : true, fetchedData : 'Loading ...' }, () => {
                        makeInfoWindow(marker, infowindow);
                    }
                );
                

                //send request to fetch data from FourSquare API
                fetch(url)
                    .then( response => response.json())
                    .then(result => {

                        // store address data we want from result object
                        address = result.response.venues[0].location.formattedAddress.join(', ');

                        // handle case: if FourSquare have data we request or not
                        if (address) {
                            // update fetchedData state with data
                            this.setState({ fetchedData : address, isLoading : false });

                        } else {
                            this.setState({ fetchedData : 'Error :(' });
                        }

                        // pass marker and infowindow to display data
                        makeInfoWindow(marker, infowindow);
                    })
                    // handle case: if fetch request fails or network issues
                    .catch(error =>
                        //case when I delete from API key give me Cannot read property '0' of undefined
                        this.setState({ fetchedData : 'Something went wrong failed to fetch address data for this location :( try again', isLoading : false}, () => {
                                // pass marker and infowindow to display error
                                makeInfoWindow(marker, infowindow)
                            }
                        
                        ))
                
            }

            // add a changable content based on which marker is clicked
            let makeInfoWindow = (marker, infowindow) => {
                console.log(this.state.fetchedData);
                console.log(this);
                
                infowindow.setContent('<div style="height: 7em; overflow-y: auto; width: 19em;">' +
                 '<p style="margin: 10px 0;;font-weight: bold;font-size: 14px;">'  + marker.title + '</p>' +
                  '<p style="color: #002c94;font-weight: bold;font-size: 14px;">' + this.state.fetchedData + '</p>'+
                   '</div>' );
                
                // link infowindow with map to show in and with its anchor
                infowindow.open(map, marker);
                
            }

          } else {
            // handle Google API script didn't load 
            // to test that case pass an empty [""] 
            // in the scriptLoader([""])([WrappedComponent])
           this.handleError("Sorry, something went wrong script not loaded");
          } 
        }
      }

      componentDidMount() {
        // handle API key error & query limit message
        //https://stackoverflow.com/questions/45633672/detect-query-limit-
        //message-on-map-load-with-google-maps-javascript-api
        window.gm_authFailure = () => {
            this.handleError("Sorry, something went wrong with API key");
        };
      }
      
    
    render() {

        console.log(this.props.locations);
        console.log(this.props.markers);
        console.log(this.props.query);
  
        return(
            <div className="mapWrapper">
                <div id="map" aria-label="location" role="application" onClick = {(e) => {this.props.onMarkerclick(e.target)}}>
                </div>
            </div>
        )
    }
}

export default scriptLoader(
    // from google maps API
    // https://www.google.com/maps
    ["https://maps.googleapis.com/maps/api/js?key=AIzaSyC8oJajiPzKCrwCSkGxQ1mnF9fMrXYGSlc&v=3"]
)(MapContainer)