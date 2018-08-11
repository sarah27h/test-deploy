import React, { Component } from 'react';

/* global google */

export class MapContainerNative extends Component {

    componentDidMount() {

        // window.initMap = this.initMap;

        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyC8oJajiPzKCrwCSkGxQ1mnF9fMrXYGSlc&v=3&callback=initMap')
    }

    initMap = () => {

        let map = new google.maps.Map(this.refs.map.getDOMNode(), { 
            center: {lat: 30.052635, lng: 31.236145},
            zoom: 12
         });

    }

    
    render() {
        return(
            <div>
                <div ref="map"></div>
            </div>
        )
    }
}

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}


export default MapContainerNative;