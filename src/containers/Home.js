import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';
import axios from 'axios';

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faMusic } from '@fortawesome/free-solid-svg-icons';
import GridList from '../components/GridList';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artists: {},
            isLoading: true,
        };
    }
    async componentDidMount() {
        document.body.style.background = '#202124';
        await axios
            .get('https://kpop-dance-backend.herokuapp.com/api/artists')
            .then(response => {
                console.log(response.data);
                if (response !== null)
                    this.setState({
                        isLoading: false,
                        artists: response.data.info,
                    });
            });
    }
    render() {
        if(!this.state.isLoading)
        {
        return (
            <div>
                <GridList artists={this.state.artists}></GridList>
            </div>
        );
        }
        return (
            <div>
                <Loader active={this.state.isLoading}/>
            </div>
        )
    }
}

export default Home;
