import React, { Component } from 'react';
import Footer from './Footer'

export class LocationsList extends Component {

    
    render() {
  
      console.log(this.props.locations);
  
      if(this.props.query  && this.props.filteredLocations.length !== 0) {
        
            return (
                <div className="list_wrapper">
                        
                        <ol className="location_list">
                            {this.props.filteredLocations.map((location, index) =>

                                <li role="button" tabIndex="0" className="location_item" id={index} key={index}
                                    // handle mouse click event
                                    onClick={(e) => (this.props.onClicked(index, e.target))}
                                    // handle keypress event
                                    onKeyPress={(e) =>  {if (e.key === " " || e.key === "Enter") {(this.props.onClicked(index, e.target))}}}>
                                    {location.title}

                                </li>
                            
                        )}
                        </ol>

                        <Footer />

                </div>
            )
        } else if(this.props.query && this.props.filteredLocations.length === 0) {

            return (
                <div className="list_wrapper">
                        
                    <p className="infoMessage">No matched location found.</p>
                    <Footer />
                </div>
            )

        } else {

            return (
                <div className="list_wrapper">

                        <ol  className="location_list">

                            {this.props.locations.map((location, index) =>

                                <li role="button" tabIndex="0" className="location_item" id={index} key={index} 
                                    // handle mouse click event
                                    onClick={(e) => (this.props.onClicked(index, e.target))} 
                                    // handle keypress event
                                    onKeyPress={(e) =>  {if (e.key === " " || e.key === "Enter") {(this.props.onClicked(index, e.target))}}} >
                                    
                                    {location.title}

                                </li>
                            
                            )}
                        </ol>

                        <Footer />

                </div>
            )
        }
    }
}


export default LocationsList;