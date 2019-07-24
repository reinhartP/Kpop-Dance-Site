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
        this.sortSongs = this.sortSongs.bind(this);
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
        this.sortSongs();
    }

    sortSongs(type = 'artist asc') {
        function compareArtist(a, b) {
            if (a.artist > b.artist) return 1;
            return -1;
        }
        if (this.state.artists.length > 0)
            switch (type) {
                case 'artist asc':
                    this.setState(currentState => {
                        currentState.artists.sort(compareArtist);
                        return {
                            artists: currentState.artists,
                        };
                    });
                    break;
            }
    }
    render() {
        if (!this.state.isLoading) {
            return (
                <div style={{ paddingTop: '100px' }}>
                    <GridList artists={this.state.artists} />
                </div>
            );
        }
        return (
            <div>
                <Loader active={this.state.isLoading} />
            </div>
        );
    }
}

export default Home;
