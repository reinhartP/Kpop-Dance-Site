import React, { Component } from 'react';
import { Modal, Container, Grid } from 'semantic-ui-react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

function ArtistList(props) {
    if (props.artists.length > 0) {
        return (
            <div>
                <ul>
                    {props.artists.map((artist, index) => {
                        return (
                            <div>
                                <li
                                    style={{
                                        textAlign: 'left',
                                        color: 'white',
                                    }}
                                >
                                    {artist.artist}
                                </li>
                                <ul>
                                    {artist.songs.map((song, index) => {
                                        return (
                                            <li
                                                style={{
                                                    textAlign: 'left',
                                                    color: 'white',
                                                }}
                                            >
                                                <Modal
                                                    style={{
                                                        backgroundColor:
                                                            '#202124',
                                                    }}
                                                    trigger={
                                                        <a
                                                            style={{
                                                                cursor:
                                                                    'pointer',
                                                            }}
                                                        >
                                                            {song.title}
                                                        </a>
                                                    }
                                                    centered={false}
                                                    size="fullscreen"
                                                    closeIcon
                                                >
                                                    <Modal.Description>
                                                        <iframe
                                                            style={{
                                                                width: '100%',
                                                                height: '720px',
                                                            }}
                                                            src={`player/${
                                                                song.id
                                                            }`}
                                                        />
                                                    </Modal.Description>
                                                </Modal>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </ul>
            </div>
        );
    }
    return <div />;
}

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
        return (
            <div>
                <ArtistList artists={this.state.artists} />
            </div>
        );
    }
}

export default Home;
